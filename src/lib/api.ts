// ---------------------------------------------------------------------------
// Data access layer.
//
// The rest of the app only ever imports from here — no component or context
// talks to `fetch` directly. Every function below calls a real backend
// endpoint; none of them invent data. Two helpers set the error behaviour:
//
//   - `apiGet` treats an unreachable backend (no server, network error, 404)
//     as "no data yet" and resolves to `null`, so the UI renders a clean
//     empty state instead of an error banner when no backend is connected.
//     A backend that responds with a real error status still throws.
//   - `apiPost` always throws on failure, since POSTs are user-initiated
//     actions (e.g. submitting a prediction) that should surface a visible
//     error and let the user retry.
//
// Wire this app to a real backend by pointing these paths at it (directly,
// or via a Vite dev-server proxy / VITE_API_BASE_URL) — no other file needs
// to change.
// ---------------------------------------------------------------------------

import type {
  Farm,
  FarmInput,
  FarmerProfile,
  MapData,
  ModelScorecard,
  PredictionResult,
  Recommendation,
  SoilData,
  SocSeriesPoint,
  WeatherSummary,
} from './types'
import { buildRecommendations } from './recommendations'

const GENERIC_ERROR = 'Unable to load data. Please try again.'

function isJson(res: Response) {
  return (res.headers.get('content-type') ?? '').includes('application/json')
}

async function apiGet<T>(path: string): Promise<T | null> {
  let res: Response
  try {
    res = await fetch(path)
  } catch {
    // No backend reachable yet — treat as "no data available".
    return null
  }
  if (res.status === 404) return null
  if (!res.ok) throw new Error(GENERIC_ERROR)
  // A dev server / static host with no real backend often answers an unknown
  // path with its HTML shell (200 OK, wrong content-type) instead of a 404 —
  // that's still "no backend for this endpoint yet", not a parse error.
  if (!isJson(res)) return null
  try {
    return (await res.json()) as T
  } catch {
    return null
  }
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error(GENERIC_ERROR)
  }
  if (!res.ok || !isJson(res)) throw new Error(GENERIC_ERROR)
  try {
    return (await res.json()) as T
  } catch {
    throw new Error(GENERIC_ERROR)
  }
}

/** GET /api/profile — the logged-in farmer's profile. */
export async function getProfile(): Promise<FarmerProfile | null> {
  return apiGet<FarmerProfile>('/api/profile')
}

/** GET /api/farm — farm identity and current management practice. */
export async function getFarm(): Promise<Farm | null> {
  return apiGet<Farm>('/api/farm')
}

/** GET /api/map-data — farm location and boundary. */
export async function getMapData(): Promise<MapData | null> {
  return apiGet<MapData>('/api/map-data')
}

/** GET /api/soil — latest soil test / sensor readings for the farm. */
export async function getSoilData(): Promise<SoilData | null> {
  return apiGet<SoilData>('/api/soil')
}

/** GET /api/weather — climate summary for the farm's location. */
export async function getWeatherSummary(): Promise<WeatherSummary | null> {
  return apiGet<WeatherSummary>('/api/weather')
}

/** POST /api/predict — run the trained model on farmer-supplied inputs. */
export async function predictSoilCarbon(input: FarmInput): Promise<PredictionResult> {
  return apiPost<PredictionResult>('/api/predict', input)
}

/**
 * GET /api/recommendations — evidence-based actions matched to the farm's
 * inputs and latest prediction.
 *
 * Today this is answered locally by the rules engine in `recommendations.ts`
 * (deterministic, evidence-referenced logic — not invented data). Once a
 * backend recommendation service exists, swap the body for a fetch call;
 * callers already treat this as async.
 */
export async function getRecommendations(
  input: FarmInput,
  prediction: PredictionResult,
): Promise<Recommendation[]> {
  return buildRecommendations(input, prediction)
}

export interface RegionalInsights {
  regionName: string
  averageSocPercent: number
  attainableSocPercent: number
  farmSocPercent: number | null
  dominantSoil: string
  dominantLandUse: string
}

/** GET /api/regional-insights — district/region reference values for comparison. */
export async function getRegionalInsights(
  farmSocPercent: number | null,
): Promise<RegionalInsights | null> {
  const insights = await apiGet<Omit<RegionalInsights, 'farmSocPercent'>>('/api/regional-insights')
  if (!insights) return null
  return { ...insights, farmSocPercent }
}

/**
 * Soil carbon series for the dashboard chart.
 *
 * There is no historical measurement dataset yet, so this only surfaces the
 * current prediction (if one exists). `hasHistory` stays false and the UI
 * shows the "history will appear after enough observations" message instead
 * of inventing a trend line.
 */
export async function getSocSeries(
  currentPrediction: PredictionResult | null,
): Promise<{ hasHistory: boolean; points: SocSeriesPoint[] }> {
  const points: SocSeriesPoint[] = []
  if (currentPrediction) {
    points.push({
      label: 'Predicted (now)',
      soc: currentPrediction.socGramsPerKg,
      kind: 'predicted',
    })
  }
  return { hasHistory: false, points }
}

/** GET /api/model-scorecards — research-view model comparison metrics. */
export async function getModelScorecards(): Promise<ModelScorecard[] | null> {
  return apiGet<ModelScorecard[]>('/api/model-scorecards')
}
