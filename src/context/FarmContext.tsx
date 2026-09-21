import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { getFarm, getMapData, getSoilData, getWeatherSummary } from '../lib/api'
import { BLANK_FARM_INPUT } from '../lib/types'
import type { Farm, FarmInputDraft, MapData, SoilData, WeatherSummary } from '../lib/types'

interface FarmValue {
  farm: Farm | null
  mapData: MapData | null
  soilData: SoilData | null
  weather: WeatherSummary | null
  loading: boolean
  error: string | null
  /** Working copy of the model inputs, editable on the My Farm / Predict pages. */
  input: FarmInputDraft
  updateInput: (patch: Partial<FarmInputDraft>) => void
  resetInput: () => void
  reload: () => void
}

const FarmContext = createContext<FarmValue | null>(null)

/** Builds the prediction form's starting values from whatever real data is available. */
function draftFrom(farm: Farm | null, soil: SoilData | null, weather: WeatherSummary | null): FarmInputDraft {
  return {
    cropType: farm?.primaryCrop ?? '',
    soilTexture: soil?.soilTexture ?? '',
    soilPh: soil?.soilPh ?? NaN,
    soilMoisture: soil?.soilMoisture ?? NaN,
    organicMatter: soil?.organicMatter ?? NaN,
    rainfall: weather?.rainfallMm ?? NaN,
    temperature: weather?.meanTemperatureC ?? NaN,
    clayContent: soil?.clayContent ?? NaN,
    landUse: farm?.landUse ?? '',
    tillage: farm?.tillage ?? '',
    residue: farm?.residue ?? '',
  }
}

export function FarmProvider({ children }: { children: ReactNode }) {
  const [farm, setFarm] = useState<Farm | null>(null)
  const [mapData, setMapData] = useState<MapData | null>(null)
  const [soilData, setSoilData] = useState<SoilData | null>(null)
  const [weather, setWeather] = useState<WeatherSummary | null>(null)
  const [input, setInput] = useState<FarmInputDraft>(BLANK_FARM_INPUT)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Kept outside state so `resetInput` can rebuild the draft without waiting on a re-render.
  const latest = useRef<{ farm: Farm | null; soil: SoilData | null; weather: WeatherSummary | null }>({
    farm: null,
    soil: null,
    weather: null,
  })

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    Promise.all([getFarm(), getMapData(), getSoilData(), getWeatherSummary()])
      .then(([f, map, soil, w]) => {
        setFarm(f)
        setMapData(map)
        setSoilData(soil)
        setWeather(w)
        latest.current = { farm: f, soil, weather: w }
        setInput(draftFrom(f, soil, w))
      })
      .catch((e) => setError(e?.message ?? 'Unable to load data. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const updateInput = useCallback((patch: Partial<FarmInputDraft>) => {
    setInput((prev) => ({ ...prev, ...patch }))
  }, [])

  const resetInput = useCallback(() => {
    const { farm: f, soil, weather: w } = latest.current
    setInput(draftFrom(f, soil, w))
  }, [])

  const value = useMemo(
    () => ({
      farm,
      mapData,
      soilData,
      weather,
      loading,
      error,
      input,
      updateInput,
      resetInput,
      reload: load,
    }),
    [farm, mapData, soilData, weather, loading, error, input, updateInput, resetInput, load],
  )

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>
}

export function useFarm() {
  const ctx = useContext(FarmContext)
  if (!ctx) throw new Error('useFarm must be used within FarmProvider')
  return ctx
}
