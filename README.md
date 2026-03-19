# Pet Platform - Frontend ⚛️

The frontend application built with React, TypeScript, and Vite.

## Overview

This is the user-facing interface for the Pet Platform, allowing users to browse pets, submit adoption applications, and report lost/found pets.

## Setup

1.  **Install Node.js**: Ensure Node.js 18+ is installed.

2.  **Install Dependencies**:
    ```bash
    cd frontend
    pnpm install
    ```

## Configuration

Environment variables are set in `.env` (or `.env.local`).

Create a `.env` file in the `frontend` directory:

```bash
VITE_API_URL=http://localhost:8000/api/v1
```

-   `VITE_API_URL`: The URL of the backend API.

## Running Locally

To start the development server with hot-reload:

```bash
pnpm dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

## Build

To build the application for production:

```bash
pnpm build
```

The output will be in the `dist/` directory.

To preview the production build locally:

```bash
pnpm preview
```

## Linting

To run the linter (ESLint):

```bash
pnpm lint
```

## Project Structure

```
frontend/
├── src/
│   ├── assets/       # Static assets (images, fonts)
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components (routes)
│   ├── services/     # API client and services
│   ├── store/        # State management (Zustand)
│   ├── types/        # TypeScript interfaces/types
│   ├── App.tsx       # Main application component
│   └── main.tsx      # Entry point
├── public/           # Public static files
├── index.html        # HTML template
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── vite.config.ts    # Vite configuration
```
