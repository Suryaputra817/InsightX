# InsightX - AI Business Investigator

> **Your dashboard shows what changed. InsightX helps explain why, what to do next, and how certain to be.**

InsightX is a hackathon prototype for the **BusinessIntelligence.ai** challenge track. It turns a material KPI movement into an evidence-backed investigation: it pinpoints the affected segment, compares competing explanations, communicates confidence and uncertainty, and converts the outcome into owner-assigned actions.

**Live prototype:** [Open InsightX](https://insightx-business-investigator.vercel.app)  
**API:** [Render API](https://insightx-api-i3qa.onrender.com)  
**ML service health:** [Render ML service](https://insightx-ml.onrender.com/health)

## The problem

Business teams usually discover a KPI movement in a dashboard, then spend hours stitching together exports, operational data, and tribal knowledge to understand it. That workflow is slow, difficult to audit, and often produces a confident narrative without enough evidence.

InsightX is designed to shorten the path from **signal** to **responsible action**. Rather than treating an LLM as a source of quantitative truth, the prototype keeps quantitative findings, evidence, confidence, and recommended actions explicit and inspectable.

## What the prototype demonstrates

The NovaMart scenario simulates a material revenue decline:

| Signal | Demonstrated result |
| --- | --- |
| KPI anomaly | Revenue is ₹42.8M against an expected ₹46.6M (-8.2%) |
| Segmentation | North region is the principal regional contributor (-17.4%) |
| Cross-functional evidence | Delivery delays, delayed orders, complaints, sales, and market signals |
| Ranked explanation | Logistics disruption is **SUPPORTED** at 87% confidence |
| Alternative hypothesis | Competitor pricing is labelled **CORRELATED**, not causal proof |
| Decision loop | Critical recommendations become actions with owner, priority, status, and timeline |

### Core user journey

1. Open the dashboard and identify a material revenue movement.
2. Start an investigation to view the metric, regional, customer, and product contribution breakdowns.
3. Inspect supporting and contradicting evidence for each hypothesis.
4. Review confidence and causal-status labels before acting.
5. Create a recommendation-backed action, assign an owner, and move it through `OPEN`, `INVESTIGATING`, and `RESOLVED`.

## Challenge alignment

| Challenge objective | InsightX response |
| --- | --- |
| Detect and prioritise KPI movements | Threshold-based anomaly identification with severity in the dashboard |
| Reconcile business context | A simulated unified evidence layer across logistics, orders, CRM, sales, and market intelligence |
| Rank explanatory drivers | Dimension contribution analysis and ranked hypotheses |
| Generate traceable narratives | Every conclusion is paired with visible evidence, a confidence value, and causal-status language |
| Abstain under uncertainty | `CORRELATED` and `INSUFFICIENT_EVIDENCE` states prevent overclaiming causal certainty |
| Recommend practical actions | Action cards include a controllable response, owner, priority, reason, and confidence |
| Learn from feedback | Action status/timeline is persisted by the API; analyst corrections are a planned extension |
| Work within constraints | Deterministic local fallback enables a reliable demo without an LLM dependency |

## Architecture

```text
React + Vite decision workspace
        |
        | HTTPS / JSON
        v
Node.js + Express investigation API
        |
        +-- MongoDB via Mongoose (optional persistence)
        |
        +-- In-memory NovaMart datastore (zero-config demo fallback)
        |
        +-- Optional FastAPI ML service (model exploration and scoring)
```

The deployed web experience communicates with the Express API. If MongoDB is unavailable, the API intentionally falls back to deterministic seeded data so the demonstration remains reproducible.

## Technology stack

- **Frontend:** React 19, Vite, Tailwind CSS, Recharts, Framer Motion, React Router
- **Backend:** Node.js, Express, Mongoose, CORS
- **Data:** MongoDB or a deterministic in-memory datastore for the prototype
- **ML exploration:** FastAPI, scikit-learn, XGBoost, SHAP, pandas, NumPy
- **Deployment:** Vercel (frontend) and Render (API/ML service)

## Repository structure

```text
Accenture/
├── frontend/                 # React decision workspace
│   └── src/
│       ├── pages/            # Dashboard, investigations, evidence, actions
│       ├── components/       # Shared layout and visual components
│       └── services/api.js   # API client and reliable local fallback
├── backend/                  # Express API
│   ├── controllers/          # Dashboard, investigation, and action flows
│   ├── models/               # Mongoose schemas
│   ├── services/             # Analysis, evidence, hypothesis, recommendations
│   └── utils/memoryDb.js     # Deterministic demo dataset
└── render.yaml               # Render API deployment definition
```

The accompanying repository also includes an `ML/` FastAPI service and pre-trained prototype models.

## Run locally

### Prerequisites

- Node.js 18 or later
- npm
- Optional: MongoDB local instance or Atlas URI
- Optional ML runtime: Python 3.10+ and pip

### 1. Start the API

```bash
cd backend
npm ci
npm start
```

The API runs at `http://localhost:5000`. It will use the built-in NovaMart datastore if `MONGO_URI` is not available.

### 2. Start the frontend

In a second terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173`.

### 3. Optional MongoDB persistence

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/insightx
LLM_API_KEY=
```

To populate a **dedicated, disposable** `insightx` database with the NovaMart scenario:

```bash
cd backend
npm run seed
```

> Warning: `npm run seed` clears the prototype collections before inserting demo data. Never point it at a shared or production database.

### 4. Configure a hosted frontend

Set the API base URL when building for Vercel or another host:

```env
VITE_API_URL=https://your-api.onrender.com/api
```

## API surface

| Endpoint | Purpose |
| --- | --- |
| `GET /api/dashboard` | KPI summary and active investigations |
| `GET /api/investigations` | Investigation list |
| `GET /api/investigations/:id` | Investigation detail |
| `POST /api/investigations/:id/run` | Complete a prototype investigation |
| `GET /api/investigations/:id/evidence` | Evidence with optional source/strength filters |
| `GET /api/investigations/:id/hypotheses` | Ranked hypotheses |
| `GET /api/recommendations` | Recommendation queue |
| `GET/POST/PATCH /api/actions` | Create and manage action status |

## Trust, safety, and responsible BI

This project is a prototype and intentionally makes its limits visible:

- **Evidence is not causality.** `SUPPORTED` indicates available evidence supports an explanation; it does not claim experimental proof.
- **Confidence is decision support, not a truth guarantee.** Low or conflicting signals should trigger clarification and analyst review.
- **Demo data is synthetic.** NovaMart records are illustrative and must not be used for operational decisions.
- **Role-based security is a next-step capability.** The prototype identifies its importance, but it does not yet implement production-grade SSO, row/column-level access control, or data masking.
- **LLM use is optional.** The current experience works deterministically without sending business data to an LLM.

## Known prototype boundaries and next steps

| Prototype today | Production-ready next step |
| --- | --- |
| One curated multi-factor investigation | Connect governed source systems and support multiple KPI contracts |
| Simulated evidence freshness and lineage | Capture source timestamps, transformations, metric definitions, and lineage automatically |
| Shared decision workspace | Persona-specific narratives for executives, analysts, and operations owners |
| Manual action feedback | Capture acceptance, overrides, outcomes, and feedback-driven calibration |
| Optional ML service | Validate and integrate models through versioned APIs, monitoring, and feature contracts |
| Open prototype API | Add SSO, RBAC/ABAC, audit logs, encryption, retention, and secure secret management |

## Demo script for judges

1. Start at the landing page and select **Start Investigation**.
2. On the dashboard, call out the -8.2% revenue deviation.
3. Navigate to the investigation and show North, Enterprise, and Product A as the strongest affected segments.
4. Open Evidence Explorer and contrast logistics evidence with the weaker competitor-pricing explanation.
5. Explain the difference between **SUPPORTED**, **CORRELATED**, and **INSUFFICIENT EVIDENCE**.
6. Create the critical operations action and update its status in Action Center.
7. Close by showing the architecture and the production roadmap for data governance, feedback, and persona-specific delivery.

## Team

Built as an Accenture Innovation Challenge hackathon prototype.

---

**Disclaimer:** InsightX is a proof of concept built with simulated data. It is not a production decision system and does not establish causal relationships or replace domain-expert judgement.
