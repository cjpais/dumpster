# dumpster.page

A collaborative drag and drop webpage builder where you can dump anything onto a canvas and share it with the world.

## Overview

dumpster.page is a collaborative drag and drop webpage builder inspired by mmm.page, but with enhanced collaboration features. The original concept was to create a place for sharing photos from events and trips that felt more like a collaborative scrapbook than just a bunch of squares on a screen like iCloud/Google Photos albums.

The core philosophy is simple: no signups, no complex authentication - just claim a URL and put whatever you want on it. You create a dumpster.page with a slug of your choosing, get an editId for collaboration, and share your digital trash heap with the world.

## Features

- **No Authentication Required**: Just pick a URL and start creating
- **Real-time Collaboration**: Multiple people can edit the same page simultaneously
- **Drag & Drop Interface**: Intuitive canvas-based editing powered by tldraw
- **Asset Uploads**: Upload images, documents, and other files directly to your page
- **Custom Styling**: Set background colors and page metadata
- **Instant Publishing**: Changes are saved and published automatically

## Architecture

dumpster.page is built with:

- **Frontend**: Next.js 15 with React 19 and TypeScript
- **Canvas Engine**: tldraw SDK for the collaborative canvas experience
- **Backend**: Cloudflare Workers with Durable Objects for real-time sync
- **Database**: Turso (SQLite) with Drizzle ORM
- **Storage**: Cloudflare R2 for asset uploads
- **Deployment**: Vercel (frontend) + Cloudflare Workers (backend)

## Application Flow

The application is broken down into four main components:

1. **Index Page** - Landing page and discovery
2. **Create a new dumpster.page** - Generate a new collaborative canvas
3. **Edit a dumpster.page** - Real-time collaborative editing with editId
4. **View a dumpster.page** - Public view of published content

### URL Structure

- `dumpster.page/` - Home page
- `dumpster.page/create` - Create a new page
- `dumpster.page/edit/[editId]` - Edit mode (collaborative)
- `dumpster.page/[slug]` - Public view

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) or Node.js 18+
- [Cloudflare account](https://cloudflare.com/) for Workers and R2
- [Turso account](https://turso.tech/) for the database

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
TURSO_DATABASE_URL="libsql://"
TURSO_AUTH_TOKEN=""

# Cloudflare R2 Storage
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME=""

# Cloudflare Worker URL
NEXT_PUBLIC_TLDRAW_WORKER_URL=""
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dumpster.git
cd dumpster
```

2. Install dependencies:
```bash
bun install
```

3. Set up the database:
```bash
bun run db:generate
bun run db:migrate
```

4. Start the development server:
```bash
bun run dev
```

This will start both the Next.js frontend (port 3000) and the Cloudflare Worker (port 5172) in development mode.

### Development Scripts

- `bun run dev` - Start both client and worker in development mode
- `bun run dev:client` - Start only the Next.js development server
- `bun run dev:worker` - Start only the Cloudflare Worker
- `bun run build` - Build the Next.js application
- `bun run db:generate` - Generate database migrations
- `bun run db:migrate` - Run database migrations
- `bun run db:studio` - Open Drizzle Studio for database management

## Deployment

### Frontend (Vercel)

The frontend can be deployed to Vercel with zero configuration:

1. Connect your GitHub repository to Vercel
2. Set the required environment variables
3. Deploy

### Backend (Cloudflare Workers)

Deploy the worker using Wrangler:

```bash
wrangler deploy
```

Make sure to configure:
- Durable Objects binding: `TLDRAW_DURABLE_OBJECT`
- R2 bucket binding: `TLDRAW_BUCKET`
- Environment variables for database access

## Database Schema

The application uses a simple schema with one main table:

```sql
pages (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  edit_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  title TEXT,
  description TEXT,
  background_color TEXT
)
```

## Contributing

Contributions are welcome! This project embraces the spirit of creative chaos and collaborative building.

## Examples

Check out some example dumpster pages:
- [Vintage Computer Festival SoCal 2025](https://dumpster.page/vcf-socal-2025)
- [Dumpster Factory (features/bugs)](https://dumpster.page/dumpster-factory)
- [Early 2025](https://dumpster.page/early-2025)

## License

MIT

---

*made for raccoons.* 🦝
