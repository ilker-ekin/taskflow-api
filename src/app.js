import express from 'express';
import logger from './middlewares/logger.js';
import taskRoutes from './routes/task.routes.js';
import reportRoutes from './routes/report.routes.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(logger);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow API çalışıyor.', endpoints: ['/tasks', '/reports/summary'] });
});

app.use('/tasks', taskRoutes);
app.use('/reports', reportRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
