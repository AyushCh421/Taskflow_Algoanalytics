# TaskFlow — Task & Team Management Platform

A full-stack MERN application with JWT authentication, a role-aware dashboard,
full task CRUD, search/filter/sort, and a responsive UI.

**Repository:** https://github.com/AyushCh421/Taskflow_Algoanalytics

---

## Live Demo

| | |
|---|---|
| Frontend (Vercel) | `https://taskflow-algoanalytics.vercel.app` |
| Backend (Render) | `https://taskflow-algoanalytics.onrender.com` |
| Test login | `testuser@example.com` / `Test@1234` |
| Admin login | `admin@example.com` / `Admin@1234` |

---

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React, Vite, React Router, Redux Toolkit, Axios, Tailwind CSS, react-hot-toast |
| Backend | Node.js, Express, JWT, bcryptjs |
| Database | MongoDB Atlas (Mongoose) |
| Deployment | Vercel (frontend) · Render (backend) · MongoDB Atlas (database) |

---

## Folder Structure

```
client/src/
├── components/   # Sidebar, Navbar, TaskCard, DashboardCard, TaskFormModal, ProtectedRoute
├── pages/        # Login, Register, Dashboard, Tasks, DashboardLayout, NotFound
├── hooks/        # useAuth, useDebounce, useDarkMode (custom hooks)
├── services/     # api.js (Axios instance + interceptors)
├── utils/        # validators.js
├── store/        # Redux Toolkit slices (auth, tasks)

server/
├── controllers/  # authController.js, taskController.js
├── models/       # User.js, Task.js
├── routes/       # authRoutes.js, taskRoutes.js
├── middleware/   # auth.js (JWT), errorHandler.js
├── config/       # db.js
```

---

## Setup — Local Development

### 1. Clone the repo
```bash
git clone https://github.com/AyushCh421/Taskflow_Algoanalytics.git
cd Taskflow_Algoanalytics
```

### 2. Database
Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), a database user, and
allow network access from `0.0.0.0/0` (or your IP). Copy the connection string.

### 3. Backend
```bash
cd server
cp .env.example .env     # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev               # runs on http://localhost:5000
node seed.js               # creates the two required test accounts
```

### 4. Frontend
```bash
cd client
cp .env.example .env      # set VITE_API_BASE_URL=http://localhost:5000/api
npm install
npm run dev                # runs on http://localhost:5173
```

---

## Deployment

### Backend → Render
1. On Render: **New → Web Service** → connect `Taskflow_Algoanalytics`, root directory `server`.
2. Build command: `npm install` · Start command: `npm start`.
3. Add env vars: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` (your Vercel URL, added after step below).
4. Deploy, then open the Render **Shell** tab and run `node seed.js` once to create the test accounts
   against the production database.

### Frontend → Vercel
1. **New Project** → import `Taskflow_Algoanalytics`, root directory `client`.
2. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
3. Add env var `VITE_API_BASE_URL=https://<your-render-app>.onrender.com/api`.
4. Deploy.
5. Back in Render, update `CLIENT_URL` to the final Vercel URL and redeploy the backend (needed for CORS).

---

## API Documentation

Base URL: `/api`

| Method | Endpoint       | Auth | Purpose                                   |
|--------|----------------|------|--------------------------------------------|
| POST   | /auth/register | No   | Create a new user account                 |
| POST   | /auth/login    | No   | Authenticate, returns JWT                  |
| GET    | /auth/me       | Yes  | Get current user                           |
| GET    | /auth/users    | Yes  | List users (for task assignment)           |
| GET    | /tasks         | Yes  | List tasks (search/filter/sort/paginate)   |
| GET    | /tasks/:id     | Yes  | Get a single task                          |
| POST   | /tasks         | Yes  | Create a task                              |
| PUT    | /tasks/:id     | Yes  | Update a task                              |
| DELETE | /tasks/:id     | Yes  | Delete a task                              |

`GET /tasks` query params: `search`, `status`, `priority`, `sortBy`, `order`, `page`, `limit`.
The response also includes `stats` (totalTasks, pending, completed, inProgress) used by the dashboard cards.

**Auth:** send `Authorization: Bearer <token>` on protected routes.

**Error response format:**
```json
{ "success": false, "message": "Human readable message" }
```
Status codes: `400` invalid input · `401` unauthorized/invalid token · `404` not found · `500` server error.

A ready-to-import Postman collection is included: `TaskFlow.postman_collection.json`.

---

## Required React Concepts — where they're used

| Concept | Location |
|---|---|
| `useState` / `useEffect` | Forms, filters, all pages |
| `useMemo` | `Tasks.jsx` — memoized query-params object |
| `useCallback` | `Tasks.jsx` — stable `onEdit` / `onView` / `onDelete` handlers |
| `React.memo` | `TaskCard.jsx`, `DashboardCard.jsx` |
| Custom Hooks | `useAuth`, `useDebounce`, `useDarkMode` |
| Context/Redux | Redux Toolkit — `store/slices/authSlice.js`, `store/slices/taskSlice.js` |
| Lazy Loading + Suspense | `App.jsx` — every route page is `React.lazy` |

---

## Bonus Features Implemented (4)

1. **Dark Mode** — `useDarkMode` hook, toggle in navbar, Tailwind `dark:` classes
2. **Pagination** — `Tasks.jsx` UI + backend `page`/`limit` params
3. **Toast Notifications** — `react-hot-toast` on every CRUD and auth action
4. **Unit Tests** — `server/utils.test.js` (bcrypt hashing, email validation)

---

## Screenshots

_Add screenshots of the Login, Dashboard, and Tasks pages here before submission._
