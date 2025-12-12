# eCommerce Authentication App

Angular authentication application integrated with ASP.NET Core backend microservice.

## Features

- **User Registration** - Create new user accounts with email, password, name, and gender
- **User Login** - Authenticate existing users
- **Protected Routes** - Dashboard accessible only to authenticated users
- **JWT Token Management** - Automatic token storage and HTTP interceptor
- **Responsive UI** - Built with Angular Material
- **Type-Safe** - Full TypeScript support matching backend DTOs

## Tech Stack

- Angular 21
- Angular Material
- TypeScript
- RxJS
- HttpClient with Interceptors

## Backend Integration

The app is configured to connect to your ASP.NET Core backend at:
- **Base URL**: `http://localhost:5289/api`
- **Register Endpoint**: `POST /api/auth/register`
- **Login Endpoint**: `POST /api/auth/login`

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
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

### Build

```bash
npm run build
```

## Usage

1. **Start your ASP.NET Core backend** on port 5289
2. **Start the Angular app**: `npm start`
3. **Register a new user** at `/register`
4. **Login** at `/login`
5. **Access the dashboard** at `/dashboard` (requires authentication)

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

As your microservice backend grows, you can easily extend this app by adding:
- Product management
- Shopping cart
- Order tracking
- User profile settings
- Admin panel

## License

MIT
