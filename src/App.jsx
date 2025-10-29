import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import ChatPanel from './components/ChatPanel.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)



  const handleLogin = (e) => {
    e.preventDefault()
    if (username === 'red_ice' && password === 'password') {
      setIsLoggedIn(true)
    } else {
      setError('Invalid credentials')
    }
  }

  if (!isLoggedIn) {
    return (
      <div id="login-container">
        <NeonTitle tag="h2" />
        <form id="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p id="error-message" style={{ color: 'red', display: error ? 'block' : 'none' }}>
          {error}
        </p>
      </div>
    )
  }

  return (
    <Router>
      <div id="main-container">
        <Header onOpenChat={() => setIsChatOpen(true)} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="content">
          <Sidebar isOpen={isSidebarOpen} />
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
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
        <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </Router>
  )
}

export default App
