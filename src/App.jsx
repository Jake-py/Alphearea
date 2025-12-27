import { useState, useEffect } from 'react'
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
import EnglishGrammar from './pages/EnglishGrammar.jsx'
import EnglishCoursesBeginner from './pages/EnglishCoursesBeginner.jsx'
import EnglishCoursesIntermediate from './pages/EnglishCoursesIntermediate.jsx'
import EnglishCoursesAdvanced from './pages/EnglishCoursesAdvanced.jsx'
import EnglishDictionaryBasic from './pages/EnglishDictionaryBasic.jsx'
import EnglishDictionaryIdioms from './pages/EnglishDictionaryIdioms.jsx'
import EnglishDictionaryPhrasalVerbs from './pages/EnglishDictionaryPhrasalVerbs.jsx'
import EnglishDialogues from './pages/EnglishDialogues.jsx'
import EnglishMaterials from './pages/EnglishMaterials.jsx'
import SmartMaterialViewer from './components/SmartMaterialViewer.jsx'
import KoreanGrammar from './pages/KoreanGrammar.jsx'
import KoreanCourses from './pages/KoreanCourses.jsx'
import KoreanDialogues from './pages/KoreanDialogues.jsx'
import RussianGrammar from './pages/RussianGrammar.jsx'
import RussianCourses from './pages/RussianCourses.jsx'
import RussianDialogues from './pages/RussianDialogues.jsx'
import PhilosophyWisdom from './pages/PhilosophyWisdom.jsx'
import PhilosophyBooks from './pages/PhilosophyBooks.jsx'
import PsychologyTheories from './pages/PsychologyTheories.jsx'
import PsychologyPractices from './pages/PsychologyPractices.jsx'
import TestSettings from './pages/TestSettings.jsx'
import ChatPanel from './components/ChatPanel.jsx'
import Mathematics from './pages/Mathematics.jsx'
import MathematicsBasics from './pages/MathematicsBasics.jsx'
import Programming from './pages/Programming.jsx'
import Electronics from './pages/Electronics.jsx'

import AccountSettings from './pages/AccountSettings.jsx'
import PrivacySettings from './pages/PrivacySettings.jsx'
import SiteSettings from './pages/SiteSettings.jsx'
import TestTaking from './pages/TestTaking.jsx'
import TestCreator from './pages/TestCreator.jsx'
import SmartEditor from './pages/SmartEditor.jsx'
import Achievements from './pages/Achievements.jsx'
import EnglishGrammarTest from './pages/EnglishGrammarTest.jsx'
import KoreanGrammarTest from './pages/KoreanGrammarTest.jsx'
import RussianGrammarTest from './pages/RussianGrammarTest.jsx'
import PhilosophyWisdomTest from './pages/PhilosophyWisdomTest.jsx'
import PsychologyTheoriesTest from './pages/PsychologyTheoriesTest.jsx'
import { API_ENDPOINTS } from './config/api.js'
import { AuthProvider, useAuth } from './components/AuthManager'
import AuthModal from './components/AuthModal'



function App() { // Главный компонент приложения
  const [isChatOpen, setIsChatOpen] = useState(false) // Состояние открытия чата
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => { // Инициализация состояния боковой панели из localStorage
    const saved = localStorage.getItem('sidebarOpen') 
    return saved !== null ? JSON.parse(saved) : false
  }) // Инициализация состояния боковой панели из localStorage
  const [showAuthModal, setShowAuthModal] = useState(false)

  const { isAuthenticated, user, login, logout } = useAuth()
// Обработчики форм авторизации, регистрации и восстановления пароля


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
  const renderAuthModal = () => {
    return (
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    )
  }

  return (

      <AuthProvider>
        <div id="main-container">
          <Header
            onOpenChat={() => setIsChatOpen(true)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <Sidebar isOpen={isSidebarOpen} />
          <div className={`content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <main>
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
            </main>
          </div>
          <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          {renderAuthModal()}
        </div>
      </AuthProvider>
      
  )
}

export default App
