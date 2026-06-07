# PUBG Tracker

PUBG Tracker is a responsive React toolkit for tracking PUBG match state and measuring mortar range on 8 km maps. It is built as a small frontend-only app with practical in-game utilities, persistent browser state, and static deployment support.

## Live Demo

[https://pubg-tracker-one.vercel.app/](https://pubg-tracker-one.vercel.app/)

## Features

- Match tracker for squad and duo games
- Adjustable team count and starting slot
- Per-team alive player counters with left-click and right-click controls
- Unknown deaths and unknown recalls counters
- Tracker state persisted in browser `localStorage`
- Mortar range calculator for 8 km PUBG maps
- Click-to-place map markers with distance output in kilometers and meters
- Zoom, pan, and touch pinch support on the mortar map
- Map switching for Erangel, Miramar, Rondo, and Taego
- Static SPA routing configured for Vercel

## Pages

- `/` - Tool selection page
- `/tracker` - Match/team tracker
- `/mortar` - Mortar range calculator

## Tech Stack

- React
- TypeScript
- Vite
- Redux Toolkit
- React Redux
- React Router
- Tailwind CSS
- Vercel

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

## Project Notes

This app does not use a backend or REST API. Match tracker data is saved locally in the browser, and map images are served from the `public/images` folder.

The `vercel.json` file rewrites all routes to `index.html` so direct visits to routes like `/tracker` and `/mortar` work correctly after deployment.
