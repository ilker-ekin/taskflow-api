# TaskFlow API — Task and Project Management System

TaskFlow is a **REST API** that helps a software company track its tasks, projects and employee responsibilities. It supports creating tasks, assigning them to employees, tracking their status and setting priorities.

This is the capstone project of the TNC Group Node.js Backend training. Project introduction document (in Turkish): [docs/PROJE_TANITIM.md](docs/PROJE_TANITIM.md)

> **Note:** The API's error and info messages are in Turkish. The example responses below are shown exactly as the API returns them.

## Features

**Required**

- ✅ Create, list, view, update and delete tasks (CRUD)
- ✅ Layered folder structure with Express Router (routes → controllers → services)
- ✅ Logger middleware: the method, endpoint and timestamp of every request are written to the console and to `logs/requests.log`
- ✅ Postman collection and test screenshots

**⭐ Extra**

- ⭐ Validation middleware: checks `title`, `description`, `priority` and `assignee`; invalid data returns **400** with a clear error message
- ⭐ Filtering: `GET /tasks?status=completed`, `GET /tasks?priority=high` (can be combined)
- ⭐ Reports: completed tasks, pending tasks and summary statistics

## Tech Stack

- Node.js (24 LTS), ES Modules
- Express 5
- Data is stored in a JSON file (`data/tasks.json`), no database needed
- Postman (API tests)

## Installation and Running

Requirement: [Node.js](https://nodejs.org/) 24 or later.

1. Clone the repository:
   ```bash
   git clone https://github.com/ilker-ekin/taskflow-api.git
   cd taskflow-api
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. The API runs at `http://localhost:3000`. You can open it in a browser to check that it is running.

On the first run, `data/tasks.json` is created automatically from the sample data (`data/tasks.seed.json`).

| Command | Description |
|---|---|
| `npm start` | Starts the server |
| `npm run dev` | Restarts the server automatically when files change |
| `npm run seed` | Resets the data to the sample data |

To use a different port: `PORT=4000 npm start`

## Data Model

| Field | Type | Rule |
|---|---|---|
| `id` | string (UUID) | Set by the server |
| `title` | string | Required, 3–120 characters |
| `description` | string | Optional, up to 1000 characters |
| `status` | `pending` \| `in-progress` \| `completed` | Default `pending` |
| `priority` | `low` \| `medium` \| `high` | Default `medium` |
| `assignee` | string | Required, 2–50 characters (employee name) |
| `createdAt`, `updatedAt` | ISO date | Set by the server |

## Endpoints

| Method | Endpoint | Description | Success response |
|---|---|---|---|
| POST | `/tasks` | Creates a new task | 201 |
| GET | `/tasks` | Lists all tasks | 200 |
| GET | `/tasks/:id` | Returns a task's details | 200 / 404 |
| PUT | `/tasks/:id` | Updates a task | 200 / 404 |
| DELETE | `/tasks/:id` | Deletes a task | 200 / 404 |
| GET | `/tasks?status=...&priority=...` | ⭐ Filtered list | 200 |
| GET | `/reports/completed` | ⭐ Completed tasks | 200 |
| GET | `/reports/pending` | ⭐ Pending tasks | 200 |
| GET | `/reports/summary` | ⭐ Summary by status and priority | 200 |

### Example requests and responses

**Create a task** — `POST /tasks`

```json
{
  "title": "Mobil uygulama için bildirim altyapısını kur",
  "description": "Push bildirimleri için Firebase entegrasyonunu tamamla.",
  "priority": "high",
  "assignee": "Ayşe Yılmaz"
}
```

Response `201 Created`:

```json
{
  "id": "ddfbfe5e-a247-41b5-8d4c-e15bbc5766be",
  "title": "Mobil uygulama için bildirim altyapısını kur",
  "description": "Push bildirimleri için Firebase entegrasyonunu tamamla.",
  "status": "pending",
  "priority": "high",
  "assignee": "Ayşe Yılmaz",
  "createdAt": "2026-09-25T22:24:35.411Z",
  "updatedAt": "2026-09-25T22:24:35.411Z"
}
```

**Update a task** — `PUT /tasks/:id` (send only the fields you want to change)

```json
{ "status": "completed" }
```

Response `200 OK`: the updated task object.

**Delete a task** — `DELETE /tasks/:id`, response `200 OK`:

```json
{ "message": "'Mobil uygulama için bildirim altyapısını kur' başlıklı görev silindi." }
```

**Summary report** — `GET /reports/summary`, response `200 OK`:

```json
{
  "total": 8,
  "byStatus": { "pending": 4, "in-progress": 2, "completed": 2 },
  "byPriority": { "low": 2, "medium": 3, "high": 3 }
}
```

### Error responses

All errors are returned as `{ "error": "..." }`.

| Status | Example |
|---|---|
| 400 — invalid data | `{ "error": "Geçersiz görev verisi.", "details": ["'title' 3-120 karakter arasında olmalıdır.", "'assignee' alanı zorunludur."] }` |
| 400 — malformed JSON | `{ "error": "İstek gövdesi geçerli bir JSON değil." }` |
| 404 — task not found | `{ "error": "'abc' kimlikli görev bulunamadı." }` |
| 404 — route not found | `{ "error": "İstenen adres bulunamadı: GET /nope" }` |
| 500 — server error | `{ "error": "Sunucuda beklenmeyen bir hata oluştu." }` |

## Logger Middleware

`src/middlewares/logger.js` logs every request after the response is sent, with its **method, endpoint and timestamp** (plus status code and duration). It prints the line to the console and appends the same line to `logs/requests.log` (the folder is created if missing).

```
[2026-09-25T22:24:35.411Z] POST /tasks 201 - 2ms
[2026-09-25T22:24:35.430Z] GET /tasks/ddfbfe5e-a247-41b5-8d4c-e15bbc5766be 200 - 1ms
[2026-09-25T22:24:35.441Z] PUT /tasks/ddfbfe5e-a247-41b5-8d4c-e15bbc5766be 200 - 1ms
[2026-09-25T22:24:35.452Z] GET /tasks?status=completed&priority=high 200 - 1ms
[2026-09-25T22:24:35.470Z] POST /tasks 400 - 0ms
[2026-09-25T22:24:35.498Z] DELETE /tasks/ddfbfe5e-a247-41b5-8d4c-e15bbc5766be 200 - 1ms
```

## Testing with Postman

1. Start the server with `npm start`.
2. In Postman, click **Import** and select `postman/TaskFlow.postman_collection.json`.
3. The collection variable `baseUrl` is set to `http://localhost:3000`.
4. Run the requests in the **CRUD** folder in order. "Görev Ekle" (Create Task) saves the new task's id to the `taskId` variable, and the following requests use it.
5. The **Ekstra** (Extra) folder contains the validation error, filtering and report requests.

Every request has tests that check the status code (Test Results tab). You can run the whole collection at once with **Run collection**.

## Screenshots

| Request | Screenshot |
|---|---|
| Create Task — `POST /tasks` | ![Create task](docs/screenshots/01-create.png) |
| List Tasks — `GET /tasks` | ![List tasks](docs/screenshots/02-list.png) |
| Task Details — `GET /tasks/:id` | ![Task details](docs/screenshots/03-detail.png) |
| Update Task — `PUT /tasks/:id` | ![Update task](docs/screenshots/04-update.png) |
| Delete Task — `DELETE /tasks/:id` | ![Delete task](docs/screenshots/05-delete.png) |
| ⭐ Validation error — 400 | ![Validation error](docs/screenshots/06-validation-400.png) |
| Logger console output | ![Logger output](docs/screenshots/07-logger-console.png) |

## Project Structure

```
taskflow-api/
├── data/
│   └── tasks.seed.json          # Sample tasks (tasks.json is created from this)
├── docs/
│   ├── PROJE_TANITIM.md         # Project introduction document
│   └── screenshots/             # Postman screenshots
├── postman/
│   └── TaskFlow.postman_collection.json
├── scripts/
│   └── seed.js                  # npm run seed
├── src/
│   ├── app.js                   # Express app: middlewares and routes
│   ├── server.js                # Starts the server
│   ├── routes/                  # task.routes.js, report.routes.js
│   ├── controllers/             # task.controller.js, report.controller.js
│   ├── services/                # task.service.js (reads/writes the JSON file)
│   └── middlewares/             # logger.js, validateTask.js, errorHandler.js, notFound.js
├── package.json
└── README.md
```

## Author

İlker Ekin Erdoğdu — [@ilker-ekin](https://github.com/ilker-ekin)
