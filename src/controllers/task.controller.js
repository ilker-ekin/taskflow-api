import * as taskService from '../services/task.service.js';

const NOT_FOUND = (id) => ({ error: `'${id}' kimlikli görev bulunamadı.` });

export async function createTask(req, res) {
  const task = await taskService.create(req.body);
  res.status(201).json(task);
}

export async function listTasks(req, res) {
  const { status, priority } = req.query;
  const tasks = await taskService.getAll({ status, priority });
  res.json(tasks);
}

export async function getTask(req, res) {
  const task = await taskService.getById(req.params.id);
  if (!task) return res.status(404).json(NOT_FOUND(req.params.id));
  res.json(task);
}

export async function updateTask(req, res) {
  const task = await taskService.update(req.params.id, req.body);
  if (!task) return res.status(404).json(NOT_FOUND(req.params.id));
  res.json(task);
}

export async function deleteTask(req, res) {
  const task = await taskService.remove(req.params.id);
  if (!task) return res.status(404).json(NOT_FOUND(req.params.id));
  res.json({ message: `'${task.title}' başlıklı görev silindi.` });
}
