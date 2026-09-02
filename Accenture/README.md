# InsightX — AI Business Investigator

> **Your Dashboard Shows What Changed. We Explain Why.**

InsightX automatically investigates unexpected business metric changes and converts raw business data into evidence-backed recommendations. It answers: What happened, Where did it happen, Why might it have happened, How confident are we, and What should we do next?

---

## 1. Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or Atlas connection URI)

### Setup & Installation

1. **Clone the repository and install root utilities**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` in both directories or create a root `.env`:
   ```bash
   cp .env.example .env
   ```

3. **Install and Seed the Backend**:
   ```bash
   cd backend
   npm install
   # Seed the database with the NovaMart demonstration dataset
   npm run seed
   # Start the Express server
   npm start
   ```

4. **Install and Run the Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 2. Environment Variables (`.env.example`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/insightx
LLM_API_KEY=your-api-key-here # Optional (will fall back to deterministic local texts)
```

---

## 3. Core Demonstration Flow
1. **Open Landing Page** at `http://localhost:5173/` and click **"Start Investigation"**.
2. **Review Dashboard** where standard KPIs are shown, noting the **Revenue Anomaly (↓8.2%)**.
3. Click **"Investigate"** on the anomaly card.
4. Watch the **Investigation Engine** execute in real time, step-by-step through its 11 diagnostic checks.
5. Review the **Dimension Breakdown** (identifying North Region as the primary driver at -17.4%).
6. Explore the **Evidence & Hypothesis** cards:
   - Identify that the **Logistics Disruption** hypothesis has 87% confidence, supported by delivery delays (+31% / +44% in North).
   - Observe the **Causal Status Warning** explaining that observational correlation does not equal proven causation.
7. Open the **Recommendations** and click **"Create Action"** on the Critical logistics ticket.
8. Navigate to the **Action Center** and shift the card status from `OPEN` to `INVESTIGATING` to close the decision loop.
