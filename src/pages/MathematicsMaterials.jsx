import React, { useEffect, useState } from "react";

function MathematicsMaterials() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/src/data/materials/materials.json", {
      credentials: 'include',
    })
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
    { key: 'algebra', title: 'Алгебра', desc: 'Основы алгебры и уравнения' },
    { key: 'geometry', title: 'Геометрия', desc: 'Планиметрия и стереометрия' },
    { key: 'calculus', title: 'Математический анализ', desc: 'Дифференциальное и интегральное исчисление' },
    { key: 'statistics', title: 'Статистика', desc: 'Теория вероятностей и статистика' },
  ];

  return (
    <main>
      <h2>Математика — Материалы</h2>
      <div className="subject-blocks">
        {sections.map((section) => {
          const sectionData = data.mathematics?.[section.key];
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

export default MathematicsMaterials;
