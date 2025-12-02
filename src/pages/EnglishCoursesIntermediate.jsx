function EnglishCoursesIntermediate() {
  return (
    <main className="lesson-page">
      <h2>Английский язык — Курсы — Средний уровень (Intermediate)</h2>

      <section className="intro">
        <p>
          Средний уровень разработан для студентов, которые уже уверенно владеют основами английского языка. 
          Курс помогает расширить словарный запас, улучшить грамматику, развить навыки общения и 
          подготовиться к более глубокому изучению языка.
        </p>
      </section>

      <section className="learning-block">
        <h3>Что вы освоите</h3>
        <ul>
          <li>Словарный запас уровня B1</li>
          <li>Сложные виды времен: Past Perfect, Future forms</li>
          <li>Модальные глаголы и их нюансы</li>
          <li>Сложные структуры предложений</li>
          <li>Развитие навыков свободного общения</li>
          <li>Аудирование: понимание естественной речи</li>
          <li>Работа с текстом средней сложности</li>
        </ul>
      </section>

      <section className="modules">
        <h3>Модули курса</h3>

        <article className="card">
          <h4>Расширенная грамматика</h4>
          <p>
            Углубление в времена, модальные конструкции, пассивный залог, условные предложения 
            и более гибкие способы выражения мыслей.
          </p>
        </article>

        <article className="card">
          <h4>Communicative English</h4>
          <p>
            Практика свободной речи: ситуации из реальной жизни, разговорные выражения, 
            диалоги, мини-дебаты и спонтанные ответы.
          </p>
        </article>

        <article className="card">
          <h4>Listening Skills</h4>
          <p>
            Работа с подкастами, интервью и аудио на естественной скорости. 
            Учитесь понимать акценты и интонации.
          </p>
        </article>

        <article className="card">
          <h4>Reading & Vocabulary</h4>
          <p>
            Тексты уровня B1/B1+ с упражнениями, расширенный словарь, выражения и устойчивые фразы.
          </p>
        </article>

        <article className="card">
          <h4>Writing Essentials</h4>
          <p>
            Как писать письма, короткие эссе, сообщения и структурированные тексты на английском языке.
          </p>
        </article>
      </section>

      <section className="activities">
        <h3>Практика</h3>
        <ul>
          <li>Диалоги средней сложности</li>
          <li>Аудирование с разбором</li>
          <li>Тематические упражнения на словарный запас</li>
          <li>Составление собственных текстов</li>
          <li>Грамматические тренажеры</li>
        </ul>
      </section>

      <section className="bonus">
        <h3>Дополнительные материалы</h3>
        <div className="cards">
          <article className="card">
            <h4>B1 Vocabulary Booster</h4>
            <p>Список слов и выражений, которые поднимают речь на новый уровень.</p>
          </article>

          <article className="card">
            <h4>Conversational Toolkit</h4>
            <p>Набор фраз для уверенного общения в разных ситуациях.</p>
          </article>

          <article className="card">
            <h4>Grammar Master Pack</h4>
            <p>Подборка схем, таблиц и визуальных подсказок по грамматике.</p>
          </article>
        </div>
      </section>

      <section className="test-block">
        <h3>Закрепление</h3>
        <p>
          Пройдите промежуточный тест уровня B1, чтобы оценить свои успехи и перейти к продвинутому уровню.
        </p>
        <button className="btn-primary">Начать тест B1</button>
      </section>
    </main>
  );
}

export default EnglishCoursesIntermediate;
