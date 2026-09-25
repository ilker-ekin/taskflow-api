// Request logger: once the response is sent, logs the method, endpoint, status code,
// duration and timestamp of every request to the console and appends it to logs/requests.log.
// Example: [2026-09-25T10:15:02.113Z] POST /tasks 201 - 12ms
import { appendFile, mkdir } from 'node:fs/promises';

const LOG_DIR = new URL('../../logs/', import.meta.url);
const LOG_FILE = new URL('requests.log', LOG_DIR);

await mkdir(LOG_DIR, { recursive: true });

export default function logger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const line = `[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    console.log(line);
    appendFile(LOG_FILE, line + '\n').catch((err) => {
      console.error('Log dosyasına yazılamadı:', err.message);
    });
  });

  next();
}
