# InsightX — AI Business Investigator

> **"Your dashboard shows what changed. InsightX explains WHY — with real ML evidence, ranked drivers, and actionable recommendations."**

InsightX is an AI-powered Business Intelligence Investigator built for the **Accenture Innovation Challenge Hackathon**. It turns any KPI anomaly into a structured, evidence-backed investigation — with a custom ML pipeline that trains on your own business data in real time.

---

## 🚀 Live Demo

| Service | URL |
|---|---|
| **Frontend** | `http://localhost:5173` (local) |
| **Backend API** | `http://localhost:5000` (local) |
| **ML Microservice** | `http://localhost:8000` (local) |

---

## 🎯 The Problem

Business teams discover a KPI drop in a dashboard — then spend **hours** manually stitching exports, operations data, and tribal knowledge to understand it.

InsightX shortens the path from **signal → root cause → action** by:
- Auto-detecting KPI anomalies
- Running a SHAP-attributed ML investigation
- Ranking drivers by causal evidence strength
- Generating actionable tickets with owner, priority, and checklist

---

## ✨ What's Inside — Full Feature List

### 1. 🏠 Landing Page
- Animated hero with product pitch and feature overview
- "Start Investigation" CTA that routes to the Intelligence Canvas
- Premium dark-mode UI with glassmorphism cards and gradient accents

### 2. 📊 Intelligence Canvas (Dashboard)
- **5D Motion Background** — 5 independent animated depth layers:
  - Animated indigo perspective grid (pulsing)
  - 3 large far-drifting color orbs (22–34s cycles)
  - 2 medium nearer orbs with rotation
  - 22 floating glowing particles
  - Scanline texture overlay + depth vignette
- **Revenue KPI card** — Actual vs Expected with trend indicator
- **5 interactive investigation canvas blocks** — each maps to a stage
- **Analyze Your Business Data banner** — ML Upload CTA
- Hover micro-animations, opacity transitions on each block

### 3. 🔍 5-Stage Investigation Pipeline
Each stage is a dedicated page with full ML-driven or NovaMart fallback data:

| Stage | Title | What It Shows |
|---|---|---|
| **01** | Dashboard | KPI metrics, SHAP driver bar charts, ML validation metrics |
| **02** | Investigation | Root cause decomposition chain, feature impact breakdown |
| **03** | Evidence | SHAP Evidence Signal Matrix (clickable cards), classification tiers |
| **04** | Recommendation | Hypothesis probability analysis, ML recommendations, recovery simulator |
| **05** | Action | ML-derived action ticket, interactive workflow simulation, action checklist |

When a custom dataset is loaded, **all 5 stages show real ML-generated data** from your uploaded file — not hardcoded NovaMart demo data.

### 4. 🤖 Custom Dataset ML Upload (New Feature)
- **Upload** any `.csv`, `.xlsx`, or `.xls` business file
- **4-Step modal wizard**:
  1. File selection & validation
  2. Auto schema detection (column type inference)
  3. Column mapping UI (target KPI, orders, operational metric, region, date)
  4. Training progress & completion routing
- **ML Pipeline** (trained fresh on every upload):
  - `RandomForestRegressor` — 40 estimators, parallel CPU training
  - `IsolationForest` — anomaly detection
  - `shap.TreeExplainer` — SHAP feature attribution
  - Train/test split, R² score, RMSE, MAE, F1 evaluation
  - Auto sub-samples up to 2,500 rows for instant response
- **Results render across all 5 investigation stages automatically**

### 5. 📦 InsightX Test Data Pack
Pre-built datasets in `InsightX_Test_Data_Pack/` for immediate testing:

| Dataset | File | Focus |
|---|---|---|
| IBM Telco Churn | `telco_style_churn.csv` / `.xlsx` | Customer churn, monthly charges, CLTV |
| Walmart Retail | `walmart_style_business.csv` / `.xlsx` | Revenue, profit, delivery delay, orders |

### 6. 🧠 NovaMart Built-in Scenario (Demo Case)
Pre-loaded investigation showing:
- Revenue ₹42.8M vs expected ₹46.6M (–8.2%)
- North region: –17.4% — sole anomaly
- 6 telemetry evidence signals (Delivery Delays +31%, Enterprise Churn +23%, etc.)
- Hypothesis: **Logistics Disruption — SUPPORTED at 82% confidence**
- Complete action ticket, workflow simulation, recovery projector

### 7. 🔌 Backend API
| Endpoint | Purpose |
|---|---|
| `GET /api/dashboard` | KPI summary and active investigations |
| `GET /api/investigations` | Investigation list |
| `GET /api/investigations/:id` | Investigation + custom ML result by ID |
| `POST /api/investigations/:id/run` | Run investigation pipeline |
| `GET /api/investigations/:id/evidence` | Evidence with source/strength filters |
| `GET /api/investigations/:id/hypotheses` | Ranked hypotheses |
| `GET /api/recommendations` | Recommendation queue |
| `GET/POST/PATCH /api/actions` | Manage action tickets |
| `POST /api/upload/detect` | Auto-detect CSV/Excel schema |
| `POST /api/upload/analyze` | Full ML training + investigation generation |

### 8. ⚡ ML Microservice (FastAPI — Port 8000)
| Endpoint | Purpose |
|---|---|
| `GET /health` | ML service health check |
| `POST /investigate` | NovaMart pre-trained model inference |
| `POST /upload/detect` | Schema detection for uploaded dataset |
| `POST /upload/analyze` | Full custom dataset training + SHAP analysis |

---

## 🏗️ Architecture

```
React 19 + Vite (Frontend — Port 5173)
        |
        | REST API / JSON
        v
Express.js API (Backend — Port 5000)
        |
        +── MongoDB (optional, 2s connection timeout)
        |
        +── In-Memory NovaMart Datastore (instant zero-config fallback)
        |
        +── Multer file upload middleware
        |
        | Proxied HTTP to ML service
        v
FastAPI ML Microservice (Python — Port 8000)
        |
        +── RandomForestRegressor (scikit-learn)
        +── IsolationForest anomaly detector
        +── SHAP TreeExplainer (feature attribution)
        +── pandas + NumPy preprocessing
        +── openpyxl / xlrd (Excel support)
```

---

## 💻 Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Framer Motion, Recharts, React Router v6, Lucide React |
| **Backend** | Node.js, Express, Mongoose, Multer, Axios, csv-parser, xlsx |
| **ML Microservice** | FastAPI, Uvicorn, scikit-learn, SHAP, XGBoost, pandas, NumPy, openpyxl, python-multipart |
| **Database** | MongoDB (optional) + In-memory deterministic datastore |
| **Deployment** | Vercel (frontend), Render (backend + ML service) |

---

## 📁 Repository Structure

```
InsightX-main/
├── Accenture/
│   ├── frontend/
│   │   └── src/
│   │       ├── pages/
│   │       │   ├── Landing.jsx           # Hero landing page
│   │       │   ├── Dashboard.jsx         # 5D canvas + ML upload banner
│   │       │   ├── StageDetail.jsx       # All 5 investigation stages (ML-driven)
│   │       │   ├── InvestigationDetail.jsx
│   │       │   └── ...
│   │       ├── components/
│   │       │   ├── Layout.jsx            # Full-screen layout (no header)
│   │       │   ├── Reference3DBackground.jsx  # 5D motion background
│   │       │   ├── DataUploadModal.jsx   # 4-step ML upload wizard
│   │       │   ├── SlidingPageContainer.jsx
│   │       │   ├── FloatingNavigation.jsx
│   │       │   └── ...
│   │       └── services/api.js           # Axios client + NovaMart fallback
│   └── backend/
│       ├── app.js                        # Express entry + MongoDB fallback
│       ├── controllers/
│       │   ├── dashboardController.js
│       │   ├── investigationController.js
│       │   ├── uploadController.js       # CSV/Excel parsing + ML proxy
│       │   └── ...
│       ├── services/
│       │   └── mlService.js              # FastAPI HTTP client (120s timeout)
│       ├── routes/api.js                 # All routes + Multer upload
│       ├── models/                       # Mongoose schemas
│       └── utils/memoryDb.js             # In-memory demo datastore
├── ML/
│   ├── ml_service/
│   │   └── app.py                        # FastAPI app — all ML endpoints
│   ├── models/                           # Pre-trained .pkl model files
│   ├── training/                         # Training scripts
│   ├── test_datasets/
│   │   ├── sample_logistics_issue.csv
│   │   └── sample_pricing_churn.csv
│   └── requirements.txt
├── InsightX_Test_Data_Pack/
│   ├── IBM_Telco_Churn/
│   │   ├── telco_style_churn.csv         # 7,000+ rows churn dataset
│   │   └── telco_style_churn.xlsx
│   └── Walmart_Retail/
│       ├── walmart_style_business.csv    # 5,000 rows retail dataset
│       └── walmart_style_business.xlsx
└── README.md
```

---

## ▶️ Run Locally

### Prerequisites
- Node.js 18+
- Python 3.10+
- npm & pip

### Step 1 — Install Python ML Dependencies
```bash
cd ML
pip install -r requirements.txt
```

### Step 2 — Install Backend Dependencies
```bash
cd Accenture/backend
npm install
```

### Step 3 — Install Frontend Dependencies
```bash
cd Accenture/frontend
npm install
```

### Step 4 — Start All 3 Services (3 terminals)

**Terminal 1 — ML Microservice:**
```bash
cd ML
py -3 -m uvicorn ml_service.app:app --host 0.0.0.0 --port 8000
```

**Terminal 2 — Backend API:**
```bash
cd Accenture/backend
npm start
```

**Terminal 3 — Frontend:**
```bash
cd Accenture/frontend
npm run dev
```

Open **`http://localhost:5173`** in your browser.

> **No MongoDB needed.** The backend instantly falls back to the built-in NovaMart in-memory datastore if MongoDB is not running.

### Optional — MongoDB Persistence
Create `Accenture/backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/insightx
ML_SERVICE_URL=http://localhost:8000
```

---

## 🧪 Testing the ML Pipeline

Upload any of the test datasets via the **"Upload Business Data"** button on the dashboard, or run the verification script directly:

```bash
cd ML
py -3 verify_ml_independence.py
```

**Sample output:**
```
>> Walmart Retail
   Rows=2500  Target=revenue  Change=+2.38%
   R2=0.861   RMSE=1633.43   Time=0.54s
   #1 SHAP Driver -> 'profit'  impact=2371.53
   Causal Status -> SUPPORTED

[PASS] Each dataset produced a DIFFERENT top SHAP driver.
[PASS] R2 scores are DISTINCT across datasets (not hardcoded).
```

---

## 🤝 Trust, Safety & Responsible BI

- **Evidence ≠ Causality** — `SUPPORTED` means evidence supports an explanation, not experimental proof
- **CORRELATED / INSUFFICIENT_EVIDENCE** states prevent overclaiming
- **All ML models are trained fresh** on each uploaded dataset — no global state shared between users
- **Demo data is synthetic** — NovaMart records are illustrative only
- **LLM-free** — entire pipeline is deterministic, interpretable ML — no black-box LLM dependency

---

## 🗺️ Production Roadmap

| Prototype Today | Production Next Step |
|---|---|
| Single NovaMart demo investigation | Connect governed source systems, multiple KPI contracts |
| Synthetic evidence | Capture real source timestamps, lineage, metric definitions |
| In-memory fallback | Full MongoDB Atlas with RBAC and row-level access control |
| Basic ML pipeline | Versioned model registry, drift monitoring, feature contracts |
| Open REST API | Add SSO, audit logs, encryption, rate limiting |
| CSV/Excel upload | Live database connectors (BigQuery, Snowflake, Redshift) |

---

## 👥 Team

Built for the **Accenture Innovation Challenge Hackathon**.

---

**Disclaimer:** InsightX is a proof of concept built with simulated data. It is not a production decision system and does not establish causal relationships or replace domain-expert judgment.
