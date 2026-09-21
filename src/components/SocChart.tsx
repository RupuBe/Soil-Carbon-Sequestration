import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Info, LineChart as LineChartIcon } from 'lucide-react'
import type { SocSeriesPoint } from '../lib/types'

const COLORS: Record<SocSeriesPoint['kind'], string> = {
  predicted: '#1E4D3A',
  measured: '#2E6A4C',
  seasonal: '#6FA8DC',
  regional: '#C7B38C',
}

const LABELS: Record<SocSeriesPoint['kind'], string> = {
  predicted: 'Predicted (your farm)',
  measured: 'Measured',
  seasonal: 'Seasonal',
  regional: 'Regional reference',
}

interface Props {
  points: SocSeriesPoint[]
  hasHistory: boolean
}

export function SocChart({ points, hasHistory }: Props) {
  if (!points.length) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-forest-100 bg-canvas/60 text-center">
        <LineChartIcon className="h-6 w-6 text-forest-300" aria-hidden />
        <p className="text-sm font-medium text-ink">No data available yet</p>
        <p className="max-w-xs text-xs text-ink-soft">
          Data will appear once your farm data is connected.
        </p>
      </div>
    )
  }

  return (
    <div>
      {!hasHistory && (
        <p className="mb-4 flex items-start gap-2 rounded-lg bg-canvas p-3 text-xs text-ink-soft">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-400" aria-hidden />
          Historical data will appear here after sufficient observations are collected.
        </p>
      )}
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <BarChart data={points} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4EDE7" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: '#5B6660' }}
              tickLine={false}
              axisLine={{ stroke: '#E4EDE7' }}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#5B6660' }}
              tickLine={false}
              axisLine={false}
              width={44}
              label={{
                value: 'SOC (g/kg)',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 11, fill: '#8A938D' },
              }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(30,77,58,0.05)' }}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #D6E6DD',
                fontSize: 12,
                boxShadow: '0 8px 24px rgba(30,77,58,0.12)',
              }}
              formatter={(v: number) => [`${v.toFixed(1)} g/kg  ·  ${(v / 10).toFixed(2)}%`, 'SOC']}
            />
            <Bar dataKey="soc" radius={[6, 6, 0, 0]} maxBarSize={64}>
              {points.map((p, i) => (
                <Cell key={i} fill={COLORS[p.kind]} />
              ))}
              <LabelList
                dataKey="soc"
                position="top"
                formatter={(v: number) => v.toFixed(1)}
                style={{ fontSize: 11, fill: '#5B6660' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
        {[...new Set(points.map((p) => p.kind))].map((kind) => (
          <li key={kind} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[kind] }} />
            {LABELS[kind]}
          </li>
        ))}
      </ul>
    </div>
  )
}
