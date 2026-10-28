# Profile Dashboard

A full-stack MERN application for managing user profiles and dashboard workflows.

---

## Project Structure

```text
profile-dashboard/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/        # Static assets (images, icons, etc.)
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page-level components
│   │   ├── layouts/       # Shared layouts (headers, sidebars)
│   │   ├── services/      # API clients and HTTP services
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # Global state / React context
│   │   ├── App.jsx        # Root application component
│   │   ├── main.jsx       # React application entry point
│   │   └── index.css      # Global styles
│   ├── .env.example       # Frontend environment template
│   ├── index.html         # HTML entry point
│   ├── package.json       # Frontend dependencies and scripts
│   └── vite.config.js     # Vite configuration
│
├── backend/
│   ├── controllers/       # Route request handlers
│   ├── routes/            # Express route definitions
│   ├── middleware/        # Custom Express middleware
│   ├── schemas/           # Mongoose models and data schemas
│   ├── config/            # Configuration files (DB connection)
│   ├── app.js             # Express app setup and middleware
│   ├── server.js          # Server entry point and listener
│   ├── .env.example       # Backend environment template
│   └── package.json       # Backend dependencies and scripts
│
├── .gitignore
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later, Node v24 recommended)
- [npm](https://www.npmjs.com/) (v9.x or later)

---

## Environment Setup

### 1. Backend Environment Configuration
Navigate to the `backend/` directory and create a `.env` file from `.env.example`:

```bash
cd backend
cp .env.example .env
```

Example `.env` values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/profile_dashboard
FRONTEND_URL=http://localhost:5173
```

### 2. Frontend Environment Configuration
Navigate to the `frontend/` directory and create a `.env` file from `.env.example`:

```bash
cd frontend
cp .env.example .env
```

Example `.env` values:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Installation

### Backend
From the project root:
```bash
cd backend
npm install
```

### Frontend
From the project root:
```bash
cd frontend
npm install
```

---

## Running the Applications

### 1. Start the Backend Server
From the `backend/` directory:
```bash
npm run dev
```
> The backend server runs with Node.js `--watch` mode on [http://localhost:5000](http://localhost:5000).

To verify the backend health endpoint:
```bash
curl http://localhost:5000/api/health
```
Response:
```json
{
  "status": "success",
  "message": "Profile Dashboard API is healthy",
  "timestamp": "..."
}
```

### 2. Start the Frontend Development Server
From the `frontend/` directory:
```bash
npm run dev
```
> The frontend will be available at [http://localhost:5173](http://localhost:5173).

---

## Available Scripts

### Backend (`/backend`)
- `npm run dev`: Starts the Express server in watch mode using `node --watch server.js`.
- `npm start`: Starts the Express server with standard `node server.js`.

### Frontend (`/frontend`)
- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Bundles the React application for production into `dist/`.
- `npm run preview`: Locally previews the production build.
