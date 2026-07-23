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
