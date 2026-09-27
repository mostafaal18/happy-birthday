import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const TEXT = "تولدت مبارک آبجی سهیلا";
const COLORS = ["#ff6ec4", "#ffd86f", "#6ee7ff", "#a78bfa", "#34d399", "#fb7185", "#f97316"];
const HEART_EMOJIS = ["❤️", "💖", "💕", "💗", "💝", "💞"];

/* ---------- افکت تایپ‌رایتر ---------- */
function useTypewriter(text, speed = 230, delay = 700) {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started || index >= text.length) return;
    const t = setTimeout(() => setIndex((i) => i + 1), speed);
    return () => clearTimeout(t);
  }, [started, index, text, speed]);

  return { shown: text.slice(0, index), done: index >= text.length, index };
}

/* ---------- قلب‌های انیمیشنی ---------- */
function Hearts({ trigger }) {
  const [hearts, setHearts] = useState([]);
  const counter = useRef(0);

  useEffect(() => {
    if (trigger <= 0) return;

    // هر بار که حرف جدید تایپ شد، ۲ تا ۳ قلب می‌سازیم
    const count = 2 + Math.floor(Math.random() * 2);

    for (let i = 0; i < count; i++) {
      const id = ++counter.current;
      const heart = {
        id,
        left: 20 + Math.random() * 60, // وسط صفحه
        bottom: 30 + Math.random() * 30,
        size: 20 + Math.random() * 30,
        emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
        duration: 2.2 + Math.random() * 1.8,
        rotate: -20 + Math.random() * 40,
        drift: -60 + Math.random() * 120,
      };
      setHearts((prev) => [...prev, heart]);

      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, 4500);
    }
  }, [trigger]);

  return (
    <div className="hearts-layer">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart"
          style={{
            left: `${h.left}%`,
            bottom: `${h.bottom}%`,
            fontSize: h.size,
            animationDuration: `${h.duration}s`,
            "--rotate": `${h.rotate}deg`,
            "--drift": `${h.drift}px`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

/* ---------- صحنه ---------- */
function Scene({ onReplay }) {
  const { shown, done, index } = useTypewriter(TEXT);

  const confetti = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 5 + Math.random() * 6,
        color: COLORS[i % COLORS.length],
        w: 6 + Math.random() * 8,
        h: 8 + Math.random() * 12,
        round: Math.random() > 0.7,
      })),
    []
  );

  const balloons = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: 4 + Math.random() * 92,
        delay: Math.random() * 9,
        duration: 11 + Math.random() * 9,
        color: COLORS[i % COLORS.length],
        scale: 0.6 + Math.random() * 0.7,
      })),
    []
  );

  const stars = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2.4,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
      })),
    []
  );

  return (
    <>
      <div className="stars">
        {stars.map((s) => (
          <span
            key={s.id}
            className="star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {balloons.map((b) => (
        <span
          key={b.id}
          className="balloon"
          style={{
            left: `${b.left}%`,
            background: `radial-gradient(circle at 32% 28%, #ffffffcc, ${b.color} 45%, ${b.color} 100%)`,
            color: b.color,
            transform: `scale(${b.scale})`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}

      {confetti.map((c) => (
        <span
          key={c.id}
          className="confetti"
          style={{
            left: `${c.left}%`,
            width: c.w,
            height: c.h,
            background: c.color,
            borderRadius: c.round ? "50%" : "2px",
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        />
      ))}

      {/* قلب‌ها با هر حرف جدید */}
      <Hearts trigger={index} />

      <main className="content">
        <div className="cake" aria-hidden="true">
          🎂
        </div>

        <h1 className="title-wrap">
          <span className="title">{shown}</span>
          {!done && <span className="caret" />}
        </h1>

        <p className={`subtitle ${done ? "show" : ""}`}>
          امیدوارم بهترین سال زندگی‌ت باشه 🎈
        </p>

        <button
          className={`replay ${done ? "show" : ""} down`}
          onClick={onReplay}
          type="button"
        >
          🎉 یه بار دیگه
        </button>
      </main>

      <div className="orb orb-1" />
      <div className="orb orb-2" />
    </>
  );
}

/* ---------- اپ اصلی ---------- */
export default function App() {
  const [runId, setRunId] = useState(0);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  // شروع: پخش آهنگ + اجرای انیمیشن
  const start = () => {
    setStarted(true);
    setRunId((n) => n + 1);
    const a = audioRef.current;
    if (a) {
      a.currentTime = 0;
      a.volume = 0.6;
      a.loop = true;
      a.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  return (
    <div className="stage">
      {/* آهنگ */}
      <audio ref={audioRef} src="/music.mp3" preload="auto" />

      {/* دکمه قطع/وصل صدا (بعد از شروع) */}
      {started && (
        <button
          className="mute-btn"
          onClick={toggleMute}
          type="button"
          title={muted ? "پخش صدا" : "قطع صدا"}
        >
          {muted ? "🔇" : "🔊"}
        </button>
      )}

      {/* صفحه شروع */}
      {!started && (
        <div className="intro">
          <button className="start-btn" onClick={start} type="button">
            🎁 بازش کن
          </button>
        </div>
      )}

      {started && (
        <Scene key={runId} onReplay={() => setRunId((n) => n + 1)} />
      )}
    </div>
  );
}