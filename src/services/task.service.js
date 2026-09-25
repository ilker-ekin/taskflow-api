import { readFile, writeFile, rename, copyFile, access } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

const DATA_FILE = new URL('../../data/tasks.json', import.meta.url);
const SEED_FILE = new URL('../../data/tasks.seed.json', import.meta.url);
const TEMP_FILE = new URL('../../data/tasks.json.tmp', import.meta.url);

const EDITABLE_FIELDS = ['title', 'description', 'status', 'priority', 'assignee'];

// Creates data/tasks.json from the seed file on first run.
async function ensureDataFile() {
  try {
    await access(DATA_FILE);
  } catch {
    await copyFile(SEED_FILE, DATA_FILE);
  }
}

async function readTasks() {
  await ensureDataFile();
  const content = await readFile(DATA_FILE, 'utf8');
  return JSON.parse(content);
}

// Write to a temp file first, then rename, so the data file is never half-written.
async function writeTasks(tasks) {
  await writeFile(TEMP_FILE, JSON.stringify(tasks, null, 2));
  await rename(TEMP_FILE, DATA_FILE);
}

export async function getAll(filters = {}) {
  const tasks = await readTasks();
  return tasks.filter(
    (task) =>
      (!filters.status || task.status === filters.status) &&
      (!filters.priority || task.priority === filters.priority)
  );
}

export async function getById(id) {
  const tasks = await readTasks();
  return tasks.find((task) => task.id === id) ?? null;
}

export async function create(data) {
  const tasks = await readTasks();
  const now = new Date().toISOString();
  const task = {
    id: randomUUID(),
    title: data.title.trim(),
    description: data.description?.trim() ?? '',
    status: data.status ?? 'pending',
    priority: data.priority ?? 'medium',
    assignee: data.assignee.trim(),
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  await writeTasks(tasks);
  return task;
}

export async function update(id, data) {
  const tasks = await readTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;

  for (const field of EDITABLE_FIELDS) {
    if (data[field] !== undefined) task[field] = data[field].trim();
  }
  task.updatedAt = new Date().toISOString();

  await writeTasks(tasks);
  return task;
}

export async function remove(id) {
  const tasks = await readTasks();
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return null;

  const [removed] = tasks.splice(index, 1);
  await writeTasks(tasks);
  return removed;
}

export async function resetFromSeed() {
  await copyFile(SEED_FILE, DATA_FILE);
}
