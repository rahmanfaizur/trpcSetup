# TRPC Full-Stack Project

This project contains a basic Vite React client and Express server setup.

## Project Structure

```
trpc/
├── client/          # Vite React application
├── server/          # Express.js server
└── README.md        # This file
```

## Getting Started

### Running the Server

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:5000`

### Running the Client

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The client will run on `http://localhost:5173`

## API Endpoints

- `GET /` - Welcome message
- `GET /api/hello` - Hello message with timestamp
- `GET /api/users` - Sample users data

## Features

- **Client**: React app with Vite for fast development
- **Server**: Express server with CORS enabled
- **Hot Reload**: Both client and server support hot reloading
- **API Integration**: Client fetches data from server endpoints

## Development

1. Start both server and client in separate terminals
2. The client will automatically connect to the server
3. Make changes to either side and see them reflected immediately 