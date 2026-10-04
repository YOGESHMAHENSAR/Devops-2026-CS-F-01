# Student Portal

Student registration → save to JSON → log in using saved credentials → personalized welcome page.

## Run with Docker

Start Docker Desktop (with Linux containers), then run:

```sh
docker compose up --build -d
```

Open http://localhost:3000. Register your name, email, 10-digit phone number, branch, and a password of at least 8 characters. Registration takes you to the login page. Submit your registered email and password to see your welcome page and profile. Log out to end your session.

```sh
docker compose logs -f
docker compose down
```

Accounts are stored in `/app/data/student.json` inside the persistent `student-data` Docker volume. They survive container rebuilds and `docker compose down`. Running `docker compose down -v` deletes the volume and all registrations. Local and Docker runs use separate stores.

## Run locally

Requires Node.js 22 or newer. The server uses Node.js built-ins, so no dependency installation is required.

```sh
npm start
```

Open http://localhost:3000. Local registrations are stored in `data/student.json`, created automatically and excluded from Git. The existing root `student.json` contains legacy test fixtures; it is not an account database and is left unchanged.

## Checks

```sh
npm test
npm run test:fixtures
docker compose config --quiet
```

The integration tests use isolated temporary JSON files and cover registration, validation, duplicate emails, password hashing, login, access control, logout, concurrent registrations, and persistence after a server restart.

## Configuration and storage

- `PORT`: listening port, default `3000`.
- `DATA_DIR`: folder containing the account JSON file, default `./data`.
- `COOKIE_SECURE=true`: enable secure cookies when serving through HTTPS. Leave unset for local HTTP.

Passwords are stored as salted scrypt hashes. Login reads the JSON file and checks the hash. Session cookies are HttpOnly and SameSite=Lax; sessions expire after eight hours and are cleared when the server restarts. Users can log in again with their saved accounts. Login requests are limited to 20 attempts per IP address per 15 minutes.

JSON writes are serialized and replace the file atomically. Run a single application instance per data directory; this storage is intended for a learning project. Back up the data volume if the records matter. Only explicitly listed frontend files are served; account data is not publicly accessible.
