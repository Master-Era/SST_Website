# Node.js Conversion Guide

## Project structure
- `src/` React website and Admin Panel
- `backend-node/` new Express backend
- `database/SST.sql` MySQL schema and seed data
- `backend/` old Python backend retained only as a reference

## First run
```bash
mysql -u root -p < database/SST.sql
cd backend-node
cp .env.example .env
npm install
npm start
```
In another terminal:
```bash
cd mandir-website
npm install
npm start
```
Or from the root after installing both root and backend packages:
```bash
npm run dev
```

## API compatibility
The new backend preserves all URLs currently called by `src/services/api.js`, including admin login, dashboard, CMS CRUD, settings, file uploads, inquiries, donations, devotees, gallery, events, activities, news and export.

## Professional Home Hero: Image + Video

Admin Panel > Home Page Edit > Professional Hero Media now accepts:
- JPG, PNG and WebP images
- MP4, WebM and OGG video clips
- Optional direct MP4/WebM video URL
- Hero title, description, active/hide status and poster image

Recommended video: MP4 (H.264), 1920x1080, 8-20 seconds, muted, under 40 MB. The backend upload limit defaults to 100 MB; set `UPLOAD_MAX_MB=100` in `backend-node/.env`.
