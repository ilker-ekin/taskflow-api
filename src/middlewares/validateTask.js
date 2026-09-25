// Validates the task body. POST requires title and assignee;
// PUT only checks the fields that are sent.
export const STATUSES = ['pending', 'in-progress', 'completed'];
export const PRIORITIES = ['low', 'medium', 'high'];

function checkLength(value, field, min, max, errors) {
  if (typeof value !== 'string') {
    errors.push(`'${field}' metin (string) olmalıdır.`);
  } else if (value.trim().length < min || value.trim().length > max) {
    errors.push(`'${field}' ${min}-${max} karakter arasında olmalıdır.`);
  }
}

function validate(body, { partial }) {
  const errors = [];

  if (body.title !== undefined) checkLength(body.title, 'title', 3, 120, errors);
  else if (!partial) errors.push("'title' alanı zorunludur.");

  if (body.assignee !== undefined) checkLength(body.assignee, 'assignee', 2, 50, errors);
  else if (!partial) errors.push("'assignee' alanı zorunludur.");

  if (body.description !== undefined) checkLength(body.description, 'description', 0, 1000, errors);

  if (body.status !== undefined && !STATUSES.includes(body.status)) {
    errors.push(`'status' şu değerlerden biri olmalıdır: ${STATUSES.join(', ')}.`);
  }

  if (body.priority !== undefined && !PRIORITIES.includes(body.priority)) {
    errors.push(`'priority' şu değerlerden biri olmalıdır: ${PRIORITIES.join(', ')}.`);
  }

  return errors;
}

function sendErrors(res, errors) {
  return res.status(400).json({ error: 'Geçersiz görev verisi.', details: errors });
}

function isObject(body) {
  return body !== null && typeof body === 'object' && !Array.isArray(body);
}

export function validateCreate(req, res, next) {
  if (!isObject(req.body)) return sendErrors(res, ['İstek gövdesi JSON nesnesi olmalıdır.']);
  const errors = validate(req.body, { partial: false });
  return errors.length ? sendErrors(res, errors) : next();
}

export function validateUpdate(req, res, next) {
  if (!isObject(req.body)) return sendErrors(res, ['İstek gövdesi JSON nesnesi olmalıdır.']);
  const errors = validate(req.body, { partial: true });
  const fields = ['title', 'description', 'status', 'priority', 'assignee'];
  if (!fields.some((field) => req.body[field] !== undefined)) {
    errors.push(`Güncellemek için en az bir alan gönderilmelidir: ${fields.join(', ')}.`);
  }
  return errors.length ? sendErrors(res, errors) : next();
}

export function validateFilters(req, res, next) {
  const { status, priority } = req.query;
  const errors = [];
  if (status !== undefined && !STATUSES.includes(status)) {
    errors.push(`'status' şu değerlerden biri olmalıdır: ${STATUSES.join(', ')}.`);
  }
  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    errors.push(`'priority' şu değerlerden biri olmalıdır: ${PRIORITIES.join(', ')}.`);
  }
  return errors.length
    ? res.status(400).json({ error: 'Geçersiz filtre değeri.', details: errors })
    : next();
}
