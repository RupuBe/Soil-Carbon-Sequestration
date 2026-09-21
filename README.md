# 🌱 Soil Carbon

**Soil Today, A Better Tomorrow.**

An AI/ML-powered soil carbon sequestration and soil-health decision-support
platform designed for farmers. The product connects a soil-carbon prediction to
a plain-language explanation and practical, evidence-based management guidance:

> **Farm data → Carbon prediction → Explanation → Carbon potential → Recommendation → Farmer action**

The machine-learning algorithm is deliberately *not* the visual focus. The value
is in making the prediction understandable and actionable.

---

## Status: demo mode

There is no soil dataset, trained model, or backend connected yet. The app runs
in a clearly-labelled **demo mode**:

- Every illustrative value carries a **"Demo data"** badge, and a banner sits
  under the header on every page.
- Predictions come from a small, fully documented **transparent additive model**
  (`src/lib/model.ts`) — not random numbers, and not machine learning. Because
  it is additive, each feature's contribution is an exact attribution of the
  output (the same idea SHAP implements for linear models).
- The **carbon sequestration potential** is a simplified, documented gap-method
  estimate — the methodology is shown in the UI. It is not invented.
- **No fake history** is generated. The soil-carbon chart shows the current
  prediction against regional reference values and states that historical data
  will appear once enough observations exist.
- **Recommendations** come only from predefined, evidence-referenced rules
  (`src/lib/recommendations.ts`) matched to the farm's inputs. The model never
  generates advice.
- The **Research View** model scorecard (R²/RMSE/MAE for Linear Regression, SVR,
  Random Forest, XGBoost) contains placeholder numbers illustrating the
  reporting format, labelled as such.

## Going live

The rest of the app only imports from `src/lib/api.ts`. To connect real data:

1. Set `MODE = 'live'` in `src/lib/api.ts` (or read from `import.meta.env`).
2. Implement each function there as a `fetch()` to the backend. Return types are
   unchanged, so no UI code changes.
3. Delete `src/lib/model.ts` and `src/lib/demoData.ts`.

Intended production architecture (see the Research View → *Model pipeline*):

```
Frontend → Backend/API → Data preprocessing → Trained ML model
        → Prediction → Explainability (SHAP) → Recommendation engine → Frontend
```

Candidate models: Linear Regression (baseline), Random Forest, XGBoost, SVR.
The final model is selected on validation performance — not assumed.

---

## Tech stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS** — earthy design system (forest green, sage, soil brown,
  water blue, ember orange) defined in `tailwind.config.js`
- **React Router** — persistent sidebar layout after login
- **Recharts** — soil-carbon and contribution charts
- **React-Leaflet + OpenStreetMap** — interactive farm map
- Lightweight in-app i18n (`src/lib/i18n.tsx`) — English / Hindi / Marathi

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

Demo login: any valid-looking email + a 4+ character password.

## Pages

| Route | Page |
|---|---|
| `/` | Landing |
| `/login`, `/create-account` | Auth |
| `/app` | Dashboard / Home |
| `/app/my-farm` | My Farm |
| `/app/predict` | Predict Carbon |
| `/app/analysis` | Prediction Analysis |
| `/app/recommendations` | Recommendations |
| `/app/maps` | Maps & Insights |
| `/app/learn`, `/app/learn/:slug` | Learn |
| `/app/settings` | Settings |
| `/app/profile` | Profile |
| `/app/research` | Research / Admin view (toggle "View" in the header) |

## Two audiences

- **Farmer view** (default): current carbon, prediction, why, recommendations,
  maps, simple explanations. Technical ML metrics hidden.
- **Research / Admin view**: model comparison, R²/RMSE/MAE, feature importance /
  SHAP, prediction intervals. Switch via the **View** selector in the header.

## Project structure

```
src/
  components/     reusable UI (Sidebar, Header, MetricCard, ChartCard, FarmMap,
                  PredictionForm, PredictionResult, FeatureImportanceChart,
                  RecommendationCard, StatusBadge, LanguageSelector, states…)
  context/        Auth, Farm, Prediction, i18n providers
  lib/
    api.ts        the ONLY data-access surface — swap this to go live
    types.ts      the frontend↔backend contract
    model.ts      demo-only transparent prediction model
    recommendations.ts   rules-based recommendation engine
    demoData.ts   demo-only fixtures
    learnContent.ts      educational articles
  pages/          one file per route
```

---

*Final-year engineering major project. Research context — no fabricated
scientific results; all illustrative values are marked as demo data.*
