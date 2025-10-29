import React, { useEffect, useState } from "react";

function SmartMaterialViewer({ subject }) {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetch("/src/data/materials/materials.json")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((m) => m.path.includes(`/materials/${subject}/`));
        setMaterials(filtered);
      })
      .catch((err) => console.error("Ошибка загрузки материалов:", err));
  }, [subject]);

  return (
    <main className="p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4 capitalize">Материалы — {subject}</h1>

      {materials.length === 0 ? (
        <p>Материалы не найдены.</p>
      ) : (
        materials.map((file, i) => (
          <div key={i} className="mb-6 border p-4 rounded-lg shadow-sm bg-white">
            <h2 className="font-semibold text-lg mb-2">{file.name}</h2>

            {/\.(jpg|jpeg|png|gif)$/i.test(file.extension) ? (
              <img
                src={`/${file.path}`}
                alt={file.name}
                className="max-w-full rounded-lg border"
              />
            ) : (
              <pre className="bg-gray-50 p-3 rounded-lg overflow-auto text-sm whitespace-pre-wrap">
                {file.content}
              </pre>
            )}

            <a
              href={`/${file.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Открыть оригинал
            </a>
          </div>
        ))
      )}
    </main>
  );
}

export default SmartMaterialViewer;
