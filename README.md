# PUBG Tracker

A small PUBG toolkit built with React, TypeScript, Vite, Redux Toolkit, and Tailwind CSS.

## Features

- Team tracker for squad and duo matches
- Adjustable team count and starting slot
- Alive player tracking per team
- Unknown deaths and unknown recalls counters
- Tracker state saved in browser localStorage
- Mortar range calculator for 8 km PUBG maps
- Map switching for Erangel, Miramar, Rondo, and Taego
- Static SPA routing with Vercel rewrites

## Pages

- `/` - Tool selection home page
- `/tracker` - Match/team tracker
- `/mortar` - Mortar range calculator

## Tech Stack

- React
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Notes

This app does not currently use a backend or REST API. Match tracker data is saved locally in the browser, and map images are served from the `public/images` folder.

The `vercel.json` file rewrites all routes to `index.html` so direct visits to routes like `/tracker` and `/mortar` work correctly after deployment.
