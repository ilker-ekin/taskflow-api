import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';
import { validateCreate, validateUpdate, validateFilters } from '../middlewares/validateTask.js';

const router = Router();

router.post('/', validateCreate, taskController.createTask);
router.get('/', validateFilters, taskController.listTasks);
router.get('/:id', taskController.getTask);
router.put('/:id', validateUpdate, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
