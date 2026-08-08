# RouteBD

Intelligent Dhaka bus route search — a portfolio project answering "how do I get from A to B by bus?"

This is **Phase 1**: a proof-of-concept covering route search (direct + one-transfer), an interactive map, a bus directory, a stop explorer, and a fare calculator, backed by a small hand-curated dataset of real Dhaka bus corridors. It is designed to run entirely on free-tier hosting (Vercel, Render free web service, Neon Postgres, Upstash Redis) — see `project_requirements.txt` for the full long-term vision and later phases.

## Stack

- **Backend**: Django, Django REST Framework, PostgreSQL, Redis (cache), Celery (app factory scaffolded, no worker running yet)
- **Frontend**: Next.js (App Router), TypeScript, TailwindCSS, React Query, Leaflet
- **Local dev**: Docker Compose

## Getting started

```bash
cp .env.example .env
docker compose up --build
```

Then, in a second terminal, run migrations and load the seed data:

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py load_seed_data
docker compose exec backend python manage.py createsuperuser
```

- Frontend: http://localhost:3000
- API docs (Swagger): http://localhost:8000/api/docs/
- Django Admin: http://localhost:8000/admin/

Try the golden path: search **Banani → Motijheel** on the homepage.

## Repo layout

```
backend/    Django project (apps/: core, accounts, companies, buses, stops, routes, fares, journey, search)
frontend/   Next.js app
```

## Data accuracy note

Seed data (`backend/seed_data/dhaka_routes.json`) uses real Dhaka company names, bus types, and area names along real corridors, with approximate stop coordinates and hand-estimated inter-stop distances/fares. It is built for a convincing demo, not for real-world navigation — verify against current, authoritative sources before relying on it for anything beyond the showcase.

## What's deferred to later phases

No Elasticsearch, no running Celery worker, no community reports/blog/favorites/reviews, no bespoke admin dashboard (Django Admin only), no image upload/R2, no multi-city switcher, no public API portal, no AI chatbot, no live GPS. See the plan history for the full phased roadmap.
