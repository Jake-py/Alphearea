import { useState, useEffect, useCallback, Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './styles/style.css'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Main from './pages/Main.jsx'
import NeonTitle from './components/NeonTitle.jsx'
import English from './pages/English.jsx'
import Korean from './pages/Korean.jsx'
import Russian from './pages/Russian.jsx'
import Philosophy from './pages/Philosophy.jsx'
import Psychology from './pages/Psychology.jsx'
import Settings from './pages/Settings.jsx'
import About from './pages/About.jsx'
// Ленивая загрузка тяжелых компонентов (code splitting)
const EnglishGrammar = lazy(() => import('./pages/EnglishGrammar.jsx'))
const EnglishCoursesBeginner = lazy(() => import('./pages/EnglishCoursesBeginner.jsx'))
const EnglishCoursesIntermediate = lazy(() => import('./pages/EnglishCoursesIntermediate.jsx'))
const EnglishCoursesAdvanced = lazy(() => import('./pages/EnglishCoursesAdvanced.jsx'))
const EnglishDictionaryBasic = lazy(() => import('./pages/EnglishDictionaryBasic.jsx'))
const EnglishDictionaryIdioms = lazy(() => import('./pages/EnglishDictionaryIdioms.jsx'))
const EnglishDictionaryPhrasalVerbs = lazy(() => import('./pages/EnglishDictionaryPhrasalVerbs.jsx'))
const EnglishDialogues = lazy(() => import('./pages/EnglishDialogues.jsx'))
const EnglishMaterials = lazy(() => import('./pages/EnglishMaterials.jsx'))
const EnglishGrammarTest = lazy(() => import('./pages/EnglishGrammarTest.jsx'))
const KoreanGrammar = lazy(() => import('./pages/KoreanGrammar.jsx'))
const KoreanCourses = lazy(() => import('./pages/KoreanCourses.jsx'))
const KoreanDialogues = lazy(() => import('./pages/KoreanDialogues.jsx'))
const KoreanGrammarTest = lazy(() => import('./pages/KoreanGrammarTest.jsx'))
const RussianGrammar = lazy(() => import('./pages/RussianGrammar.jsx'))
const RussianCourses = lazy(() => import('./pages/RussianCourses.jsx'))
const RussianDialogues = lazy(() => import('./pages/RussianDialogues.jsx'))
const PhilosophyWisdom = lazy(() => import('./pages/PhilosophyWisdom.jsx'))
const PhilosophyBooks = lazy(() => import('./pages/PhilosophyBooks.jsx'))
const PsychologyTheories = lazy(() => import('./pages/PsychologyTheories.jsx'))
const PsychologyPractices = lazy(() => import('./pages/PsychologyPractices.jsx'))
const TestSettings = lazy(() => import('./pages/TestSettings.jsx'))
const TestTaking = lazy(() => import('./pages/TestTaking.jsx'))
const TestCreator = lazy(() => import('./pages/TestCreator.jsx'))
const SmartEditor = lazy(() => import('./pages/SmartEditor.jsx'))
const Achievements = lazy(() => import('./pages/Achievements.jsx'))
const AccountSettings = lazy(() => import('./pages/AccountSettings.jsx'))
const PrivacySettings = lazy(() => import('./pages/PrivacySettings.jsx'))
const SiteSettings = lazy(() => import('./pages/SiteSettings.jsx'))
const MathematicsBasics = lazy(() => import('./pages/MathematicsBasics.jsx'))
const Programming = lazy(() => import('./pages/Programming.jsx'))
const Electronics = lazy(() => import('./pages/Electronics.jsx'))
const PhilosophyWisdomTest = lazy(() => import('./pages/PhilosophyWisdomTest.jsx'))
const PsychologyTheoriesTest = lazy(() => import('./pages/PsychologyTheoriesTest.jsx'))
const RussianGrammarTest = lazy(() => import('./pages/RussianGrammarTest.jsx'))
// Быстрые компоненты (не ленивые)
import SmartMaterialViewer from './components/SmartMaterialViewer.jsx'
import ChatPanel from './components/ChatPanel.jsx'
import Mathematics from './pages/Mathematics.jsx'
import { API_ENDPOINTS } from './config/api.js'
import { AuthProvider, useAuth } from './components/AuthManager'
import AuthModal from './components/AuthModal'

// Fallback компонент для ленивой загрузки
const LoadingFallback = () => <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Загрузка...</div>



function App() { // Главный компонент приложения
  const [isChatOpen, setIsChatOpen] = useState(false) // Состояние открытия чата
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => { // Инициализация состояния боковой панели из localStorage
    const saved = localStorage.getItem('sidebarOpen') 
    return saved !== null ? JSON.parse(saved) : false
  }) // Инициализация состояния боковой панели из localStorage
  const [showAuthModal, setShowAuthModal] = useState(false)

  const { isAuthenticated, user, login, logout } = useAuth()

  // Оптимизация: используем useCallback для предотвращения ненужных ре-рендеров
  const handleOpenChat = useCallback(() => {
    setIsChatOpen(true)
  }, [])

  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false)
  }, [])

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev)
  }, [])

  // Обработчик открытия модального окна авторизации
  useEffect(() => {
    const handleOpenAuthModal = () => {
      setShowAuthModal(true)
    }
    
    window.addEventListener('openAuthModal', handleOpenAuthModal)
    
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen))
  }, [isSidebarOpen])

  // Новое модальное окно авторизации
  const renderAuthModal = useCallback(() => {
    return (
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    )
  }, [showAuthModal])

  return (

      <AuthProvider>
        <div id="main-container">
          <Header
            onOpenChat={handleOpenChat}
            onToggleSidebar={handleToggleSidebar}
          />
          <Sidebar isOpen={isSidebarOpen} />
          <div className={`content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <main>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/english" element={<English />} />
                <Route path="/english/grammar" element={<EnglishGrammar />} />
                <Route path="/english/courses/beginner" element={<EnglishCoursesBeginner />} />
                <Route path="/english/courses/intermediate" element={<EnglishCoursesIntermediate />} />
                <Route path="/english/courses/advanced" element={<EnglishCoursesAdvanced />} />
                <Route path="/english/dictionary/basic" element={<EnglishDictionaryBasic />} />
                <Route path="/english/dictionary/idioms" element={<EnglishDictionaryIdioms />} />
                <Route path="/english/dictionary/phrasal-verbs" element={<EnglishDictionaryPhrasalVerbs />} />
                <Route path="/english/dialogues" element={<EnglishDialogues />} />
                <Route path="/english/materials" element={<EnglishMaterials />} />
                <Route path="/korean" element={<Korean />} />
                <Route path="/korean/grammar" element={<KoreanGrammar />} />
                <Route path="/korean/courses" element={<KoreanCourses />} />
                <Route path="/korean/dialogues" element={<KoreanDialogues />} />
                <Route path="/russian" element={<Russian />} />
              <Route path="/russian/grammar" element={<RussianGrammar />} />
              <Route path="/russian/courses" element={<RussianCourses />} />
              <Route path="/russian/dialogues" element={<RussianDialogues />} />
              <Route path="/philosophy" element={<Philosophy />} />
              <Route path="/philosophy/wisdom" element={<PhilosophyWisdom />} />
              <Route path="/philosophy/books" element={<PhilosophyBooks />} />
              <Route path="/psychology" element={<Psychology />} />
              <Route path="/psychology/theories" element={<PsychologyTheories />} />
              <Route path="/psychology/practices" element={<PsychologyPractices />} />
              <Route path="/mathematics" element={<Mathematics />} />
              <Route path="/mathematics/basics" element={<MathematicsBasics />} />
              <Route path="/programming" element={<Programming />} />
              <Route path="/electronics" element={<Electronics />} />
              <Route path="/test-settings" element={<TestSettings />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/account" element={<AccountSettings />} />
              <Route path="/settings/privacy" element={<PrivacySettings />} />
              <Route path="/settings/site" element={<SiteSettings />} />
              <Route path="/about" element={<About />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/english/grammar/test" element={<EnglishGrammarTest />} />
              <Route path="/korean/grammar/test" element={<KoreanGrammarTest />} />
              <Route path="/russian/grammar/test" element={<RussianGrammarTest />} />
              <Route path="/philosophy/wisdom/test" element={<PhilosophyWisdomTest />} />
              <Route path="/psychology/theories/test" element={<PsychologyTheoriesTest />} />
              <Route path="/test-taking" element={<TestTaking />} />
              <Route path="/test-creator" element={<TestCreator />} />
              <Route path="/smart-editor" element={<SmartEditor />} />
            </Routes>
              </Suspense>
            </main>
          </div>
          <ChatPanel isOpen={isChatOpen} onClose={handleCloseChat} />
          {renderAuthModal()}
        </div>
      </AuthProvider>
      
  )
}

export default App
