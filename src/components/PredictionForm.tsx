import { useMemo, useState } from 'react'
import { ArrowRight, Loader2, RotateCcw } from 'lucide-react'
import type {
  CropType,
  FarmInput,
  FarmInputDraft,
  LandUse,
  ResidueManagement,
  SoilTexture,
  TillagePractice,
} from '../lib/types'

const CROPS: CropType[] = [
  'Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane', 'Pulses', 'Millets', 'Soybean', 'Groundnut', 'Vegetables',
]
const TEXTURES: SoilTexture[] = ['Sandy', 'Sandy Loam', 'Loam', 'Silt Loam', 'Clay Loam', 'Clay']
const LAND_USES: LandUse[] = [
  'Continuous Cropland', 'Cropland with Fallow', 'Agroforestry', 'Pasture / Grassland', 'Degraded / Barren',
]
const TILLAGE: TillagePractice[] = ['Conventional', 'Reduced', 'Zero / No-till']
const RESIDUE: ResidueManagement[] = ['Removed / Burned', 'Partially Retained', 'Fully Retained']

interface NumField {
  key: keyof FarmInput
  label: string
  unit: string
  min: number
  max: number
  step: number
  hint: string
}

const NUM_FIELDS: NumField[] = [
  { key: 'soilPh', label: 'Soil pH', unit: '', min: 3.5, max: 9.5, step: 0.1, hint: 'Typical farm soils: 4.5 – 9.0' },
  { key: 'soilMoisture', label: 'Soil Moisture', unit: '% vol', min: 0, max: 60, step: 1, hint: 'Field-capacity soils sit around 20 – 35%' },
  { key: 'organicMatter', label: 'Organic Matter', unit: '%', min: 0, max: 12, step: 0.1, hint: 'Most farmed topsoils: 0.5 – 5%' },
  { key: 'rainfall', label: 'Rainfall', unit: 'mm/yr', min: 0, max: 4000, step: 10, hint: 'Mean annual rainfall for the farm' },
  { key: 'temperature', label: 'Temperature', unit: '°C', min: 0, max: 45, step: 0.1, hint: 'Mean annual air temperature' },
  { key: 'clayContent', label: 'Clay Content', unit: '%', min: 0, max: 70, step: 1, hint: 'Share of clay-sized particles in the soil' },
]

const SELECT_FIELDS: { key: keyof FarmInput; label: string }[] = [
  { key: 'cropType', label: 'Crop Type' },
  { key: 'soilTexture', label: 'Soil Texture' },
  { key: 'landUse', label: 'Land Use' },
  { key: 'tillage', label: 'Tillage Practice' },
  { key: 'residue', label: 'Crop Residue' },
]

type Errors = Partial<Record<keyof FarmInput, string>>

function validate(input: FarmInputDraft): Errors {
  const e: Errors = {}
  for (const f of NUM_FIELDS) {
    const v = input[f.key] as number
    if (v === null || v === undefined || Number.isNaN(v)) {
      e[f.key] = `${f.label} is required`
    } else if (v < f.min || v > f.max) {
      e[f.key] = `${f.label} must be between ${f.min} and ${f.max}${f.unit ? ' ' + f.unit : ''}`
    }
  }
  for (const f of SELECT_FIELDS) {
    if (!input[f.key]) e[f.key] = `${f.label} is required`
  }
  return e
}

interface Props {
  initial: FarmInputDraft
  onSubmit: (input: FarmInput) => void
  loading?: boolean
  submitLabel?: string
  onReset?: () => void
}

export function PredictionForm({ initial, onSubmit, loading, submitLabel = 'Predict Carbon', onReset }: Props) {
  const [input, setInput] = useState<FarmInputDraft>(initial)
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const errors = useMemo(() => validate(input), [input])
  const showError = (k: keyof FarmInput) => (submitAttempted || touched.has(k)) && errors[k]

  const set = (patch: Partial<FarmInputDraft>) => setInput((p) => ({ ...p, ...patch }))
  const markTouched = (k: string) => setTouched((s) => new Set(s).add(k))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)
    if (Object.keys(errors).length === 0) onSubmit(input as FarmInput)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-forest-700">Crop &amp; land</legend>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select
            label="Crop Type"
            value={input.cropType}
            options={CROPS}
            error={showError('cropType')}
            onChange={(v) => set({ cropType: v as CropType })}
            onBlur={() => markTouched('cropType')}
          />
          <Select
            label="Soil Texture"
            value={input.soilTexture}
            options={TEXTURES}
            error={showError('soilTexture')}
            onChange={(v) => set({ soilTexture: v as SoilTexture })}
            onBlur={() => markTouched('soilTexture')}
          />
          <Select
            label="Land Use"
            value={input.landUse}
            options={LAND_USES}
            error={showError('landUse')}
            onChange={(v) => set({ landUse: v as LandUse })}
            onBlur={() => markTouched('landUse')}
          />
          <Select
            label="Tillage Practice"
            value={input.tillage}
            options={TILLAGE}
            error={showError('tillage')}
            onChange={(v) => set({ tillage: v as TillagePractice })}
            onBlur={() => markTouched('tillage')}
          />
          <Select
            label="Crop Residue"
            value={input.residue}
            options={RESIDUE}
            error={showError('residue')}
            onChange={(v) => set({ residue: v as ResidueManagement })}
            onBlur={() => markTouched('residue')}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-forest-700">Soil &amp; climate measurements</legend>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NUM_FIELDS.map((f) => {
            const err = showError(f.key)
            return (
              <div key={f.key}>
                <label className="label" htmlFor={f.key}>
                  {f.label} {f.unit && <span className="text-ink-faint">({f.unit})</span>}
                </label>
                <input
                  id={f.key}
                  name={f.key}
                  type="number"
                  inputMode="decimal"
                  className={`input ${err ? 'input-error' : ''}`}
                  value={Number.isFinite(input[f.key] as number) ? (input[f.key] as number) : ''}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  aria-invalid={!!err}
                  aria-describedby={`${f.key}-hint`}
                  onBlur={() => markTouched(f.key)}
                  onChange={(e) =>
                    set({ [f.key]: e.target.value === '' ? NaN : Number(e.target.value) } as Partial<FarmInput>)
                  }
                />
                <p id={`${f.key}-hint`} className={`mt-1 text-xs ${err ? 'text-ember-dark' : 'text-ink-faint'}`}>
                  {err || f.hint}
                </p>
              </div>
            )
          })}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Predicting…
            </>
          ) : (
            <>
              {submitLabel} <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>
        {onReset && (
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setInput(initial)
              setTouched(new Set())
              setSubmitAttempted(false)
              onReset()
            }}
          >
            <RotateCcw className="h-4 w-4" aria-hidden /> Reset to farm defaults
          </button>
        )}
        {submitAttempted && Object.keys(errors).length > 0 && (
          <p className="text-sm text-ember-dark" role="alert">
            Please fix the highlighted fields.
          </p>
        )}
      </div>
    </form>
  )
}

function Select({
  label,
  value,
  options,
  error,
  onChange,
  onBlur,
}: {
  label: string
  value: string
  options: string[]
  error?: string | false
  onChange: (v: string) => void
  onBlur?: () => void
}) {
  return (
    <div>
      <label className="label" htmlFor={label}>
        {label}
      </label>
      <select
        id={label}
        className={`input appearance-none bg-canvas ${error ? 'input-error' : ''}`}
        value={value}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-ember-dark" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
