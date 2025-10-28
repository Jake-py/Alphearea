import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './style.css'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'
import Main from './Main.jsx'
import NeonTitle from './NeonTitle.jsx'
import English from './English.jsx'
import Korean from './Korean.jsx'
import Russian from './Russian.jsx'
import Philosophy from './Philosophy.jsx'
import Psychology from './Psychology.jsx'
import Settings from './Settings.jsx'
import About from './About.jsx'
import EnglishGrammar from './EnglishGrammar.jsx'
import EnglishCoursesBeginner from './EnglishCoursesBeginner.jsx'
import EnglishCoursesIntermediate from './EnglishCoursesIntermediate.jsx'
import EnglishCoursesAdvanced from './EnglishCoursesAdvanced.jsx'
import EnglishDictionaryBasic from './EnglishDictionaryBasic.jsx'
import EnglishDictionaryIdioms from './EnglishDictionaryIdioms.jsx'
import EnglishDictionaryPhrasalVerbs from './EnglishDictionaryPhrasalVerbs.jsx'
import EnglishDialogues from './EnglishDialogues.jsx'
import EnglishMaterials from './pages/EnglishMaterials.jsx'
import SmartMaterialViewer from './components/SmartMaterialViewer.jsx'
import KoreanGrammar from './KoreanGrammar.jsx'
import KoreanCourses from './KoreanCourses.jsx'
import KoreanDialogues from './KoreanDialogues.jsx'
import RussianGrammar from './RussianGrammar.jsx'
import RussianCourses from './RussianCourses.jsx'
import RussianDialogues from './RussianDialogues.jsx'
import PhilosophyWisdom from './PhilosophyWisdom.jsx'
import PhilosophyBooks from './PhilosophyBooks.jsx'
import PsychologyTheories from './PsychologyTheories.jsx'
import PsychologyPractices from './PsychologyPractices.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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
        <Header />
        <div className="content">
          <Sidebar />
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
      </div>
    </Router>
  )
}

export default App
