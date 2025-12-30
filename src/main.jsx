import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from "./App.jsx";
import AuthProvider from "./components/AuthManager";
import "./styles/style.css";
import { heavyAnimationsEnabled } from './config/animations';

// По умолчанию отключаем тяжёлые анимации. Включить можно через localStorage.setItem('enableHeavyAnimations','1')
try {
  const enabled = heavyAnimationsEnabled();
  if (enabled) {
    document.documentElement.classList.add('enable-heavy-animations');
  } else {
    document.documentElement.classList.remove('enable-heavy-animations');
  }
} catch (e) {}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
