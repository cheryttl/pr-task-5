import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IntelligentForm } from './components/IntelligentForm';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // -----------------------------
  // 1. АНИМАЦИЯ ПРИ СКРОЛЛЕ
  // -----------------------------
  useEffect(() => {
    gsap.utils.toArray<HTMLElement>('.scroll-box').forEach((el, i) => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 100,
          scale: 0.8,
          rotate: i % 2 === 0 ? -5 : 5,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: 0,
          duration: 1.2,
          ease: 'elastic.out(1, 0.75)',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'bottom 15%',
            // 'play reverse play reverse' гарантирует работу при движении вверх и вниз
            toggleActions: 'play reverse play reverse', 
          },
        },
      );
    });
  }, []);

  // -----------------------------
  // 2. ПОСЛЕДОВАТЕЛЬНАЯ АНИМАЦИЯ (Зацикленная)
  // -----------------------------
  useEffect(() => {
    const letters = gsap.utils.toArray<HTMLElement>('.letter');

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1,
    });

    tl.set(letters, { transformOrigin: '50% 50%' });

    tl.fromTo(
      letters,
      {
        rotateX: () => gsap.utils.random(-180, 180),
        rotateY: () => gsap.utils.random(-180, 180),
        z: () => gsap.utils.random(-200, 200),
        opacity: 0,
        scale: 0.5,
      },
      {
        rotateX: 0,
        rotateY: 0,
        z: 0,
        opacity: 1,
        scale: 1,
        stagger: {
          each: 0.08,
          from: 'random',
        },
        duration: 1.2,
        ease: 'expo.out',
      },
    ).to(letters, {
      rotateX: 90,
      rotateY: -90,
      opacity: 0,
      scale: 0.2,
      stagger: {
        each: 0.05,
        from: 'edges',
      },
      duration: 0.8,
      ease: 'power3.inOut',
      delay: 2, // Пауза, чтобы текст можно было прочитать
    });
  }, []);

  // -----------------------------
  // 3. ИНТЕРАКТИВНАЯ КАРТОЧКА
  // -----------------------------
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Амплитуда наклона (15 градусов)
      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformOrigin: 'center',
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const reset = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', reset);

    return () => {
      card.removeEventListener('mousemove', handleMove);
      card.removeEventListener('mouseleave', reset);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-950 text-white font-sans">
      {/* ---------------- HERO ---------------- */}
      <section className="flex h-screen flex-col items-center justify-center">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight">
          GSAP <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Showcase</span>
        </h1>
        <p className="text-zinc-400 animate-pulse">Листай вниз 👇</p>
      </section>

      {/* ---------------- SCROLL ANIMATION ---------------- */}
      <section className="space-y-16 py-32">
        <h2 className="text-center text-3xl font-bold text-zinc-300 mb-10">Анимация при скролле</h2>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="scroll-box mx-auto flex h-48 w-[80%] max-w-2xl items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-2xl font-medium shadow-xl"
          >
            Блок {i + 1}
          </div>
        ))}
      </section>

      {/* ---------------- SEQUENTIAL TEXT ---------------- */}
      <section className="flex h-screen flex-col items-center justify-center gap-10 bg-zinc-900/50">
        <div 
          className="flex text-5xl sm:text-7xl font-black" 
          style={{ perspective: '1000px' }}
        >
          {'ANIMATION'.split('').map((char, i) => (
            <span key={i} className="letter inline-block mx-1">
              {char}
            </span>
          ))}
        </div>
        <p className="text-zinc-500">Последовательная зацикленная анимация</p>
      </section>

      {/* ---------------- INTERACTIVE CARD ---------------- */}
      <section className="flex h-screen flex-col items-center justify-center gap-10">
        <h2 className="text-center text-3xl font-bold text-zinc-300">Интерактивная карточка</h2>
        <div
          ref={cardRef}
          className="relative flex h-[250px] w-[350px] items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-2xl font-bold shadow-2xl cursor-crosshair"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Внутренний элемент с translateZ для параллакс-эффекта */}
          <div 
            className="absolute inset-3 rounded-xl border border-white/30 bg-black/10 backdrop-blur-sm flex items-center justify-center pointer-events-none"
            style={{ transform: 'translateZ(50px)' }}
          >
            Поводи мышкой
          </div>
        </div>
      </section>

      <section className="flex min-h-screen flex-col items-center justify-center gap-10 py-20 bg-zinc-900/30">
        <h2 className="text-center text-3xl font-bold text-zinc-300">Интеллектуальная форма</h2>
        <IntelligentForm />
      </section>
    </div>
  );
}