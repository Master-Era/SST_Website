# Professional Admin Panel Update

## Included
- Full-height scrollable Add/Edit/View dialogs (no cropped forms)
- Responsive mobile sidebar with overlay and top menu button
- Mobile-friendly tables and record detail dialogs
- Search by name/mobile/email plus From/To date
- Filtered CSV and PDF/Print downloads
- Matching application count for a searched name
- Existing Super Admin/Admin/Editor access controls
- Admin user add/edit/block/unblock controls
- Admin and login logos
- 3 wrong-password attempts automatically block the user; Super Admin can reactivate it
- 3-minute inactivity logout remains enabled
- Contact and donation email notifications through SMTP

## Email setup
Copy `backend-node/.env.example` to `backend-node/.env` and configure:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-google-app-password
SMTP_FROM=Shreeji Samipya Website <your-email@gmail.com>
NOTIFICATION_EMAIL=registered-admin@example.com
```

The backend also reads `email1`, `email2`, and `email3` from Admin > Settings. Notifications are sent to all unique configured addresses. A failed email never prevents a form submission from being saved.

For Gmail, enable 2-Step Verification and create an App Password. Do not use the normal Gmail password.

## Install and run

```bash
npm install
npm --prefix backend-node install
npm --prefix backend-node run dev
npm start
```

## Important
The project source build was verified successfully. The existing `Hero.js` has two ESLint dependency warnings, but they do not prevent the application from compiling or running.
