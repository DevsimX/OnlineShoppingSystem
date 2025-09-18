# OnlineShoppingSystem

Full-stack demo e-commerce app (Next.js + Tailwind frontend, Django + DRF backend).

## Prerequisites
- Node.js 18+
- Python 3.11+

## Getting Started

### Backend (Django)
```bash
cd /Users/jason/OnlineShoppingSystem/backend
python3 -m venv ../venv
source ../venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install djangorestframework django-cors-headers psycopg[binary]
python manage.py migrate
python manage.py seed_shop
python manage.py runserver
```
API: http://localhost:8000/api/

### Frontend (Next.js)
```bash
cd /Users/jason/OnlineShoppingSystem/frontend
npm install
# optional: echo "NEXT_PUBLIC_API_BASE=http://localhost:8000" > .env.local
npm run dev
```
App: http://localhost:3000

## Scripts

Frontend (from `frontend/`):
```bash
npm run dev        # start Next.js dev server
npm run build      # production build
npm run start      # start production server
npm run lint       # run ESLint
```

Backend (from `backend/`):
```bash
source ../venv/bin/activate
python manage.py test          # run tests
python manage.py createsuperuser
```

## Features
- Categories, products with images
- Cart via session key stored in localStorage
- Checkout creates an order

## API Routes
- GET /api/categories/, GET /api/categories/{slug}/
- GET /api/products/, GET /api/products/{slug}/
- GET /api/carts/{session_key}/, POST /api/carts/{session_key}/add, POST /api/carts/{session_key}/remove
- POST /api/orders/

## Project Structure
```
OnlineShoppingSystem/
├─ backend/                # Django project (DRF, CORS)
│  ├─ backend/             # settings, urls
│  └─ shop/                # models, serializers, views, admin, seeds
├─ frontend/               # Next.js (App Router, Tailwind)
│  └─ src/app/             # pages and UI
├─ venv/                   # Python virtual environment (gitignored)
└─ README.md
```

## Notes
- Development only; not production-hardened.
- Inspired by sections found on `https://www.poplocal.com.au/`.
