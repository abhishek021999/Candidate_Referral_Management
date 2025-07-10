# Candidate Referral Management

A full-stack web application for managing employee referrals, allowing users to refer candidates and admins to manage and review referrals.

## Features
- User registration and login (JWT-based authentication)
- User roles: User and Admin
- Users can refer candidates (with resume upload)
- Admins can view, update status, and delete candidate referrals
- Search and filter candidates by job title and status
- Responsive UI with dashboards for users and admins

## Tech Stack
- **Frontend:** React, Vite, Bootstrap, React Router, React Toastify
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer

## Directory Structure
```
Candidate_Referral_Management/
  backend/      # Express API, MongoDB models, routes, uploads
  frontend/     # React app (Vite), pages, components, context, utils
```

## Backend Setup
1. `cd backend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```
   The backend runs on `http://localhost:5000` by default.

### Main API Endpoints
- `POST   /api/auth/register`   — Register a new user (admin/user)
- `POST   /api/auth/login`      — Login and receive JWT
- `POST   /api/candidates`      — Refer a candidate (user, PDF resume upload)
- `GET    /api/candidates`      — List/search candidates (user/admin)
- `PATCH  /api/candidates/:id/status` — Update candidate status (admin)
- `DELETE /api/candidates/:id`  — Delete a candidate (admin)

### Models
- **User:** name, email, password (hashed), role (user/admin)
- **Candidate:** name, email, phone, jobTitle, status, resumeUrl, referredBy, createdAt

## Frontend Setup
1. `cd frontend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend runs on `http://localhost:5173` by default.

### Main Pages
- **Login/Register:** User authentication
- **User Dashboard:** View/search referred candidates
- **Referral Form:** Refer a new candidate
- **Admin Dashboard:** Manage all referrals, update status, delete

## How to Run the Project
1. Start MongoDB (locally or with a cloud provider like MongoDB Atlas)
2. Start the backend server (see Backend Setup)
3. Start the frontend dev server (see Frontend Setup)
4. Access the app at `http://localhost:5173`

## Example Usage
- Register as a user or admin
- Login and access your dashboard
- Users: Refer candidates, upload PDF resumes
- Admins: View all referrals, update status (Pending/Reviewed/Hired), delete candidates

## File Uploads
- Uploaded resumes are stored in `backend/uploads/`

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[ISC](LICENSE) (or specify your license here) 