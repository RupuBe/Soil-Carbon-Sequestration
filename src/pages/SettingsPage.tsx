import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ChartCard } from '../components/ChartCard'
import { LANGUAGES, useI18n } from '../lib/i18n'
import { useAuth } from '../context/AuthContext'
import { useFarm } from '../context/FarmContext'

function Toggle({ label, defaultOn = true }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <label className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm text-ink">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((v) => !v)}
        className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-forest-600' : 'bg-forest-100'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            on ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  )
}

export function SettingsPage() {
  const { lang, setLang } = useI18n()
  const { userName, userEmail, logout } = useAuth()
  const { farm } = useFarm()
  const navigate = useNavigate()
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric')

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your profile, preferences and notifications." />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Profile">
          <div className="space-y-4">
            <Field label="Name" value={userName || '—'} />
            <Field label="Email" value={userEmail || '—'} />
            <Field label="Farm" value={farm ? `${farm.name} · ${farm.village}, ${farm.district}` : '—'} />
            <button className="btn-secondary" onClick={() => navigate('/app/profile')}>
              View full profile
            </button>
          </div>
        </ChartCard>

        <ChartCard title="Preferences">
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="lang">
                Language
              </label>
              <select
                id="lang"
                className="input bg-canvas"
                value={lang}
                onChange={(e) => setLang(e.target.value as typeof lang)}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.native} — {l.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="units">
                Units
              </label>
              <select
                id="units"
                className="input bg-canvas"
                value={units}
                onChange={(e) => setUnits(e.target.value as 'metric' | 'imperial')}
              >
                <option value="metric">Metric (°C, mm, ha)</option>
                <option value="imperial">Imperial (°F, in, acre)</option>
              </select>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Notifications">
          <div className="divide-y divide-forest-50">
            <Toggle label="Prediction updates" />
            <Toggle label="Recommendation notifications" />
            <Toggle label="Seasonal soil reminders" defaultOn={false} />
          </div>
        </ChartCard>

        <ChartCard title="Account">
          <div className="space-y-4">
            <button className="btn-secondary w-full sm:w-auto">Change password</button>
            <div>
              <button
                className="btn w-full bg-ember-light text-ember-dark hover:bg-ember/20 sm:w-auto"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              >
                <LogOut className="h-4 w-4" aria-hidden /> Logout
              </button>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label mb-0.5">{label}</p>
      <p className="rounded-xl bg-canvas px-4 py-2.5 text-sm text-ink">{value}</p>
    </div>
  )
}
