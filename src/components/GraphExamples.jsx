import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function GraphExamples() {
  const [expandedSection, setExpandedSection] = useState('planar');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const SectionHeader = ({ title, section }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between bg-blue-600 text-white p-4 rounded-lg mb-4 hover:bg-blue-700 transition"
    >
      <h2 className="text-xl font-bold">{title}</h2>
      {expandedSection === section ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
    </button>
  );

  const colors = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#22c55e',
    yellow: '#eab308',
    purple: '#a855f7',
    orange: '#f97316',
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Примеры: Графы, Раскраска, Хроматическое число</h1>

      {/* ПЛАНАРНЫЕ ГРАФЫ */}
      <SectionHeader title="1. Планарные графы" section="planar" />
      {expandedSection === 'planar' && (
        <div className="bg-white p-6 rounded-lg mb-6">
          <p className="mb-4 text-gray-700">Граф можно изобразить на плоскости без пересечения рёбер (кроме вершин).</p>

          {/* Домик */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Пример 1: Домик (планарный граф)</h4>
            <svg width="100%" height="280" viewBox="0 0 400 280" className="border border-gray-300 rounded bg-white">
              <line x1="80" y1="80" x2="320" y2="80" stroke="black" strokeWidth="2" />
              <line x1="320" y1="80" x2="320" y2="200" stroke="black" strokeWidth="2" />
              <line x1="320" y1="200" x2="80" y2="200" stroke="black" strokeWidth="2" />
              <line x1="80" y1="200" x2="80" y2="80" stroke="black" strokeWidth="2" />
              <line x1="80" y1="80" x2="320" y2="200" stroke="black" strokeWidth="2" />
              <line x1="320" y1="80" x2="80" y2="200" stroke="black" strokeWidth="2" />
              <line x1="200" y1="20" x2="80" y2="80" stroke="black" strokeWidth="2" />
              <line x1="200" y1="20" x2="320" y2="80" stroke="black" strokeWidth="2" />

              <circle cx="80" cy="80" r="6" fill={colors.red} />
              <circle cx="320" cy="80" r="6" fill={colors.blue} />
              <circle cx="320" cy="200" r="6" fill={colors.green} />
              <circle cx="80" cy="200" r="6" fill={colors.yellow} />
              <circle cx="200" cy="20" r="6" fill={colors.purple} />
              <text x="200" y="260" textAnchor="middle" fontSize="12" fill="gray">5 вершин, 8 рёбер - планарен</text>
            </svg>
          </div>

          {/* K5 */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Пример 2: Граф K₅ (НЕ планарный)</h4>
            <svg width="100%" height="280" viewBox="0 0 400 280" className="border border-gray-300 rounded bg-white">
              <circle cx="200" cy="100" r="80" fill="none" stroke="lightgray" strokeWidth="1" strokeDasharray="5,5" />

              {[0, 1, 2, 3, 4].map((i) => {
                const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                const x = 200 + 80 * Math.cos(angle);
                const y = 100 + 80 * Math.sin(angle);
                return <circle key={i} cx={x} cy={y} r="6" fill={colors.red} />;
              })}

              {[0, 1, 2, 3, 4].map((i) =>
                [i + 1, i + 2, i + 3, i + 4].map((j) => {
                  const j_mod = j % 5;
                  if (i >= j_mod) return null;
                  const angle1 = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                  const angle2 = (j_mod * 2 * Math.PI) / 5 - Math.PI / 2;
                  const x1 = 200 + 80 * Math.cos(angle1);
                  const y1 = 100 + 80 * Math.sin(angle1);
                  const x2 = 200 + 80 * Math.cos(angle2);
                  const y2 = 100 + 80 * Math.sin(angle2);
                  return (
                    <line key={`${i}-${j_mod}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="red" strokeWidth="1" opacity="0.6" />
                  );
                })
              )}

              <text x="200" y="260" textAnchor="middle" fontSize="12" fill="red" fontWeight="bold">
                5 вершин, 10 рёбер - НЕ планарен (рёбра пересекаются!)
              </text>
            </svg>
          </div>

          {/* Карта */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Пример 3: Карта и её граф (планарный)</h4>
            <svg width="100%" height="280" viewBox="0 0 400 280" className="border border-gray-300 rounded bg-white">
              <rect x="50" y="60" width="100" height="80" fill={colors.red} opacity="0.3" stroke="black" strokeWidth="2" />
              <rect x="160" y="60" width="100" height="80" fill={colors.blue} opacity="0.3" stroke="black" strokeWidth="2" />
              <polygon points="50,150 160,150 160,200 50,200" fill={colors.green} opacity="0.3" stroke="black" strokeWidth="2" />
              <polygon points="160,150 270,150 270,200 160,200" fill={colors.yellow} opacity="0.3" stroke="black" strokeWidth="2" />

              <circle cx="100" cy="100" r="4" fill="black" />
              <circle cx="210" cy="100" r="4" fill="black" />
              <circle cx="105" cy="175" r="4" fill="black" />
              <circle cx="215" cy="175" r="4" fill="black" />

              <line x1="100" y1="100" x2="210" y2="100" stroke="black" strokeWidth="2" />
              <line x1="100" y1="100" x2="105" y2="175" stroke="black" strokeWidth="2" />
              <line x1="210" y1="100" x2="215" y2="175" stroke="black" strokeWidth="2" />
              <line x1="105" y1="175" x2="215" y2="175" stroke="black" strokeWidth="2" />
              <line x1="100" y1="100" x2="215" y2="175" stroke="black" strokeWidth="1" opacity="0.5" strokeDasharray="3,3" />

              <text x="200" y="260" textAnchor="middle" fontSize="12" fill="gray">
                Граф соседства регионов карты
              </text>
            </svg>
          </div>
        </div>
      )}

      {/* РАСКРАСКА ГРАФОВ */}
      <SectionHeader title="2. Раскраска графов" section="coloring" />
      {expandedSection === 'coloring' && (
        <div className="bg-white p-6 rounded-lg mb-6">
          <p className="mb-4 text-gray-700">Соседние вершины должны иметь разные цвета.</p>

          {/* Пятиугольник */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Пример 1: Граф - цикл из 5 вершин (χ = 3)</h4>
            <svg width="100%" height="280" viewBox="0 0 400 280" className="border border-gray-300 rounded bg-white">
              {[0, 1, 2, 3, 4].map((i) => {
                const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                const x = 200 + 70 * Math.cos(angle);
                const y = 150 + 70 * Math.sin(angle);
                const nextAngle = ((i + 1) * 2 * Math.PI) / 5 - Math.PI / 2;
                const nextX = 200 + 70 * Math.cos(nextAngle);
                const nextY = 150 + 70 * Math.sin(nextAngle);

                const colorList = [colors.red, colors.blue, colors.green, colors.red, colors.blue];

                return (
                  <g key={i}>
                    <line x1={x} y1={y} x2={nextX} y2={nextY} stroke="black" strokeWidth="2" />
                    <circle cx={x} cy={y} r="12" fill={colorList[i]} stroke="black" strokeWidth="2" />
                    <text x={x} y={y + 5} textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                      {i + 1}
                    </text>
                  </g>
                );
              })}
              <text x="200" y="260" textAnchor="middle" fontSize="12" fill="gray">
                Красный, синий, зелёный, красный, синий - все условия выполнены
              </text>
            </svg>
          </div>

          {/* K4 */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Пример 2: Полный граф K₄ (χ = 4)</h4>
            <svg width="100%" height="280" viewBox="0 0 400 280" className="border border-gray-300 rounded bg-white">
              {(() => {
                const vertices = [
                  {x: 100, y: 80, color: colors.red, label: 'V1'},
                  {x: 300, y: 80, color: colors.blue, label: 'V2'},
                  {x: 300, y: 200, color: colors.green, label: 'V3'},
                  {x: 100, y: 200, color: colors.yellow, label: 'V4'}
                ];

                const edges = [];
                for (let i = 0; i < vertices.length; i++) {
                  for (let j = i + 1; j < vertices.length; j++) {
                    edges.push([vertices[i], vertices[j]]);
                  }
                }

                return (
                  <>
                    {edges.map((edge, idx) => (
                      <line key={`edge-${idx}`} x1={edge[0].x} y1={edge[0].y} x2={edge[1].x} y2={edge[1].y} stroke="gray" strokeWidth="1" opacity="0.5" />
                    ))}
                    {vertices.map((v, i) => (
                      <g key={i}>
                        <circle cx={v.x} cy={v.y} r="14" fill={v.color} stroke="black" strokeWidth="2" />
                        <text x={v.x} y={v.y + 5} textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">
                          {v.label}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
              <text x="200" y="260" textAnchor="middle" fontSize="12" fill="gray">
                Каждая вершина соединена со всеми - нужны 4 разных цвета
              </text>
            </svg>
          </div>

          {/* Регионы */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Пример 3: Граф соседства стран (χ = 3)</h4>
            <svg width="100%" height="280" viewBox="0 0 400 280" className="border border-gray-300 rounded bg-white">
              <circle cx="100" cy="100" r="40" fill={colors.red} opacity="0.3" stroke="black" strokeWidth="2" />
              <circle cx="180" cy="100" r="40" fill={colors.blue} opacity="0.3" stroke="black" strokeWidth="2" />
              <circle cx="260" cy="100" r="40" fill={colors.green} opacity="0.3" stroke="black" strokeWidth="2" />
              <circle cx="140" cy="180" r="40" fill={colors.red} opacity="0.3" stroke="black" strokeWidth="2" />
              <circle cx="220" cy="180" r="40" fill={colors.blue} opacity="0.3" stroke="black" strokeWidth="2" />

              <line x1="100" y1="100" x2="180" y2="100" stroke="black" strokeWidth="1" opacity="0.3" />
              <line x1="180" y1="100" x2="260" y2="100" stroke="black" strokeWidth="1" opacity="0.3" />
              <line x1="100" y1="100" x2="140" y2="180" stroke="black" strokeWidth="1" opacity="0.3" />
              <line x1="180" y1="100" x2="140" y2="180" stroke="black" strokeWidth="1" opacity="0.3" />
              <line x1="180" y1="100" x2="220" y2="180" stroke="black" strokeWidth="1" opacity="0.3" />
              <line x1="260" y1="100" x2="220" y2="180" stroke="black" strokeWidth="1" opacity="0.3" />

              <text x="200" y="260" textAnchor="middle" fontSize="12" fill="gray">
                5 регионов, 3 цвета достаточно (красный, синий, зелёный)
              </text>
            </svg>
          </div>
        </div>
      )}

      {/* ХРОМАТИЧЕСКОЕ ЧИСЛО И КЛАССЫ */}
      <SectionHeader title="3. Хроматическое число (χ) и классы графов" section="chromatic" />
      {expandedSection === 'chromatic' && (
        <div className="bg-white p-6 rounded-lg mb-6">
          <p className="mb-4 text-gray-700">Минимальное количество цветов для раскраски вершин.</p>

          {/* Дерево */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Пример 1: Дерево (χ = 2)</h4>
            <svg width="100%" height="280" viewBox="0 0 400 280" className="border border-gray-300 rounded bg-white">
              <line x1="200" y1="40" x2="100" y2="100" stroke="black" strokeWidth="2" />
              <line x1="200" y1="40" x2="300" y2="100" stroke="black" strokeWidth="2" />
              <line x1="100" y1="100" x2="50" y2="160" stroke="black" strokeWidth="2" />
              <line x1="100" y1="100" x2="150" y2="160" stroke="black" strokeWidth="2" />
              <line x1="300" y1="100" x2="250" y2="160" stroke="black" strokeWidth="2" />
              <line x1="300" y1="100" x2="350" y2="160" stroke="black" strokeWidth="2" />

              <circle cx="200" cy="40" r="10" fill={colors.red} stroke="black" strokeWidth="2" />
              <circle cx="100" cy="100" r="10" fill={colors.blue} stroke="black" strokeWidth="2" />
              <circle cx="300" cy="100" r="10" fill={colors.blue} stroke="black" strokeWidth="2" />
              <circle cx="50" cy="160" r="10" fill={colors.red} stroke="black" strokeWidth="2" />
              <circle cx="150" cy="160" r="10" fill={colors.red} stroke="black" strokeWidth="2" />
              <circle cx="250" cy="160" r="10" fill={colors.red} stroke="black" strokeWidth="2" />
              <circle cx="350" cy="160" r="10" fill={colors.red} stroke="black" strokeWidth="2" />

              <text x="200" y="260" textAnchor="middle" fontSize="12" fill="gray">
                Деревья всегда раскрашиваются в 2 цвета (чередование)
              </text>
            </svg>
          </div>

          {/* Двудольный */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Пример 2: Двудольный граф (χ = 2)</h4>
            <svg width="100%" height="280" viewBox="0 0 400 280" className="border border-gray-300 rounded bg-white">
              <circle cx="80" cy="80" r="10" fill={colors.red} stroke="black" strokeWidth="2" />
              <circle cx="80" cy="160" r="10" fill={colors.red} stroke="black" strokeWidth="2" />
              <circle cx="80" cy="240" r="10" fill={colors.red} stroke="black" strokeWidth="2" />

              <circle cx="320" cy="120" r="10" fill={colors.blue} stroke="black" strokeWidth="2" />
              <circle cx="320" cy="200" r="10" fill={colors.blue} stroke="black" strokeWidth="2" />

              <line x1="80" y1="80" x2="320" y2="120" stroke="gray" strokeWidth="1" />
              <line x1="80" y1="80" x2="320" y2="200" stroke="gray" strokeWidth="1" />
              <line x1="80" y1="160" x2="320" y2="120" stroke="gray" strokeWidth="1" />
              <line x1="80" y1="240" x2="320" y2="200" stroke="gray" strokeWidth="1" />

              <text x="200" y="260" textAnchor="middle" fontSize="12" fill="gray">
                Двудольный граф: χ = 2 (красные и синие вершины)
              </text>
            </svg>
          </div>

          {/* Нечётный цикл */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Пример 3: Нечётный цикл (χ = 3)</h4>
            <svg width="100%" height="280" viewBox="0 0 400 280" className="border border-gray-300 rounded bg-white">
              {[0, 1, 2].map((i) => {
                const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
                const x = 200 + 80 * Math.cos(angle);
                const y = 140 + 80 * Math.sin(angle);
                const nextAngle = ((i + 1) * 2 * Math.PI) / 3 - Math.PI / 2;
                const nextX = 200 + 80 * Math.cos(nextAngle);
                const nextY = 140 + 80 * Math.sin(nextAngle);

                const colorList = [colors.red, colors.blue, colors.green];

                return (
                  <g key={i}>
                    <line x1={x} y1={y} x2={nextX} y2={nextY} stroke="black" strokeWidth="2" />
                    <circle cx={x} cy={y} r="12" fill={colorList[i]} stroke="black" strokeWidth="2" />
                    <text x={x} y={y + 5} textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                      V{i + 1}
                    </text>
                  </g>
                );
              })}

              <text x="200" y="260" textAnchor="middle" fontSize="12" fill="gray">
                Нечётный цикл (треугольник): χ = 3
              </text>
            </svg>
          </div>

          {/* Таблица */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Пример 4: Сравнение χ для разных графов</h4>
            <svg width="100%" height="280" viewBox="0 0 400 280" className="border border-gray-300 rounded bg-white">
              <rect x="20" y="20" width="360" height="220" fill="none" stroke="black" strokeWidth="1" />

              <text x="100" y="45" fontSize="12" fontWeight="bold">Граф</text>
              <text x="250" y="45" fontSize="12" fontWeight="bold">χ</text>

              <line x1="20" y1="55" x2="380" y2="55" stroke="black" strokeWidth="1" />

              <text x="40" y="85" fontSize="11">Пустой граф</text>
              <text x="270" y="85" fontSize="11" fill={colors.red}>1</text>

              <line x1="20" y1="95" x2="380" y2="95" stroke="gray" strokeWidth="0.5" strokeDasharray="3,3" />

              <text x="40" y="125" fontSize="11">Дерево</text>
              <text x="270" y="125" fontSize="11" fill={colors.blue}>2</text>

              <line x1="20" y1="135" x2="380" y2="135" stroke="gray" strokeWidth="0.5" strokeDasharray="3,3" />

              <text x="40" y="165" fontSize="11">Цикл (чётный)</text>
              <text x="270" y="165" fontSize="11" fill={colors.blue}>2</text>

              <line x1="20" y1="175" x2="380" y2="175" stroke="gray" strokeWidth="0.5" strokeDasharray="3,3" />

              <text x="40" y="205" fontSize="11">Цикл (нечётный)</text>
              <text x="270" y="205" fontSize="11" fill={colors.green}>3</text>

              <line x1="20" y1="215" x2="380" y2="215" stroke="gray" strokeWidth="0.5" strokeDasharray="3,3" />

              <text x="40" y="245" fontSize="11">Полный граф Kₙ</text>
              <text x="270" y="245" fontSize="11" fill={colors.purple}>n</text>
            </svg>
          </div>
        </div>
      )}

      {/* ТАБЛИЦА СРАВНЕНИЯ */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Краткая таблица сравнения</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-200">
                <th className="border p-2 text-left">Тип графа</th>
                <th className="border p-2 text-left">Планарный?</th>
                <th className="border p-2 text-left">χ (макс/мин)</th>
                <th className="border p-2 text-left">Пример</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-blue-100">
                <td className="border p-2">Дерево</td>
                <td className="border p-2">✓ Да</td>
                <td className="border p-2">2</td>
                <td className="border p-2">Файловая система</td>
              </tr>
              <tr className="hover:bg-blue-100">
                <td className="border p-2">Двудольный</td>
                <td className="border p-2">✓ Да</td>
                <td className="border p-2">2</td>
                <td className="border p-2">Расписание занятий</td>
              </tr>
              <tr className="hover:bg-blue-100">
                <td className="border p-2">Цикл (чётный)</td>
                <td className="border p-2">✓ Да</td>
                <td className="border p-2">2</td>
                <td className="border p-2">C₄, C₆, ...</td>
              </tr>
              <tr className="hover:bg-blue-100">
                <td className="border p-2">Цикл (нечётный)</td>
                <td className="border p-2">✓ Да</td>
                <td className="border p-2">3</td>
                <td className="border p-2">Треугольник (C₃)</td>
              </tr>
              <tr className="hover:bg-blue-100">
                <td className="border p-2">K₅</td>
                <td className="border p-2">✗ Нет</td>
                <td className="border p-2">5</td>
                <td className="border p-2">Полный граф 5 вершин</td>
              </tr>
              <tr className="hover:bg-blue-100">
                <td className="border p-2">K₃,₃</td>
                <td className="border p-2">✗ Нет</td>
                <td className="border p-2">2</td>
                <td className="border p-2">Полный двудольный</td>
              </tr>
              <tr className="hover:bg-blue-100">
                <td className="border p-2">Любой планарный</td>
                <td className="border p-2">✓ Да</td>
                <td className="border p-2">≤ 4</td>
                <td className="border p-2">Теорема о 4 красках</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}