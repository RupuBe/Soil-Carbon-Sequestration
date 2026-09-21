import type { ReactNode } from 'react'
import { I18nProvider } from '../lib/i18n'
import { AuthProvider } from './AuthContext'
import { FarmProvider } from './FarmContext'
import { PredictionProvider } from './PredictionContext'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <FarmProvider>
          <PredictionProvider>{children}</PredictionProvider>
        </FarmProvider>
      </AuthProvider>
    </I18nProvider>
  )
}
