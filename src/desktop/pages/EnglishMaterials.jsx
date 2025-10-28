import React, { useEffect, useState } from "react";

function EnglishMaterials() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/materials/materials.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Загрузка...</p>;

  const renderFiles = (files) => {
    if (!files || files.length === 0) return <p>Файлы не найдены.</p>;
    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {files.map((file, i) => (
          <li key={i} style={{ marginBottom: '8px' }}>
            <a
              href={`/${file.path}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#4ecdc4', textDecoration: 'none' }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              📄 {file.name}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  const sections = [
    { key: 'grammar', title: 'Грамматика', desc: 'Изучите правила английской грамматики' },
    { key: 'dictionary', title: 'Словарь', desc: 'Расширьте свой словарный запас' },
    { key: 'dialogues', title: 'Диалоги', desc: 'Практика разговорного английского' },
    { key: 'courses', title: 'Курсы', desc: 'Структурированное обучение' },
  ];

  return (
    <main>
      <h2>Английский язык — Материалы</h2>
      <div className="subject-blocks">
        {sections.map((section) => {
          const sectionData = data.english[section.key];
          let files = [];
          if (sectionData && sectionData.files) {
            files = sectionData.files;
          } else if (section.key === 'courses' && sectionData) {
            // For courses, collect files from subdirectories
            Object.values(sectionData).forEach(sub => {
              if (sub.files) files = files.concat(sub.files);
            });
          }

          return (
            <div key={section.key} className="block">
              <h3>{section.title}</h3>
              <p>{section.desc}</p>
              {renderFiles(files)}
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={async () => {
            try {
              const response = await fetch('/materials/materials.json', { cache: 'no-cache' });
              if (response.ok) {
                window.location.reload();
              } else {
                alert('Не удалось обновить материалы. Попробуйте запустить npm run scan.');
              }
            } catch (error) {
              alert('Ошибка при обновлении. Запустите npm run scan вручную.');
            }
          }}
          style={{
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Обновить список файлов
        </button>
      </div>
    </main>
  );
}

export default EnglishMaterials;
