# Art Gallery Management

A small full-stack app for managing an art gallery: browse, search, filter, sort, add and remove artworks.

(Demo:)[https://art-gallery-management-swart.vercel.app]

## Features

- Browse artworks in a responsive grid
- Search by title, filter by artist and type, sort by price (ascending / descending) — all done on the server
- Add an artwork with an image upload (Cloudinary)
- Remove an artwork with confirmation
- Filters are kept in the URL, so a filtered view can be shared

## Tech stack

- **Client:** React 19, Vite, TypeScript, Tailwind CSS, TanStack Query, React Hook Form + Zod
- **Server:** NestJS, TypeORM, PostgreSQL, Cloudinary

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/artworks` | List artworks. Query params: `search`, `artist`, `type`, `sort` (`price-asc` / `price-desc`) |
| GET | `/artworks/artists` | List of unique artists |
| GET | `/artworks/:id` | Get one artwork |
| POST | `/artworks` | Create an artwork |
| PATCH | `/artworks/:id` | Update an artwork |
| DELETE | `/artworks/:id` | Delete an artwork |
| POST | `/artworks/upload` | Upload an image (max 5 MB) |

Example: `GET /artworks?type=Painting&search=lake&sort=price-desc`

## Getting started

Requires Node.js and a running PostgreSQL database.

### Server

```bash
cd server
npm install
```

Create `server/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=gallery
PORT=3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run start:dev
```

### Client

```bash
cd client
npm install
npm run dev
```

By default the client talks to `http://localhost:3000`. To change it, set `VITE_API_BASE_URL` in `client/.env`.

## Tests

```bash
cd server
npm test
```
