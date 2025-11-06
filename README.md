# MERN App — Testing & Debugging Workspace

This repository is a small MERN-style project used for demonstrating testing and debugging practices. It contains a React client (unit tests), an Express/Mongoose server (integration tests), and supporting scripts and documentation.

This README explains how to install dependencies, run tests, generate coverage reports, and clean generated artifacts. Commands below are written for PowerShell on Windows.

## Project layout
- `client/` — React client source and unit tests (tests live under `client/src/tests/`).
- `server/` — Express server source and integration tests (tests live under `server/tests/`).
- `docs/screenshots/` — screenshots captured during development and testing.
- `jest.config.js` — root Jest configuration that runs `client` and `server` as separate projects and enforces coverage thresholds.

Note: A lightweight E2E helper (Cypress + orchestrator) may have been present previously but is not required to run unit/integration tests.

---

## Prerequisites
- Node.js (recommended v18+)
- npm
- Optional: a local MongoDB instance if you want to run server tests against a real DB (the server tests can use an in-memory MongoDB during CI/local runs).

## Install dependencies
From the repo root:

```powershell
npm install
# (optional) install per-package if you want local node_modules inside packages
# cd server; npm install; cd ..\client; npm install; cd ..
```

## Run tests

There are two common ways to run tests:

- Root (recommended for CI) — runs both client and server projects defined in `jest.config.js`:

```powershell
npx jest --colors --runInBand
```

- Per-package (convenient for development):

Client:
```powershell
cd client
npx jest --colors --runInBand --verbose
```

Server:
```powershell
cd server
npx jest --colors --runInBand --verbose
```

If you prefer, you can add small npm scripts to the root `package.json` such as `test`, `test:client` and `test:server` to make these commands shorter.

## Coverage

Generate coverage reports with:

```powershell
npx jest --coverage --colors --runInBand
```

This creates a `coverage/` folder with HTML and lcov reports. The folder is ignored by `.gitignore` by default — remove it if you don't want it in your working tree:

```powershell
Remove-Item -Recurse -Force .\coverage -ErrorAction SilentlyContinue
```

If coverage files were accidentally committed, untrack them with:

```powershell
git rm -r --cached coverage
git commit -m "chore: remove coverage from repo"
```

## Cleaning generated artifacts

To remove common generated artifacts (coverage, temporary Cypress artifacts) locally:

```powershell
Remove-Item -Recurse -Force .\coverage -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\cypress\videos -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\cypress\screenshots -ErrorAction SilentlyContinue
Remove-Item -Force .\cypress\fixtures\token.json -ErrorAction SilentlyContinue
```

## E2E and Postman (optional)

If you need end-to-end API tests or a Postman collection, I can re-add a minimal Cypress + orchestrator script and/or the Postman collection. Ask me to restore them and I'll recreate a compact, documented version.

## Notes

- The `jest.config.js` file at the root defines projects, transforms, and coverage thresholds — it is the canonical CI configuration for tests.
- Per-package Babel/Jest configs may exist to make running tests inside `client/` or `server/` easier; leaving them does not harm CI.
- `docs/screenshots/` is kept for evidence and manual review.

If you want, I can also add a `test` script to `package.json`, commit the README, or create a small GitHub Actions workflow to run the root tests on push/PR. Tell me which you prefer and I'll implement it.

---

Last updated: 2025-11-06