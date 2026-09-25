import * as taskService from '../services/task.service.js';
import { STATUSES, PRIORITIES } from '../middlewares/validateTask.js';

export async function completedReport(req, res) {
  const tasks = await taskService.getAll({ status: 'completed' });
  res.json({ count: tasks.length, tasks });
}

export async function pendingReport(req, res) {
  const tasks = await taskService.getAll({ status: 'pending' });
  res.json({ count: tasks.length, tasks });
}

export async function summaryReport(req, res) {
  const tasks = await taskService.getAll();

  const countBy = (field, values) =>
    Object.fromEntries(values.map((value) => [value, tasks.filter((t) => t[field] === value).length]));

  res.json({
    total: tasks.length,
    byStatus: countBy('status', STATUSES),
    byPriority: countBy('priority', PRIORITIES),
  });
}
