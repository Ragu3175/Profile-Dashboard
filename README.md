# Profile Dashboard

A full-stack MERN application for managing user profiles, technical skills, and educational qualifications. It includes cookie-based authentication and a dashboard for viewing and updating profile information.

## Features

- User registration, login, and logout
- Protected profile dashboard
- Edit personal profile details
- Add, edit, and delete technical skills
- Add, edit, and delete education records
- Skills proficiency visualization
- Profile completion summary
- Responsive interface

## Tech Stack

**Frontend:** React, Vite, React Router, CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose  
**Authentication:** JWT stored in an HTTP-only cookie

## Project Structure

```text
profile-dashboard/
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── services/
│       ├── hooks/
│       ├── context/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── schemas/
│   ├── app.js
│   └── server.js
├── .gitignore
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (18 or later)
- npm
- MongoDB Atlas account or a local MongoDB installation

## Environment Setup

### 1. Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a `.env` file using `.env.example` as a reference.

Configure the required environment variables using the names expected by your backend. For example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secure_random_secret
```

Use your actual MongoDB connection string. Never commit `.env` or expose database credentials and JWT secrets.

### 2. Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Create a `.env` file using `.env.example` as a reference.

The API URL should match the variable used in `frontend/src/services/api.js`. In the current project, this is:

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

In a separate terminal, install frontend dependencies:

```bash
cd frontend
npm install
```

## Running the Application

### 1. Start the Backend

From the `backend/` directory:

```bash
npm run dev
```

The backend runs at `http://localhost:5000`.

Check the health endpoint:

```text
GET http://localhost:5000/api/health
```

### 2. Start the Frontend

From the `frontend/` directory, in a separate terminal:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a user | Public |
| POST | `/api/auth/login` | Log in | Public |
| POST | `/api/auth/logout` | Log out | Public |
| GET | `/api/profile` | Retrieve the current user's profile | Protected |
| PUT | `/api/profile` | Update profile information, skills, and education | Protected |
| DELETE | `/api/profile` | Delete the current user's account | Protected |
| GET | `/api/health` | Check API health | Public |

Protected endpoints require a valid authentication cookie.

## Available Scripts

### Backend

- `npm run dev` — Start the server in watch mode.
- `npm start` — Start the server normally.

### Frontend

- `npm run dev` — Start the Vite development server.
- `npm run build` — Build the frontend for production.
- `npm run preview` — Preview the production build.

## Production Build

To build the frontend:

```bash
cd frontend
npm run build
```

The production files are generated in `frontend/dist/`.

## Security Notes

- Passwords are hashed before storage.
- JWT authentication uses an HTTP-only cookie.
- Environment files containing secrets must not be committed.
- Protected profile routes require authentication.

## License

This project was created as a learning and portfolio project.
