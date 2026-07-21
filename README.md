# colorAnalysis

AI-powered color analysis for fashion — a hackathon project. Users will be able to get a personal color analysis and receive matching product recommendations. The AI model will be integrated into the backend in a later phase; this repository currently contains the production-ready project scaffold.

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS v4
- React Router
- Axios
- ESLint + Prettier

**Backend**
- Python 3 + FastAPI
- Uvicorn (ASGI server)
- Pydantic Settings for configuration
- CORS enabled for the frontend

## Project Structure

```
myntra-colorAnalysis/
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route-level page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API clients (Axios)
│   │   ├── assets/       # Images, fonts, static files
│   │   ├── layouts/      # Shared page layouts
│   │   ├── routes/       # React Router route definitions
│   │   └── utils/        # Helper functions
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/          # Route handlers (health, future endpoints)
│   │   ├── core/         # App configuration (env-driven settings)
│   │   ├── services/     # Business logic (future AI model integration)
│   │   ├── models/       # Pydantic schemas / data models
│   │   ├── utils/        # Helper functions
│   │   └── main.py       # FastAPI app entry point
│   ├── requirements.txt
│   └── .env.example
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js ≥ 20
- Python ≥ 3.11
- npm

### Backend

```bash
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Run the dev server (http://localhost:8000)
uvicorn app.main:app --reload
```

Verify it's running:

```bash
curl http://localhost:8000/health
# {"status":"ok"}
```

Interactive API docs are available at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Run the dev server (http://localhost:5173)
npm run dev
```

### Frontend Scripts

| Script                 | Description                       |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start the Vite dev server         |
| `npm run build`        | Production build                  |
| `npm run preview`      | Preview the production build      |
| `npm run lint`         | Run ESLint                        |
| `npm run format`       | Format with Prettier              |
| `npm run format:check` | Check formatting without writing  |

## API

| Method | Endpoint  | Description                            |
| ------ | --------- | -------------------------------------- |
| GET    | `/health` | Health check — returns `{"status":"ok"}` |

## Configuration

Both apps read configuration from `.env` files (see the `.env.example` in each app):

- **frontend** — `VITE_API_BASE_URL`: base URL of the backend API
- **backend** — `CORS_ORIGINS`: comma-separated list of allowed frontend origins, plus app/server settings

## Roadmap

- [x] Project scaffold (frontend + backend)
- [ ] Integrate the AI color analysis model
- [ ] Color analysis API endpoints
- [ ] Frontend UI for capture, analysis, and recommendations
