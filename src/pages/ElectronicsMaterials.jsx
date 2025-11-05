import React, { useEffect, useState } from "react";

function ElectronicsMaterials() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/src/data/materials/materials.json")
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
    { key: 'circuits', title: 'Электрические цепи', desc: 'Основы теории цепей и законы Ома' },
    { key: 'components', title: 'Электронные компоненты', desc: 'Резисторы, конденсаторы, транзисторы' },
    { key: 'digital', title: 'Цифровая электроника', desc: 'Логические элементы, микроконтроллеры' },
    { key: 'sensors', title: 'Датчики и измерения', desc: 'Типы датчиков, обработка сигналов' },
  ];

  return (
    <main>
      <h2>Электроника — Материалы</h2>
      <div className="subject-blocks">
        {sections.map((section) => {
          const sectionData = data.electronics?.[section.key];
          let files = [];
          if (sectionData && sectionData.files) {
            files = sectionData.files;
          }
          return (
            <div key={section.key} className="subject-block">
              <h3>{section.title}</h3>
              <p>{section.desc}</p>
              {renderFiles(files)}
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default ElectronicsMaterials;
