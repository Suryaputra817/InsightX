# PRD — InsightX

## 1. Executive Summary
InsightX is an AI Business Investigator that detects, analyzes, and explains unexpected shifts in core business metrics. Traditional BI shows *what* changed (charts, alerts). InsightX explains *why* it changed by mapping dimensions, collecting cross-functional evidence, scoring hypotheses, and guiding the user to collaborative actions.

## 2. Scope & Target Audience
- **Target User**: Product owners, operations managers, sales executives, and business intelligence leaders.
- **Problem Solved**: High latency between anomaly detection and root-cause analysis (hours/days of analyst exploration).
- **Core Loop**: Anomaly → Segment Breakdown → Evidence Fetching → Hypothesis Generation → Confidence & Causal Scoring → Recommended Action → Actions Tracker.

## 3. Key MVP Features
1. **Landing Page**: Enterprise-grade value proposition, problem/solution visualization, live interactive preview.
2. **Executive Dashboard**: Key KPIs (Revenue, Orders, Customers, Conversion, Complaints), expected vs. actual charts, active investigations.
3. **Investigations Workspace**:
   - **What Happened**: Clear deviation stats (expected: ₹46.6M vs actual: ₹42.8M, change: -8.2%).
   - **Where It Happened**: Segment breakdowns (Region, Segment, Product) highlighting greatest anomaly contributions.
   - **Investigation Tree**: Visual node graph showing how metrics, segments, evidence, and hypotheses interlink.
   - **Investigation Engine**: Programmatic analysis showing diagnostic stages step-by-step.
4. **Causal & Confidence Systems**:
   - Visual badges marking causal relationship: `SUPPORTED`, `CORRELATED`, `INSUFFICIENT_EVIDENCE`.
   - Tooltips explaining that "Supported is not proven causation".
5. **Recommendations Engine**: Contextual suggestions (Critical, High, Medium) with explicit ownership assignments.
6. **Action Center**: Closed-loop tracking where actions are logged, assigned, and moved through `OPEN` → `INVESTIGATING` → `RESOLVED` statuses.

## 4. Non-Functional Requirements
- **Deterministic Seed Data**: Always uses the NovaMart dataset (Revenue decline of -8.2%, North region decline of -17.4%, Enterprise drop of -23.1%, etc.) to ensure repeatable demos.
- **Reliable Fallbacks**: Built-in deterministic explanation models so the app runs without external LLM keys.
- **Accessibilities**: Screen reader-friendly markup, high-contrast, keyboard navigable.
