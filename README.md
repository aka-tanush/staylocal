# StayLocal

Tourist Homestay and Local Guide platform with:

- Frontend: React + Vite (root project)
- Backend: Spring Boot + Maven + MySQL (`backend/`)

## Structure

- Frontend app: `src/`, `public/`, `package.json`
- Backend app: `backend/src/main/java`, `backend/src/main/resources`, `backend/pom.xml`

## Run Frontend

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Run Backend (Spring Maven + MySQL)

```bash
cd backend
mvn clean spring-boot:run
```

Backend runs on `http://localhost:8080`.

## Backend MySQL Configuration

Backend reads these env vars:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION`
- `CORS_ALLOWED_ORIGIN`

Defaults are provided in `backend/src/main/resources/application.properties`.