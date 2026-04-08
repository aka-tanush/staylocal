# StayLocal Deployment Guide

This project is deployed as:

- Frontend: Vercel (`frontend/`)
- Backend: Render (`backend/`, Docker)
- Database: MySQL (Railway or any hosted MySQL)

---

## 1) Push latest code

From project root:

```bash
git add .
git commit -m "prepare deployment"
git push origin main
```

---

## 2) Create hosted MySQL

Create a MySQL database (recommended: Railway MySQL).

Collect:

- host
- port
- database name
- username
- password

Build JDBC URL:

```text
jdbc:mysql://<HOST>:<PORT>/<DB_NAME>?useSSL=true&requireSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

---

## 3) Deploy backend on Render

This repo already includes:

- `render.yaml`
- `backend/Dockerfile`

### Steps

1. Render -> New -> Blueprint
2. Connect GitHub repo
3. Select this repository
4. Render creates `staylocal-backend` service

### Required backend environment variables

Set these in Render service environment:

- `SPRING_DATASOURCE_URL` = `<your JDBC url>`
- `SPRING_DATASOURCE_USERNAME` = `<your mysql username>`
- `SPRING_DATASOURCE_PASSWORD` = `<your mysql password>`
- `JWT_SECRET` = `<long random secret>`
- `JWT_EXPIRATION` = `2592000000`
- `CORS_ALLOWED_ORIGIN` = `https://<your-frontend-domain>`

After deploy, note backend URL:

```text
https://<your-render-backend-domain>
```

Test:

```text
https://<your-render-backend-domain>/api/homestays
```

It should return JSON.

---

## 4) Deploy frontend on Vercel

### Steps

1. Vercel -> Add New -> Project
2. Import same GitHub repository
3. Set Root Directory to `frontend`
4. Framework should detect Vite

### Required frontend environment variable

- `VITE_API_URL` = `https://<your-render-backend-domain>`

Deploy and note frontend URL:

```text
https://<your-vercel-frontend-domain>
```

---

## 5) Final CORS update

If needed, update Render backend env var:

- `CORS_ALLOWED_ORIGIN=https://<your-vercel-frontend-domain>`

Redeploy backend.

---

## 6) Final verification checklist

- Frontend opens successfully
- Signup works
- Login works
- `GET /api/homestays` works from frontend
- No CORS/network errors in browser console

---

## Troubleshooting

### Network Error on signup/login

- Verify backend URL in Vercel env (`VITE_API_URL`)
- Verify backend is live (`/api/homestays`)
- Verify `CORS_ALLOWED_ORIGIN` matches frontend domain exactly

### MySQL access denied

- Recheck `SPRING_DATASOURCE_USERNAME`
- Recheck `SPRING_DATASOURCE_PASSWORD`
- Recheck database host/port and SSL params in JDBC URL

### Render backend fails to boot

- Open Render logs
- Check datasource variables and JWT secret are present

