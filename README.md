# Team Task Manager

This is my full-stack web development project for managing teams and tasks. I built it using the MERN stack (MongoDB, Express, React, and Node.js). The idea was to create a simple dashboard where an admin can create projects and assign tasks to members, and members can update their progress.

## What it does
- **Authentication**: You can sign up and log in securely.
- **Roles**: There are 'Admin' and 'Member' roles. Admins can create projects and assign tasks. Members can only see their assigned tasks and update the status.
- **Dashboard**: A quick overview of how many tasks are to-do, in-progress, or done.
- **Kanban Board**: I added a drag-and-drop style view (using Tailwind CSS for the UI) to organize tasks easily.

## Tech Stack
- **Frontend**: React.js with Vite. I used Tailwind CSS for styling the UI because it's much faster than writing plain CSS files.
- **Backend**: Node.js with Express. I used Mongoose to connect to MongoDB.
- **Database**: MongoDB Atlas.

## How to run it locally

1. **Setup the Database**
   You need a MongoDB connection string. Create a file called `.env` in the `backend` folder and add your URI:
   `MONGO_URI=your_mongo_string_here`
   `JWT_SECRET=your_secret_key_here`

2. **Start the Backend**
   Open a terminal, go into the `backend` folder, install the dependencies, and run it:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   It will start on port 5000.

3. **Start the Frontend**
   Open another terminal, go into the `frontend` folder, install dependencies, and run it:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   It will open on port 5173.

## Deployment
I set up the frontend to use environment variables (`VITE_API_URL`) so it can talk to the backend when deployed on platforms like Railway or Render.

---
*Created for my final project submission.*
