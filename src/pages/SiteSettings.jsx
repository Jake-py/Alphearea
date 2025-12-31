import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/settings.css';

function SiteSettings() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('i18nextLng', newLanguage);
  };

  return (
    <main>
      <div className="site-settings">
        <h2>{t('siteSettings.title')}</h2>
        <p className="page-description">{t('settings.language')}</p>

        <div className="form-section">
          <h3>{t('siteSettings.language')}</h3>
          <div className="form-group">
            <label htmlFor="language">{t('siteSettings.selectLanguage')}</label>
            <select
              id="language"
              name="language"
              value={language}
              onChange={handleLanguageChange}
              className="form-select"
            >
              <option value="ru">Русский</option>
            </select>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SiteSettings;
