# Price Monitor

A Django-based web application that monitors product prices across multiple competitors, tracks price history, sends alerts when prices drop below targets, and provides an interactive dashboard with charts and CSV export.

---

## Features

- **Dashboard** — Real-time stats cards, interactive price trend chart (Line/Bar toggle), sortable & searchable product table, dark/light theme toggle
- **Add Product** — Form with client + server-side validation to add products and competitors
- **Price Scraping** — Automated background scraper using APScheduler (runs every 30 minutes)
- **Price Alerts** — Email (Gmail SMTP) and WhatsApp (Twilio) alerts when prices drop below target
- **CSV Export** — Download full price history as CSV from the navbar or admin panel
- **REST API** — Browse products at `/api/products/` via Django REST Framework
- **Admin Panel** — Full CRUD with inline competitors, filters, search, date hierarchy, and bulk CSV export action
- **Render Ready** — Pre-configured for one-click deployment on Render with PostgreSQL

---

## Tech Stack

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Backend     | Django 5.x / Django REST Framework   |
| Frontend    | Bootstrap 5.3, Chart.js, Vanilla JS  |
| Database    | SQLite (dev) / PostgreSQL (prod)     |
| Scraping    | BeautifulSoup4, Requests             |
| Scheduling  | APScheduler (BackgroundScheduler)    |
| Alerts      | Django Email (SMTP), Twilio WhatsApp |
| Deployment  | Gunicorn, WhiteNoise, Render         |

---

## Project Structure

```
price_monitor/
├── manage.py
├── requirements.txt
├── runtime.txt
├── Procfile
├── build.sh
├── render.yaml
├── .gitignore
├── db.sqlite3
│
├── price_monitor/          # Django project settings
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
├── monitor/                # Main app
│   ├── __init__.py
│   ├── app.py              # AppConfig with scheduler startup
│   ├── models.py           # Product, Competitor, PriceHistory
│   ├── admin.py            # Admin with inlines, filters, CSV action
│   ├── views.py            # Dashboard, Add Product, Export CSV
│   ├── forms.py            # ProductForm (ModelForm)
│   ├── api_views.py        # DRF ProductAPI
│   ├── serializers.py      # ProductSerializer
│   ├── scraper.py          # BeautifulSoup price scraper
│   ├── scheduler.py        # APScheduler background job
│   ├── alerts.py           # Email and WhatsApp alert functions
│   ├── utils.py
│   └── migrations/
│
├── templates/
│   ├── base.html           # Shared layout with navbar, theme toggle
│   ├── dashboard.html      # Stats, chart, product table
│   └── add_product.html    # Product + competitor form
│
└── static/
    ├── app.js              # Theme toggle, search, sort, toasts, counters
    └── chart.js            # Chart.js multi-dataset rendering
```

---

## Setup (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/price_monitor.git
cd price_monitor
```

### 2. Create and activate virtual environment

```bash
python -m venv pvenv

# Windows
pvenv\Scripts\activate

# macOS/Linux
source pvenv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run migrations

```bash
python manage.py migrate
```

### 5. Create superuser (for admin panel)

```bash
python manage.py createsuperuser
```

### 6. Run the server

```bash
python manage.py runserver
```

### 7. Open in browser

| Page          | URL                                    |
|--------------|----------------------------------------|
| Dashboard    | http://127.0.0.1:8000/                 |
| Add Product  | http://127.0.0.1:8000/add/             |
| Export CSV   | http://127.0.0.1:8000/export/          |
| Admin Panel  | http://127.0.0.1:8000/admin/           |
| REST API     | http://127.0.0.1:8000/api/products/    |

---

## Environment Variables

Set these in a `.env` file or in your hosting platform's dashboard:

| Variable                 | Description                        | Default                  |
|-------------------------|------------------------------------|--------------------------|
| `SECRET_KEY`            | Django secret key                  | Auto-generated on Render |
| `DEBUG`                 | Debug mode (`True`/`False`)        | `True`                   |
| `DATABASE_URL`          | PostgreSQL connection string       | SQLite (local)           |
| `ALLOWED_HOSTS`         | Comma-separated hostnames          | `*`                      |
| `CSRF_TRUSTED_ORIGINS`  | Comma-separated origins            | —                        |
| `EMAIL_HOST_USER`       | Gmail address for alerts           | —                        |
| `EMAIL_HOST_PASSWORD`   | Gmail app password                 | —                        |

---

## Deploy to Render

### Option A: Blueprint (Automatic)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New** → **Blueprint**
3. Connect your GitHub repo
4. Render reads `render.yaml` and auto-creates:
   - Web Service (free tier) with Gunicorn
   - PostgreSQL database (free tier) with `DATABASE_URL` auto-linked
5. Set `EMAIL_HOST_USER` and `EMAIL_HOST_PASSWORD` env vars in dashboard (optional)
6. Deploy triggers automatically

### Option B: Manual

1. **New Web Service** → connect repo
2. **Build Command:** `./build.sh`
3. **Start Command:** `gunicorn price_monitor.wsgi:application --bind 0.0.0.0:$PORT`
4. **Add environment variables:** `SECRET_KEY`, `DEBUG=False`, `DATABASE_URL`
5. Deploy

---

## Client Site Usage

### Dashboard (`/`)
- **Stats Cards** — Total Products, Below Target, Above Target, Data Points (animated counters)
- **Price Chart** — Multi-product line chart with tooltips. Toggle between Line and Bar views
- **Product Table** — Shows product name, target price, latest price, status badge, competitor count, history count
- **Search** — Type in the search box to filter products by name instantly
- **Sort** — Click column headers (Product, Target Price, Latest Price) to sort ascending/descending
- **Dark Mode** — Click the moon/sun icon in the navbar to toggle theme (persisted in localStorage)
- **Export** — Click "Export CSV" in navbar to download all price history

### Add Product (`/add/`)
- Fill in product name and target price
- Fill in competitor name, product URL, and CSS price selector
- Form validates on both client and server side
- Redirects to dashboard on success

---

## Admin Site Usage

### Login (`/admin/`)
- Use the superuser credentials you created

### Products
- List view shows name, target price, competitor count, latest scraped price
- Click a product to edit — competitors are editable inline (add/remove directly)
- Search by product name

### Competitors
- List view shows competitor name, linked product, URL
- Filter sidebar to filter by product
- Search by competitor or product name

### Price Histories
- List view shows product, competitor, price, timestamp
- **Filters:** Product, Competitor, Timestamp
- **Date Hierarchy:** Navigate by Year → Month → Day
- **Search:** By product or competitor name
- **Bulk Action:** Select rows → choose "Export selected as CSV" → click Go

---

## Author

**Bipronath Saha**

---

## License

This project is open source and available under the [MIT License](LICENSE).
