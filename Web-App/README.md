# RoadMint Web App

Next.js (App Router) + TypeScript + Tailwind v4 + Mapbox (`react-map-gl`).

## Setup

```bash
npm install
cp .env.local.example .env.local   # then add your Mapbox token
npm run dev
```

Open http://localhost:3000.

## Mapbox token

Get a token at https://account.mapbox.com/access-tokens/ and set
`NEXT_PUBLIC_MAPBOX_TOKEN` in `.env.local`.

## Structure

- `app/` — App Router pages, layout, global CSS
- `components/MapView.tsx` — client-side Mapbox map
