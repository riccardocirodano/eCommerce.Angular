# eCommerce Authentication App (Angular)

Angular authentication + role-based dashboards integrated with the ASP.NET Core Users Service.

## Features

- **Authentication**
    - Register + Login
    - JWT stored in `localStorage`
    - Auth HTTP interceptor adds `Authorization: Bearer <token>`
- **Role-based routing (Admin / Manager / User)**
    - Guards enforce access and redirect authenticated users to the correct dashboard
    - Roles are read from the stored user payload and/or decoded from the JWT claims
- **Admin area**
    - Users list (paged)
    - User details + role updates
    - Toggle user active status
    - Activity logs (paged)
    - System settings
- **Manager area**
    - Team management (paged)
    - Reports / Tasks / Inventory / Schedule (list UIs)
    - My Profile (user + roles)
- **Resilient rendering**
    - Manager pages use a stable `vm$` (view-model Observable) with `OnPush` and safe templates
    - Service layer normalizes backend response casing (e.g., `users` vs `Users`) to avoid blank screens

## Tech Stack

- Angular (standalone components)
- Angular Material
- TypeScript
- RxJS
- HttpClient with Interceptors

## Backend Integration

The app is configured to connect to your ASP.NET Core backend at:
- **API Base URL** (see `src/environments/environment.ts`): `http://localhost:5289/api`

### Auth Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`

### Manager Endpoints

- `GET /api/manager/dashboard`
- `GET /api/manager/team?page=1&pageSize=20`
- `GET /api/manager/reports`
- `GET /api/manager/tasks`
- `GET /api/manager/inventory`
- `GET /api/manager/schedule`
- `GET /api/manager/profile`

### Admin Endpoints

- `GET /api/admin/dashboard`
- `GET /api/admin/users?page=1&pageSize=20`
- `GET /api/admin/users/{userId}`
- `POST /api/admin/users/{userId}/roles`
- `POST /api/admin/users/{userId}/toggle-status`
- `GET /api/admin/roles`
- `GET /api/admin/activity-logs?page=1&pageSize=50`
- `GET /api/admin/settings`

## Routes

- Public: `/login`, `/register`
- Dashboards:
    - `/admin-dashboard`
    - `/manager-dashboard`
    - `/user-dashboard`
- Manager pages:
    - `/manager/team`, `/manager/reports`, `/manager/tasks`, `/manager/inventory`, `/manager/schedule`, `/manager/profile`
- Admin pages:
    - `/admin/users`

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- ASP.NET Core backend running on port 5289

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
# Navigate to http://localhost:4200/
```

Note: This project can run with SSR enabled in dev; you may see an Angular warning about enabling `withFetch()` for `HttpClient` when SSR is on. It is non-blocking.

### Build

```bash
npm run build
```

## Usage

1. **Start your ASP.NET Core backend** on port 5289
2. **Start the Angular app**: `npm start`
3. **Register a new user** at `/register`
4. **Login** at `/login`
5. **Access the correct dashboard** based on your role:
    - Admin: `/admin-dashboard`
    - Manager: `/manager-dashboard`
    - User: `/user-dashboard`

## CORS Configuration

Ensure your ASP.NET Core backend has CORS enabled for `http://localhost:4200`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

app.UseCors("AllowAngular");
```

## Extending the App

This app is structured so adding new role pages is straightforward:

- Add an API method in `src/app/services/*`
- Create a standalone component
- Protect it with the appropriate guard (`AuthGuard`, `AdminGuard`, `ManagerGuard`)

## License

MIT
