# Team Task Manager

A project I made for my college submission. Basically its a task management tool where you can create teams, manage projects and assign tasks to people. Built it with MERN stack because thats what we learned in class.

## Live Demo

- **Frontend**: https://frontend-production-b11e.up.railway.app/dashboard
- **Backend API**: https://teamtaskmanager-production-4587.up.railway.app/

You can register a new account or use existing credentials to test it out.

## Features

- Login/Signup with JWT auth
- Admin and Member roles (admin creates projects + assigns tasks, members update their task status)
- Dashboard showing project count, active tasks, overdue and completed stats
- Kanban style task board with To Do, In Progress, Done columns
- Team management - create teams, add/remove members, assign team leads
- Workload view to see how many tasks each person has so work is balanced
- Dark mode / light mode toggle
- Sidebar navigation with breadcrumbs
- Responsive design works on mobile too

## Tech used

- React + Vite for frontend
- Tailwind CSS for styling
- Node.js + Express for backend API
- MongoDB Atlas for database
- Mongoose for ODM
- JWT for authentication
- Deployed on Railway

## How to run locally

**Backend**
```
cd backend
npm install
```
Create a `.env` file in backend folder:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_random_secret_key
```
Then run:
```
npm run dev
```
Starts on port 5000.

**Frontend**
```
cd frontend
npm install
npm run dev
```
Opens on port 5173. Make sure backend is running first.

## Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/    # route logic
│   │   ├── models/          # mongoose schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # auth middleware
│   │   └── config/          # db connection
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/           # Dashboard, Projects, Tasks, Teams
│   │   ├── components/      # Sidebar, Header
│   │   ├── context/         # Auth + Theme context
│   │   └── utils/           # axios api setup
│   └── index.html
└── README.md
```

## Deployment

Deployed both frontend and backend on Railway as separate services connected to the same GitHub repo. Backend uses the `/backend` root directory and frontend uses `/frontend`. Environment variables are set through Railway dashboard.

---
Made for college project submission.
