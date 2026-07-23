# Shreeji Samipya Trust Node.js Backend

This Express + MySQL backend replaces the old FastAPI backend while preserving the same `/api` contract used by the React website and Admin Panel.

## Setup
1. Import `../database/SST.sql` into MySQL.
2. Copy `.env.example` to `.env` and update MySQL credentials.
3. Run `npm install` inside `backend-node`.
4. Run `npm run dev` or `npm start`.
5. In the project root, keep `REACT_APP_API_URL=http://localhost:5000/api`.

Default login created on first start:
- Username: `superadmin`
- Password: `Master@123`

Change the password after first login and replace `ADMIN_SECRET` in production.
