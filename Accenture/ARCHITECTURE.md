# ARCHITECTURE — InsightX

## 1. System Topology
InsightX follows a decoupled client-server architecture. The frontend communicates with the Express backend API over HTTP.

```
       +---------------------------------------------+
       |             React / Vite Client             |
       +--------------------+------------------------+
                            |
                            | JSON HTTP
                            v
       +--------------------+------------------------+
       |             Node.js / Express API           |
       +-------+--------------------+----------------+
               |                    |
               | Mongoose           | HTTP
               v                    v
      +--------+-------+   +--------+----------------+
      |    MongoDB     |   | AI / LLM Service Proxy  |
      +----------------+   +-------------------------+
```

## 2. Component Responsibility Map

### Frontend (`frontend/src/`)
- **Pages**: Handles layout states, navigation pathways, and UI routing using `react-router-dom`.
- **Components**: Reusable interface widgets (cards, panels, layout wrappers).
- **Charts**: Customized Recharts visualizations for expected vs actual revenue and dimension contribution.
- **State Management**: React Context / Hooks for simulation, tracking runs, and mock updates.

### Backend (`backend/`)
- **Models**: Mongoose schemas defining structural data for Metrics, Investigations, Evidence, Hypotheses, Recommendations, and Actions.
- **Services**: Pure business logic separated from router logic.
  - `anomalyService`: Compares numbers and registers metric warnings.
  - `dimensionService`: Computes highest contributing segments.
  - `evidenceService`: Filters and correlates files, logs, and CRM inputs.
  - `hypothesisService`: Evaluates supporting vs contradicting facts, outputs scores.
  - `recommendationService`: Structures actions and owner profiles.
  - `llmService`: Translates statistical dimensions into semantic narratives (with deterministic local fallbacks).
- **Controllers / Routes**: Orchestrates requests, validates formats, and returns standardized payloads.
- **Database**: Stores the active sandbox state and action updates.
