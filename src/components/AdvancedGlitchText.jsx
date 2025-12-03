import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Application, Graphics, Text, Container } from 'pixi.js';

function AdvancedGlitchText({ text }) {
  const containerRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let app;
    const letters = [];

    (async () => {
      app = new Application();
      await app.init({
        width: 600,
        height: 120,
        transparent: true,
        antialias: true,
      });
      container.appendChild(app.canvas);
      appRef.current = app;

      text.split('').forEach((char, i) => {
        const letterContainer = new Container();
        letterContainer.x = i * 40;
        letterContainer.y = 30;

        // Основной текст
        const mainText = new Text({
          text: char,
          style: {
            fontFamily: 'Arial',
            fontSize: 60,
            fill: 0xffffff,
          }
        });
        letterContainer.addChild(mainText);

        // Создание фрагментов для глитча (частицы распада)
        const fragments = [];
        for (let j = 0; j < 15; j++) {
          const frag = new Graphics();
          frag.rect(0, 0, 2, 2);
          frag.fill(0xffffff);
          frag.x = Math.random() * mainText.width;
          frag.y = Math.random() * mainText.height;
          frag.alpha = 0;
          letterContainer.addChild(frag);
          fragments.push(frag);
        }

        // Горизонтальные полосы для разрыва
        const horizontalStrips = [];
        for (let j = 0; j < 5; j++) {
          const strip = new Graphics();
          strip.rect(0, j * 12, mainText.width, 1);
          strip.fill(0xffffff);
          strip.alpha = 0;
          letterContainer.addChild(strip);
          horizontalStrips.push(strip);
        }

        // Вертикальные квадратики для шума
        const noiseSquares = [];
        for (let j = 0; j < 25; j++) {
          const square = new Graphics();
          square.rect(0, 0, 1, 1);
          square.fill(0xffffff);
          square.x = Math.random() * mainText.width;
          square.y = Math.random() * mainText.height;
          square.alpha = 0;
          letterContainer.addChild(square);
          noiseSquares.push(square);
        }

        // Артефакты: линии и точки
        const artifacts = [];
        for (let j = 0; j < 3; j++) {
          const line = new Graphics();
          line.moveTo(0, 0);
          line.lineTo(10 + Math.random() * 20, 0);
          line.stroke({ width: 1, color: 0xffffff });
          line.x = Math.random() * mainText.width;
          line.y = Math.random() * mainText.height;
          line.alpha = 0;
          letterContainer.addChild(line);
          artifacts.push(line);
        }
        for (let j = 0; j < 5; j++) {
          const dot = new Graphics();
          dot.circle(0, 0, 0.5);
          dot.fill(0xffffff);
          dot.x = Math.random() * mainText.width;
          dot.y = Math.random() * mainText.height;
          dot.alpha = 0;
          letterContainer.addChild(dot);
          artifacts.push(dot);
        }

        letters.push({ container: letterContainer, mainText, fragments, horizontalStrips, noiseSquares, artifacts });
        app.stage.addChild(letterContainer);
      });

      // Типы глитчей
      const glitchTypes = ['fragments', 'horizontal', 'noise', 'rgbSplit', 'artifacts'];

      // Функция глитча для буквы
      const glitchLetter = (letter) => {
        const type = glitchTypes[Math.floor(Math.random() * glitchTypes.length)];
        const duration = 0.08 + Math.random() * 0.12; // 80-200 ms

        if (type === 'fragments') {
          // Частицы распада
          letter.fragments.forEach((frag) => {
            gsap.set(frag, { alpha: 1 });
            gsap.to(frag, {
              x: frag.x + (Math.random() - 0.5) * 5,
              y: frag.y + (Math.random() - 0.5) * 5,
              alpha: 0,
              duration: duration,
              ease: 'power2.out',
            });
          });
        } else if (type === 'horizontal') {
          // Горизонтальный разрыв
          letter.horizontalStrips.forEach((strip, idx) => {
            gsap.set(strip, { alpha: 1 });
            gsap.to(strip, {
              x: strip.x + (Math.random() - 0.5) * 3,
              alpha: 0,
              duration: duration,
              delay: idx * 0.01,
              ease: 'power2.out',
            });
          });
        } else if (type === 'noise') {
          // Вертикальный шум
          letter.noiseSquares.forEach((square) => {
            gsap.set(square, { alpha: 1 });
            gsap.to(square, {
              x: square.x + (Math.random() - 0.5) * 2,
              y: square.y + (Math.random() - 0.5) * 2,
              alpha: 0,
              duration: duration,
              ease: 'power2.out',
            });
          });
        } else if (type === 'rgbSplit') {
          // RGB split
          const rgbSplit = new Container();
          rgbSplit.x = letter.container.x;
          rgbSplit.y = letter.container.y;

          const redText = new Text({
            text: letter.mainText.text,
            style: {
              fontFamily: 'Arial',
              fontSize: 60,
              fill: 0xff0000,
            }
          });
          redText.x = -2;
          rgbSplit.addChild(redText);

          const blueText = new Text({
            text: letter.mainText.text,
            style: {
              fontFamily: 'Arial',
              fontSize: 60,
              fill: 0x0000ff,
            }
          });
          blueText.x = 2;
          rgbSplit.addChild(blueText);

          app.stage.addChild(rgbSplit);

          gsap.to(rgbSplit, {
            alpha: 0,
            duration: duration,
            onComplete: () => app.stage.removeChild(rgbSplit),
          });
        } else if (type === 'artifacts') {
          // Артефакты
          letter.artifacts.forEach((art) => {
            gsap.set(art, { alpha: 1 });
            gsap.to(art, {
              alpha: 0,
              duration: duration,
              ease: 'power2.out',
            });
          });
        }

        // Сброс через 200ms
        setTimeout(() => {
          letter.fragments.forEach(frag => gsap.set(frag, { x: Math.random() * letter.mainText.width, y: Math.random() * letter.mainText.height, alpha: 0 }));
          letter.horizontalStrips.forEach((strip, idx) => gsap.set(strip, { x: 0, y: idx * 12, alpha: 0 }));
          letter.noiseSquares.forEach(square => gsap.set(square, { x: Math.random() * letter.mainText.width, y: Math.random() * letter.mainText.height, alpha: 0 }));
          letter.artifacts.forEach(art => gsap.set(art, { alpha: 0 }));
        }, 200);
      };

      // Случайные глитчи
      const glitchInterval = setInterval(() => {
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        glitchLetter(randomLetter);
      }, 500 + Math.random() * 700); // 500-1200 ms

      return () => {
        clearInterval(glitchInterval);
        if (appRef.current) {
          try {
            appRef.current.destroy(true);
          } catch (e) {
            // Игнорируем ошибки при destroy
          }
        }
      };
    })();

    return () => {
      if (appRef.current) {
        try {
          appRef.current.destroy(true);
        } catch (e) {
          // Игнорируем ошибки при destroy
        }
      }
    };
  }, [text]);

  return <div ref={containerRef} style={{ width: '600px', height: '120px' }} />;
}

export default AdvancedGlitchText;