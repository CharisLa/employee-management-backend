Employee Management System
==========================

Backend: Node.js + Express + Sequelize + MySQL
----------------------------------------------

ToRun:
------
cd c:\Users\Charis\employee-management-backend
- npm install
- npm run db:migrate
- npm run dev    # or npm start for a non-nodemon run
- Get-NetTCPConnection -LocalPort 4000 | Select-Object LocalAddress,LocalPort,OwningProcess
- Stop-Process -Id <PID>
- In a second terminal, cd frontend && npm start to verify the Angular app reaches the API.

# Prerequisites
- Node.js 18+ and npm
- A running MySQL instance (local or remote)

1. Configure environment
Create a `.env` file in the project root (values shown are development defaults):

```
PORT=4000
DB_HOST=localhost
DB_NAME=ems_db
DB_USER=root
DB_PASS=1234
DB_DIALECT=mysql
```

Create the database if it does not exist:

CREATE DATABASE ems_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 2. Install dependencies and run the backend

The server authenticates against MySQL before listening on `http://localhost:4000`.

### 3. API overview
- `GET /health` – health probe
- `GET /employees` – list employees
- `GET /employees/:id` – fetch an employee
- `POST /employees` – create (`{ name, email, position?, salary? }`)
- `PUT /employees/:id` – update any of the fields above
- `DELETE /employees/:id` – remove an employee

Input validation is handled by `express-validator`; invalid requests return 400, missing resources return 404, and duplicate emails surface a readable 400 response.

Frontend: Angular
-----------------

The Angular application lives in `frontend/` and is implemented with standalone components (no NgModule boilerplate).

# Prerequisites
- Node.js 18+ (same as backend)
- npm will fetch Angular CLI dependencies defined in `frontend/package.json`

# 1. Install dependencies
```
cd frontend
npm install
```

# 2. Configure API base (optional)
The frontend targets `http://localhost:4000` by default (`EmployeeService` constant in `src/app/core/employee/employee.service.ts`). Adjust the constant or introduce an environment file if your backend runs elsewhere.

# 3. Run the Angular dev server
```
npm start
```

Angular serves the SPA on `http://localhost:4200` and communicates with the backend API directly (CORS is already enabled server-side).

### 4. Available features
- **Employee list** (`src/app/employees/employee-list/…`) – loads employees, links to view/edit, allows delete with confirmation.
- **Add / edit employee** (`employee-form`) – reactive form with validation, handles both creation and updates.
- **Employee details** (`employee-details`) – shows full record, offers edit/delete/back actions.
- **Employee service** (`core/employee/employee.service.ts`) – wraps all REST calls to the Express API.

Testing
-------
- Backend: No automated tests are bundled. Consider Jest + supertest to cover controllers.
- Frontend: Angular CLI adds Karma/Jasmine scaffolding; run `npm test` inside `frontend/` once dependencies are installed.
 