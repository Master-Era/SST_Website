# Live Admin-to-Website Sync Deployment Guide

## Production environment
Create `.env.production` in the React project root:

```env
REACT_APP_API_URL=/api
```

Create `backend-node/.env` using `.env.example`. Important values:

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://shreejisamipya.org
UPLOAD_MAX_MB=5
```

Keep your existing MySQL DB values and JWT secret.

## Nginx configuration
Use this inside the `server {}` block for `shreejisamipya.org`:

```nginx
client_max_body_size 5M;

location /api/ {
    proxy_pass http://127.0.0.1:5000/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_no_cache 1;
    proxy_cache_bypass 1;
}

location /uploads/ {
    proxy_pass http://127.0.0.1:5000/uploads/;
    proxy_set_header Host $host;
    expires 7d;
}

location / {
    try_files $uri $uri/ /index.html;
}
```

Then run:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Build and restart

```bash
cd /var/www/SST_Website
npm install
npm run build

cd backend-node
npm install
pm2 restart shreeji-api --update-env
# First run only:
# pm2 start src/server.js --name shreeji-api
# pm2 save
```

Copy the React `build/` output to the folder served by Nginx if Nginx does not directly serve `/var/www/SST_Website/build`.

## Database verification

```sql
SELECT page_key, updated_at
FROM page_content
WHERE page_key = 'Admin Website Data';
```

After saving from Admin Panel, `updated_at` must change.

## Browser test
1. Login in Chrome and change one image/title.
2. Open DevTools > Network and verify `PUT /api/admin/page-content` returns 200.
3. Open the public website in Firefox/mobile/private mode.
4. The updated content should appear because public pages now read the database, not another browser's localStorage.
