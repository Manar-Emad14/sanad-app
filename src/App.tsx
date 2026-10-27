import { AppProvider, useApp } from './context/AppContext'
import { Header } from './components/Header'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { PrayerModeBanner } from './components/PrayerModeBanner'
import { AnnouncementBanner } from './components/AnnouncementBanner'
import { AdminLockModal } from './components/AdminLockModal'
import { NotificationToast } from './components/NotificationToast'
import { SanadWisdomTicker } from './components/SanadWisdomTicker'
import { NotificationSettingsModal } from './components/NotificationSettingsModal'
import { NotificationPermissionBanner } from './components/NotificationPermissionBanner'
import { FocusAudioBar } from './components/FocusAudioBar'
import { DevSpiritualToolsModal } from './components/DevSpiritualToolsModal'
import { DeveloperSuggestionModal } from './components/DeveloperSuggestionModal'
import { UserProfileModal } from './components/UserProfileModal'
import { SmartInstallBanner } from './components/SmartInstallBanner'

import { DashboardView } from './views/DashboardView'
import { QuranView } from './views/QuranView'
import { PrayerScheduleView } from './views/PrayerScheduleView'
import { SpiritualPomodoroView } from './views/SpiritualPomodoroView'
import { ChallengesView } from './views/ChallengesView'
import { AchievementsView } from './views/AchievementsView'
import { AdminPanelView } from './views/AdminPanelView'

function MainContent() {
  const {
    activeTab,
    isNotificationModalOpen,
    setIsNotificationModalOpen,
    isSpiritualToolsModalOpen,
    setIsSpiritualToolsModalOpen,
    isSuggestionModalOpen,
    setIsSuggestionModalOpen,
  } = useApp()

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />
      case 'quran':
        return <QuranView />
      case 'prayer-schedule':
        return <PrayerScheduleView />
      case 'pomodoro':
        return <SpiritualPomodoroView />
      case 'challenges':
        return <ChallengesView />
      case 'achievements':
        return <AchievementsView />
      case 'admin':
        return <AdminPanelView />
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Smart PWA Install Floating Banner */}
      <SmartInstallBanner />

      {/* 10-Minute Sanad Wisdom & Dev Ticker */}
      <SanadWisdomTicker />

      {/* Floating In-App Notification Toast */}
      <NotificationToast />

      {/* Top Header */}
      <Header />

      {/* Navigation (Desktop horizontal bar & Mobile bottom bar) */}
      <Navigation />

      {/* Main Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <NotificationPermissionBanner />
        <PrayerModeBanner />
        <AnnouncementBanner />
        {renderActiveTab()}
      </main>

      {/* Password Lock Modal for Admin Panel */}
      <AdminLockModal />

      {/* Notification Settings Hub Modal */}
      <NotificationSettingsModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      {/* Focus Audio Streamer (Quran Radio / Mishary / Rain Ambient) */}
      <FocusAudioBar />

      {/* Developer Spiritual Tools Modal (Digital Tasbih & Duaa) */}
      <DevSpiritualToolsModal
        isOpen={isSpiritualToolsModalOpen}
        onClose={() => setIsSpiritualToolsModalOpen(false)}
      />

      {/* Developer Suggestion Modal */}
      <DeveloperSuggestionModal
        isOpen={isSuggestionModalOpen}
        onClose={() => setIsSuggestionModalOpen(false)}
      />

      {/* User Profile & Personalization Modal */}
      <UserProfileModal />

      {/* Footer Branding & Attribution */}
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  )
}
