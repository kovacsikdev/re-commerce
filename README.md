# RE Commerce

A full-stack e-commerce prototype themed around **Resident Evil Requiem** — dark lab aesthetics, biohazard-grade gear, and tactical survival equipment. Browse items, inspect them in 3D, kit them out with upgrade parts, and drop-ship your order to an extraction point on the map.

---

## Theme

The store operates under **OPERATIONAL PROTOCOL: REQUIEM**. Every piece of copy, UI label, and workflow leans into the RE Requiem universe:

- **Storefront copy** — "Equip your containment unit with biohazard-grade biological and tactical countermeasures."
- **Security clearance** — Checkout is gated behind `SECURITY LEVEL: ALPHA`
- **Shipping** — Orders are delivered by **airdrop**; the checkout flow includes a Mapbox map for selecting your drop-zone coordinates
- **Items** — Melee weapons, chemical agents, firearms, ammo, and upgrade parts pulled straight from RE lore (Hatchet, Hemolytic Injector, etc.)
- **IDs** — Product IDs are base64-encoded item names

---

## Stack

### Frontend — `re-commerce/`

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| State | Redux Toolkit (`cart-slice`) |
| Data fetching | TanStack Query v5 + `unstable_cache` server-side caching |
| 3D viewer | Three.js + React Three Fiber |
| Map | Mapbox GL |

### Backend — `re-commerce-server/`

| Layer | Technology |
|---|---|
| Framework | NestJS 10 |
| Runtime | Node.js / TypeScript |
| Data source | `src/assets/mock-data.json` (simulates a DB read) |

---

## Features

- **Landing page** — Hero banner with thematic copy; showcases the first item per category
- **Category pages** — Filter inventory by item type (melee, firearms, consumables, etc.)
- **Item detail page**
  - Full image gallery
  - Interactive 3D model viewer (GLB files)
  - Upgrade parts listing with individual pricing and discounts
  - Add to cart
- **Cart** — Managed globally via Redux Toolkit; persisted with TanStack Query's sync storage persister
- **Checkout** — Form with an embedded Mapbox map; click anywhere on the map to set your airdrop coordinates, which sync bidirectionally with the lat/lng inputs

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Mapbox public token](https://account.mapbox.com/) — set it in `.env`:

```
NEXT_PUBLIC_MAPBOX_TOKEN=<your token>
```

### Frontend

```bash
cd re-commerce
npm install
npm run dev       # http://localhost:3000
```

### Backend

```bash
cd re-commerce-server
npm install
npm run dev       # http://localhost:3001
```

The frontend fetches product data from the backend server. Make sure the server is running before launching the frontend.

---

## Project Structure

```
re-commerce/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Landing
│   ├── category/[category]/
│   ├── item/[id]/
│   └── checkout/
├── src/
│   ├── components/       # Shared UI components (Header, Footer, Map, ItemBox, etc.)
│   ├── lib/              # API helpers and data utilities
│   ├── store/            # Redux store and cart slice
│   └── types/            # Shared TypeScript types
└── public/
    ├── backgrounds/      # Scene/lab background images
    └── items/            # Per-item images and GLB 3D models

re-commerce-server/
└── src/
    ├── assets/mock-data.json   # Product catalogue
    ├── products.controller.ts
    ├── products.service.ts
    └── app.module.ts
```
