import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getRecommendations, predictSoilCarbon } from '../lib/api'
import type { FarmInput, PredictionResult, Recommendation } from '../lib/types'

interface PredictionValue {
  result: PredictionResult | null
  lastInput: FarmInput | null
  recommendations: Recommendation[]
  loading: boolean
  error: string | null
  run: (input: FarmInput) => Promise<PredictionResult | null>
  clear: () => void
}

const PredictionContext = createContext<PredictionValue | null>(null)

export function PredictionProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [lastInput, setLastInput] = useState<FarmInput | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  const run = useCallback(async (input: FarmInput) => {
    setLoading(true)
    setError(null)
    try {
      const res = await predictSoilCarbon(input)
      setResult(res)
      setLastInput(input)
      return res
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unable to load data. Please try again.'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setResult(null)
    setLastInput(null)
    setError(null)
    setRecommendations([])
  }, [])

  useEffect(() => {
    if (!result || !lastInput) {
      setRecommendations([])
      return
    }
    let cancelled = false
    getRecommendations(lastInput, result).then((recs) => {
      if (!cancelled) setRecommendations(recs)
    })
    return () => {
      cancelled = true
    }
  }, [result, lastInput])

  const value = useMemo(
    () => ({ result, lastInput, recommendations, loading, error, run, clear }),
    [result, lastInput, recommendations, loading, error, run, clear],
  )

  return <PredictionContext.Provider value={value}>{children}</PredictionContext.Provider>
}

export function usePrediction() {
  const ctx = useContext(PredictionContext)
  if (!ctx) throw new Error('usePrediction must be used within PredictionProvider')
  return ctx
}
