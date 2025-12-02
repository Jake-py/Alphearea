function EnglishCoursesBeginner() {
  return (
    <main className="lesson-page">
      <h2>Английский язык — Курсы — Начальный уровень</h2>

      <section className="intro">
        <p>
          Начальный уровень создан для тех, кто только начинает изучать английский язык.
          В курсе собраны базовые темы, простая лексика, первые грамматические правила
          и задания для формирования фундаментальных навыков.
        </p>
      </section>

      <section className="learning-block">
        <h3>Что вы освоите</h3>
        <ul>
          <li>Алфавит и базовое произношение</li>
          <li>Простые повседневные фразы</li>
          <li>Лексика A1: семья, дом, работа, еда, покупки</li>
          <li>Основы грамматики: to be, simple present, местоимения</li>
          <li>Построение простых предложений</li>
          <li>Основы чтения и аудирования</li>
        </ul>
      </section>

      <section className="modules">
        <h3>Модули курса</h3>

        <article className="card">
          <h4>Алфавит и произношение</h4>
          <p>
            Пошаговое обучение буквам, базовым звукам и правильному чтению.
            Материалы включают аудио, таблицы и короткие видео.
          </p>
        </article>

        <article className="card">
          <h4>Базовые фразы</h4>
          <p>
            Приветствия, знакомства, вопросы, просьбы, вежливые выражения — всё,
            что нужно для первых разговоров.
          </p>
        </article>

        <article className="card">
          <h4>Первая грамматика</h4>
          <p>
            Уроки по использованию глагола to be, построению утверждений,
            отрицаний, вопросов и простых конструкций.
          </p>
        </article>

        <article className="card">
          <h4>Словарный минимум A1</h4>
          <p>
            Тематические списки слов с примерами использования и упражнениями
            на запоминание.
          </p>
        </article>
      </section>

      <section className="activities">
        <h3>Практика</h3>
        <ul>
          <li>Мини-диалоги на бытовые темы</li>
          <li>Прослушивание коротких аудио</li>
          <li>Упражнения на понимание текста</li>
          <li>Карточки со словами</li>
          <li>Набор простых тестов для закрепления</li>
        </ul>
      </section>

      <section className="bonus">
        <h3>Дополнительные материалы</h3>
        <div className="cards">
          <article className="card">
            <h4>Beginner Vocabulary Pack</h4>
            <p>Подборка самых нужных слов для старта.</p>
          </article>

          <article className="card">
            <h4>Starter Dialogues</h4>
            <p>Короткие разговоры с субтитрами и переводом.</p>
          </article>

          <article className="card">
            <h4>Pronunciation Helper</h4>
            <p>Аудиоматериалы для тренировки простых звуков английского языка.</p>
          </article>
        </div>
      </section>

      <section className="test-block">
        <h3>Закрепление</h3>
        <p>
          Пройдите начальный тест, чтобы проверить базовые навыки и перейти к уровню A2.
        </p>
        <button className="btn-primary">Начать тест A1</button>
      </section>
    </main>
  );
}

export default EnglishCoursesBeginner;
