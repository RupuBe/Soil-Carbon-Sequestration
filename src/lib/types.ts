// ---------------------------------------------------------------------------
// Shared domain types for the Soil Carbon platform.
// The frontend never computes predictions itself — these types describe the
// contract with the backend / ML service (see src/lib/api.ts).
// ---------------------------------------------------------------------------

export type CropType =
  | 'Wheat'
  | 'Rice'
  | 'Maize'
  | 'Cotton'
  | 'Sugarcane'
  | 'Pulses'
  | 'Millets'
  | 'Soybean'
  | 'Groundnut'
  | 'Vegetables'

export type SoilTexture =
  | 'Sandy'
  | 'Sandy Loam'
  | 'Loam'
  | 'Silt Loam'
  | 'Clay Loam'
  | 'Clay'

export type LandUse =
  | 'Continuous Cropland'
  | 'Cropland with Fallow'
  | 'Agroforestry'
  | 'Pasture / Grassland'
  | 'Degraded / Barren'

export type TillagePractice = 'Conventional' | 'Reduced' | 'Zero / No-till'

export type ResidueManagement = 'Removed / Burned' | 'Partially Retained' | 'Fully Retained'

/** Raw inputs a farmer provides. Mirrors the trained model's expected features. */
export interface FarmInput {
  cropType: CropType
  soilTexture: SoilTexture
  soilPh: number // 3.5 – 9.5
  soilMoisture: number // volumetric %, 0 – 60
  organicMatter: number // %, 0 – 12
  rainfall: number // mm / year, 0 – 4000
  temperature: number // mean annual °C, 0 – 45
  clayContent: number // %, 0 – 70
  landUse: LandUse
  tillage: TillagePractice
  residue: ResidueManagement
}

/** Editable working copy of `FarmInput` while the farmer is filling in the form. */
export type FarmInputDraft = {
  [K in keyof FarmInput]: FarmInput[K] extends number ? number : FarmInput[K] | ''
}

export function isCompleteFarmInput(d: FarmInputDraft): d is FarmInput {
  return (
    d.cropType !== '' &&
    d.soilTexture !== '' &&
    d.landUse !== '' &&
    d.tillage !== '' &&
    d.residue !== '' &&
    Number.isFinite(d.soilPh) &&
    Number.isFinite(d.soilMoisture) &&
    Number.isFinite(d.organicMatter) &&
    Number.isFinite(d.rainfall) &&
    Number.isFinite(d.temperature) &&
    Number.isFinite(d.clayContent)
  )
}

export const BLANK_FARM_INPUT: FarmInputDraft = {
  cropType: '',
  soilTexture: '',
  soilPh: NaN,
  soilMoisture: NaN,
  organicMatter: NaN,
  rainfall: NaN,
  temperature: NaN,
  clayContent: NaN,
  landUse: '',
  tillage: '',
  residue: '',
}

export type SocStatus = 'Low' | 'Moderate' | 'Good' | 'High'

export interface FeatureContribution {
  /** Machine feature key. */
  key: string
  /** Farmer-friendly label. */
  label: string
  /** Signed contribution in model output units (SOC %). */
  contribution: number
  /** Absolute share of the explanation, 0 – 1 (sums to ~1 across features). */
  share: number
  direction: 'increases' | 'decreases'
}

export interface SequestrationPotential {
  /** Additional carbon that could be stored, t C / ha / year. */
  rateTPerHaYear: number
  status: SocStatus
  /** Reference SOC used as the attainable target for this soil/climate, %. */
  referenceSocPercent: number
  horizonYears: number
  methodology: string
}

export interface PredictionResult {
  socPercent: number
  socGramsPerKg: number
  status: SocStatus
  /** Model 95% interval, when the backend reports uncertainty. */
  interval?: { low: number; high: number }
  explanation: {
    method: string
    baseValue: number
    features: FeatureContribution[]
    note: string
  }
  sequestration?: SequestrationPotential
  createdAt: string
}

/** Farm registry record — identity and management practice, not measurements. */
export interface Farm {
  id: string
  name: string
  village: string
  district: string
  state: string
  primaryCrop: CropType
  landUse: LandUse
  tillage: TillagePractice
  residue: ResidueManagement
}

/** Farm geolocation, served separately so the map can load independently of farm identity. */
export interface MapData {
  center: [number, number] // [lat, lng]
  boundary: [number, number][] // polygon ring
  areaHectares: number
}

/** Latest known soil test / sensor readings for the farm. */
export interface SoilData {
  soilPh: number
  soilMoisture: number
  organicMatter: number
  clayContent: number
  soilTexture: SoilTexture
}

export interface WeatherSummary {
  meanTemperatureC: number
  rainfallMm: number
  rainfallPeriodLabel: string
}

export interface FarmerProfile {
  name: string
  email: string
}

export interface SocSeriesPoint {
  label: string
  soc: number
  kind: 'measured' | 'predicted' | 'seasonal' | 'regional'
}

export interface Recommendation {
  id: string
  category: 'Soil' | 'Crop Management' | 'Farm Practices'
  icon: string
  title: string
  whyItMatters: string
  whatToDo: string
  expectedDirection: string
  evidenceNote: string
  learnMoreSlug: string
  triggeredBy: string
}

export interface ModelScorecard {
  name: string
  r2: number
  rmse: number
  mae: number
  selected: boolean
  notes: string
}
