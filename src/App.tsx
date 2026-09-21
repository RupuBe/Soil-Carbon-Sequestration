import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { MyFarm } from './pages/MyFarm'
import { PredictCarbon } from './pages/PredictCarbon'
import { PredictionAnalysis } from './pages/PredictionAnalysis'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { MapsInsights } from './pages/MapsInsights'
import { Learn } from './pages/Learn'
import { LearnArticlePage } from './pages/LearnArticlePage'
import { SettingsPage } from './pages/SettingsPage'
import { Profile } from './pages/Profile'
import { ResearchView } from './pages/ResearchView'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login mode="login" />} />
      <Route path="/create-account" element={<Login mode="create" />} />

      <Route path="/app" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="my-farm" element={<MyFarm />} />
        <Route path="predict" element={<PredictCarbon />} />
        <Route path="analysis" element={<PredictionAnalysis />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="maps" element={<MapsInsights />} />
        <Route path="learn" element={<Learn />} />
        <Route path="learn/:slug" element={<LearnArticlePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="research" element={<ResearchView />} />
      </Route>

      <Route path="/dashboard" element={<Navigate to="/app" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
