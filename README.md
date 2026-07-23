# Shreeji Samipya Website

React frontend with Python FastAPI backend and MySQL database.

## Frontend

```powershell
npm start
```

Website:

`http://localhost:3000`

Admin panel:

`http://localhost:3000/admin`

Default admin login:

- Username: `superadmin`
- Password: `Master@123`

## Backend

Install Python dependencies:

```powershell
python -m pip install -r backend\requirements.txt
```

Run backend:

```powershell
npm run server
```

Backend API:

`http://localhost:5000/api`

## Database

Create/update MySQL database:

```powershell
mysql -u root -p < database\schema.sql
```

DB settings are in:

`backend\.env`

Use `backend\.env.example` as reference.

## Admin Panel

Admin source files:

- `src/admin/AdminPanel.js`
- `src/admin/AdminPanel.css`

Admin backend APIs:

- `/api/admin/login`
- `/api/admin/dashboard`
- `/api/admin/{module}`
- `/api/admin/upload`
- `/api/admin/settings`
- `/api/admin/export/{module}.{format}`

Roles:

- Super Admin: full access and user creation
- Admin: CMS, records, settings
- Editor: CMS only
