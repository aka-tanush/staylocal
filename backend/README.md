# StayLocal Backend (Spring Boot + Maven)

Backend service for StayLocal, implemented with Spring Boot, Maven, JPA, JWT auth, and MySQL.

## Tech Stack

- Spring Boot 3
- Maven
- Spring Security + JWT
- Spring Data JPA
- MySQL

## Project Layout

- Java source: `src/main/java/com/staylocal/backend`
- Resources: `src/main/resources`
- Maven config: `pom.xml`

## Environment Configuration

Set these environment variables (or use defaults from `application.properties`):

```bash
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/staylocal?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root
JWT_SECRET=change_this_in_production
JWT_EXPIRATION=2592000000
CORS_ALLOWED_ORIGIN=http://localhost:5173
```

## Run Locally

```bash
cd backend
mvn clean spring-boot:run
```

Backend runs on `http://localhost:8080`.

## API Base

All API endpoints are prefixed with `/api`, for example:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/homestays`
