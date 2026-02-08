import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
  Enhanced Mental Wellness Games Collection
  Each game is designed with calming colors, therapeutic messaging, and mindful interactions
*/

// -------------------------------
// Helpers
// -------------------------------
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// -------------------------------
// 1) Enhanced Breathing Exercise
// -------------------------------
export function BreathingGame() {
  const cycles = {
    "4-7-8 Relaxation": [
      { name: "Inhale", seconds: 4, color: "#60A5FA" },
      { name: "Hold", seconds: 7, color: "#A78BFA" },
      { name: "Exhale", seconds: 8, color: "#34D399" },
    ],
    "Box Breathing": [
      { name: "Inhale", seconds: 4, color: "#60A5FA" },
      { name: "Hold", seconds: 4, color: "#A78BFA" },
      { name: "Exhale", seconds: 4, color: "#34D399" },
      { name: "Hold", seconds: 4, color: "#F59E0B" },
    ],
    "Quick Calm": [
      { name: "Inhale", seconds: 3, color: "#60A5FA" },
      { name: "Hold", seconds: 2, color: "#A78BFA" },
      { name: "Exhale", seconds: 5, color: "#34D399" },
    ],
  };

  const [selectedCycle, setSelectedCycle] = useState("4-7-8 Relaxation");
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(cycles[selectedCycle][0].seconds);
  const [completedCycles, setCompletedCycles] = useState(0);

  const currentCycle = cycles[selectedCycle];

  useEffect(() => {
    let timer;
    if (running) {
      timer = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            const nextIdx = (phaseIdx + 1) % currentCycle.length;
            setPhaseIdx(nextIdx);
            if (nextIdx === 0) setCompletedCycles((c) => c + 1);
            return currentCycle[nextIdx].seconds;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [running, phaseIdx, currentCycle]);

  useEffect(() => {
    setTimeLeft(currentCycle[phaseIdx].seconds);
  }, [phaseIdx, currentCycle]);

  const sizeForPhase = (name) => {
    if (name === "Inhale") return 280;
    if (name === "Hold") return 250;
    return 160; // Exhale
  };

  const currentPhase = currentCycle[phaseIdx];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)",
        padding: "40px 20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          padding: 40,
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1f2937", marginBottom: 8 }}>
            🌬️ Guided Breathing
          </h1>
          <p style={{ color: "#6b7280", fontSize: 16 }}>
            Follow the circle's rhythm to calm your mind and reduce stress
          </p>
        </div>

        {/* Cycle Selector */}
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {Object.keys(cycles).map((cycleName) => (
              <button
                key={cycleName}
                onClick={() => {
                  setSelectedCycle(cycleName);
                  setRunning(false);
                  setPhaseIdx(0);
                  setCompletedCycles(0);
                }}
                style={{
                  padding: "12px 24px",
                  borderRadius: 12,
                  border: selectedCycle === cycleName ? "2px solid #667eea" : "2px solid #e5e7eb",
                  background: selectedCycle === cycleName ? "#eff6ff" : "#fff",
                  color: selectedCycle === cycleName ? "#667eea" : "#6b7280",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {cycleName}
              </button>
            ))}
          </div>
        </div>

        {/* Main Breathing Circle */}
        <div style={{ display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
          <motion.div
            style={{
              width: sizeForPhase(currentPhase.name),
              height: sizeForPhase(currentPhase.name),
              borderRadius: "50%",
              background: `radial-gradient(circle at 30% 30%, ${currentPhase.color}40, ${currentPhase.color}80)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 20px 60px ${currentPhase.color}40`,
              position: "relative",
            }}
            animate={{
              width: sizeForPhase(currentPhase.name),
              height: sizeForPhase(currentPhase.name),
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div style={{ fontSize: 48, marginBottom: 8 }}>
              {currentPhase.name === "Inhale" ? "⬆️" : currentPhase.name === "Exhale" ? "⬇️" : "⏸️"}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#1f2937" }}>{currentPhase.name}</div>
            <div style={{ fontSize: 48, fontWeight: 800, color: currentPhase.color, marginTop: 8 }}>
              {timeLeft}
            </div>
          </motion.div>

          <div style={{ flex: 1, minWidth: 280 }}>
            <div
              style={{
                background: "linear-gradient(135deg, #f9fafb, #ffffff)",
                padding: 24,
                borderRadius: 16,
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", marginBottom: 16 }}>
                SESSION PROGRESS
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#667eea" }}>{completedCycles}</div>
                <div style={{ fontSize: 14, color: "#6b7280" }}>Cycles Completed</div>
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                {!running ? (
                  <button
                    onClick={() => setRunning(true)}
                    style={{
                      flex: 1,
                      padding: "14px 24px",
                      borderRadius: 12,
                      border: "none",
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 16,
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                    }}
                  >
                    ▶️ Start
                  </button>
                ) : (
                  <button
                    onClick={() => setRunning(false)}
                    style={{
                      flex: 1,
                      padding: "14px 24px",
                      borderRadius: 12,
                      border: "none",
                      background: "#f59e0b",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                  >
                    ⏸️ Pause
                  </button>
                )}

                <button
                  onClick={() => {
                    setRunning(false);
                    setPhaseIdx(0);
                    setCompletedCycles(0);
                    setTimeLeft(currentCycle[0].seconds);
                  }}
                  style={{
                    padding: "14px 24px",
                    borderRadius: 12,
                    border: "2px solid #e5e7eb",
                    background: "#fff",
                    color: "#6b7280",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  🔄 Reset
                </button>
              </div>

              <div
                style={{
                  background: "#fef3c7",
                  padding: 16,
                  borderRadius: 12,
                  border: "1px solid #fde68a",
                }}
              >
                <div style={{ fontSize: 13, color: "#92400e", lineHeight: 1.6 }}>
                  <strong>💡 Tip:</strong> Place one hand on your chest and one on your belly. Feel your breath
                  move through your body. Focus on the present moment.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------
// 2) Enhanced Memory Match
// -------------------------------
export function MemoryMatch() {
  const themes = {
    "Peaceful Nature": ["🌸", "🌿", "🦋", "🌊", "🌙", "⭐"],
    "Calm Animals": ["🐨", "🦥", "🐢", "🐠", "🦢", "🐇"],
    "Mindful Symbols": ["🕉️", "☮️", "💚", "🧘", "🌈", "✨"],
  };

  const [selectedTheme, setSelectedTheme] = useState("Peaceful Nature");
  const [cards, setCards] = useState(() => shuffle([...themes[selectedTheme], ...themes[selectedTheme]]));
  const [openIdx, setOpenIdx] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let t;
    if (startTime && matched.length < cards.length) {
      t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    }
    return () => clearInterval(t);
  }, [startTime, matched, cards.length]);

  const flip = (idx) => {
    if (openIdx.includes(idx) || matched.includes(idx)) return;
    if (!startTime) setStartTime(Date.now());

    const nextOpen = [...openIdx, idx];
    setOpenIdx(nextOpen);

    if (nextOpen.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nextOpen;
      if (cards[a] === cards[b]) {
        setMatched((m) => [...m, a, b]);
        setOpenIdx([]);
      } else {
        setTimeout(() => setOpenIdx([]), 800);
      }
    }
  };

  const reset = (theme = selectedTheme) => {
    const shuffled = shuffle([...themes[theme], ...themes[theme]]);
    setCards(shuffled);
    setOpenIdx([]);
    setMatched([]);
    setMoves(0);
    setStartTime(null);
    setElapsed(0);
  };

  const won = matched.length === cards.length && cards.length > 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%)",
        padding: "40px 20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          padding: 40,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1f2937", marginBottom: 8 }}>🧠 Memory Match</h1>
          <p style={{ color: "#6b7280", fontSize: 16 }}>
            Match pairs to strengthen focus and calm your mind
          </p>
        </div>

        {/* Theme Selector */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", marginBottom: 12 }}>CHOOSE THEME</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.keys(themes).map((theme) => (
              <button
                key={theme}
                onClick={() => {
                  setSelectedTheme(theme);
                  reset(theme);
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: selectedTheme === theme ? "2px solid #f59e0b" : "2px solid #e5e7eb",
                  background: selectedTheme === theme ? "#fef3c7" : "#fff",
                  color: selectedTheme === theme ? "#92400e" : "#6b7280",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: "#eff6ff",
              padding: 16,
              borderRadius: 12,
              textAlign: "center",
              border: "1px solid #dbeafe",
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 800, color: "#3b82f6" }}>{moves}</div>
            <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>MOVES</div>
          </div>
          <div
            style={{
              background: "#f0fdf4",
              padding: 16,
              borderRadius: 12,
              textAlign: "center",
              border: "1px solid #bbf7d0",
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 800, color: "#10b981" }}>{elapsed}s</div>
            <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>TIME</div>
          </div>
          <div
            style={{
              background: "#fef3c7",
              padding: 16,
              borderRadius: 12,
              textAlign: "center",
              border: "1px solid #fde68a",
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 800, color: "#f59e0b" }}>{matched.length / 2}</div>
            <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>PAIRS</div>
          </div>
        </div>

        {/* Game Board */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {cards.map((c, i) => {
            const revealed = openIdx.includes(i) || matched.includes(i);
            return (
              <motion.div
                key={i}
                onClick={() => flip(i)}
                whileHover={{ scale: revealed ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  aspectRatio: "1",
                  borderRadius: 12,
                  background: revealed
                    ? "linear-gradient(135deg, #ffffff, #f9fafb)"
                    : "linear-gradient(135deg, #667eea, #764ba2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  cursor: revealed ? "default" : "pointer",
                  boxShadow: revealed ? "0 4px 12px rgba(0,0,0,0.1)" : "0 4px 12px rgba(102, 126, 234, 0.3)",
                  userSelect: "none",
                  transition: "all 0.3s",
                }}
              >
                {revealed ? c : "✨"}
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => reset()}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: 12,
              border: "2px solid #e5e7eb",
              background: "#fff",
              color: "#6b7280",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🔄 New Game
          </button>
        </div>

        {/* Win Message */}
        <AnimatePresence>
          {won && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                marginTop: 24,
                padding: 24,
                borderRadius: 16,
                background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
                border: "2px solid #6ee7b7",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#065f46", marginBottom: 8 }}>
                Amazing! You did it!
              </div>
              <div style={{ fontSize: 14, color: "#047857" }}>
                {moves} moves in {elapsed} seconds
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// -------------------------------
// 3) Enhanced Bubble Pop
// -------------------------------
export function BubblePop() {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastPop, setLastPop] = useState(0);
  const [affirmations, setAffirmations] = useState([]);

  const positiveMessages = [
    "You're doing great!",
    "Keep going!",
    "Well done!",
    "Breathe and relax",
    "You've got this!",
    "One step at a time",
    "You're stronger than you think",
    "Peace is within you",
  ];

  useEffect(() => {
    const spawn = setInterval(() => {
      setBubbles((prev) => {
        const id = Date.now() + Math.random();
        const left = Math.random() * 85 + 5;
        const size = Math.random() * 56 + 40;
        const hue = Math.random() * 360;
        return [...prev, { id, left, size, hue, popped: false }].slice(-15);
      });
    }, 800);
    return () => clearInterval(spawn);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setBubbles((prev) => prev.filter((b) => !b.popped));
      setAffirmations((prev) => prev.filter((a) => Date.now() - a.time < 2000));
    }, 1200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const resetCombo = setTimeout(() => {
      if (Date.now() - lastPop > 1500) setCombo(0);
    }, 1500);
    return () => clearTimeout(resetCombo);
  }, [lastPop]);

  const pop = (id, x, y) => {
    setBubbles((prev) => prev.map((b) => (b.id === id ? { ...b, popped: true } : b)));
    setScore((s) => s + 1 + combo);
    setCombo((c) => c + 1);
    setLastPop(Date.now());

    if (Math.random() > 0.7) {
      const msg = positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
      setAffirmations((prev) => [...prev, { id: Date.now(), msg, x, y, time: Date.now() }]);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #bfdbfe 0%, #dbeafe 50%, #e0f2fe 100%)",
        padding: "40px 20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.85)",
          borderRadius: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          padding: 40,
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1f2937", marginBottom: 8 }}>
            🫧 Stress Relief Bubbles
          </h1>
          <p style={{ color: "#6b7280", fontSize: 16 }}>Pop bubbles to release tension and feel lighter</p>
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 24 }}>
          <div
            style={{
              background: "#eff6ff",
              padding: "12px 24px",
              borderRadius: 12,
              border: "1px solid #dbeafe",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 800, color: "#3b82f6" }}>{score}</div>
            <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>SCORE</div>
          </div>
          {combo > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                background: "#fef3c7",
                padding: "12px 24px",
                borderRadius: 12,
                border: "1px solid #fde68a",
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 800, color: "#f59e0b" }}>🔥 {combo}x</div>
              <div style={{ fontSize: 12, color: "#92400e", fontWeight: 600 }}>COMBO</div>
            </motion.div>
          )}
        </div>

        <div
          style={{
            height: 450,
            borderRadius: 16,
            background: "linear-gradient(180deg, rgba(191, 219, 254, 0.3), rgba(224, 242, 254, 0.3))",
            position: "relative",
            overflow: "hidden",
            border: "2px solid rgba(147, 197, 253, 0.3)",
          }}
        >
          {bubbles.map((b) => (
            <motion.div
              key={b.id}
              onClick={(e) => pop(b.id, e.clientX, e.clientY)}
              initial={{ bottom: -50 }}
              animate={{
                bottom: b.popped ? -50 : 500,
                scale: b.popped ? 0 : 1,
                opacity: b.popped ? 0 : 1,
              }}
              transition={{
                bottom: { duration: 7, ease: "linear" },
                scale: { duration: 0.3 },
                opacity: { duration: 0.3 },
              }}
              style={{
                position: "absolute",
                left: `${b.left}%`,
                width: b.size,
                height: b.size,
                borderRadius: "50%",
                background: `radial-gradient(circle at 30% 30%, hsl(${b.hue}, 70%, 85%), hsl(${b.hue}, 60%, 70%))`,
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                border: "2px solid rgba(255, 255, 255, 0.5)",
              }}
            />
          ))}

          {affirmations.map((a) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -50 }}
              transition={{ duration: 2 }}
              style={{
                position: "absolute",
                left: a.x - 100,
                top: a.y - 50,
                fontSize: 16,
                fontWeight: 700,
                color: "#10b981",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                pointerEvents: "none",
              }}
            >
              {a.msg}
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button
            onClick={() => {
              setBubbles([]);
              setScore(0);
              setCombo(0);
            }}
            style={{
              padding: "12px 32px",
              borderRadius: 12,
              border: "2px solid #e5e7eb",
              background: "#fff",
              color: "#6b7280",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>
    </div>
  );
}


// -------------------------------
// 4) Enhanced Color Calm
// -------------------------------
export function ColorCalm() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#a78bfa");
  const [size, setSize] = useState(8);
  const [tool, setTool] = useState("brush");

  const calmingColors = [
    { color: "#a78bfa", name: "Lavender" },
    { color: "#60a5fa", name: "Sky Blue" },
    { color: "#34d399", name: "Mint" },
    { color: "#fbbf24", name: "Sunshine" },
    { color: "#f472b6", name: "Rose" },
    { color: "#10b981", name: "Forest" },
    { color: "#818cf8", name: "Violet" },
    { color: "#f59e0b", name: "Amber" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 900;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    
    // Calming background
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctxRef.current = ctx;

    const saved = localStorage.getItem("colorcalm_image");
    if (saved) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = saved;
    }
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = size;
      ctxRef.current.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    }
  }, [color, size, tool]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    return {
      x: ((e.clientX || e.touches?.[0]?.clientX) - rect.left) * scaleX,
      y: ((e.clientY || e.touches?.[0]?.clientY) - rect.top) * scaleY,
    };
  };

  const start = (e) => {
    e.preventDefault();
    setDrawing(true);
    const { x, y } = getPos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const move = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const end = () => {
    setDrawing(false);
    ctxRef.current.closePath();
  };

  const clear = () => {
    const ctx = ctxRef.current;
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const save = () => {
    const data = canvasRef.current.toDataURL();
    localStorage.setItem("colorcalm_image", data);
    
    const link = document.createElement("a");
    link.download = `mindful-art-${Date.now()}.png`;
    link.href = data;
    link.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%)",
        padding: "40px 20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          padding: 40,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1f2937", marginBottom: 8 }}>
            🎨 Mindful Art Canvas
          </h1>
          <p style={{ color: "#6b7280", fontSize: 16 }}>
            Express yourself freely. Let your creativity flow without judgment.
          </p>
        </div>

        {/* Toolbar */}
        <div
          style={{
            background: "#f9fafb",
            padding: 20,
            borderRadius: 16,
            marginBottom: 24,
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", marginBottom: 12 }}>
              COLORS
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {calmingColors.map((c) => (
                <motion.button
                  key={c.color}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setColor(c.color);
                    setTool("brush");
                  }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: c.color,
                    border: color === c.color ? "3px solid #1f2937" : "2px solid #e5e7eb",
                    cursor: "pointer",
                    boxShadow: color === c.color ? `0 4px 12px ${c.color}80` : "0 2px 8px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                  title={c.name}
                >
                  {color === c.color && "✓"}
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", marginBottom: 8, display: "block" }}>
                BRUSH SIZE: {size}px
              </label>
              <input
                type="range"
                min={2}
                max={60}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#667eea" }}
              />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setTool("brush")}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: tool === "brush" ? "2px solid #667eea" : "2px solid #e5e7eb",
                  background: tool === "brush" ? "#eff6ff" : "#fff",
                  color: tool === "brush" ? "#667eea" : "#6b7280",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                🖌️ Brush
              </button>
              <button
                onClick={() => setTool("eraser")}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: tool === "eraser" ? "2px solid #667eea" : "2px solid #e5e7eb",
                  background: tool === "eraser" ? "#eff6ff" : "#fff",
                  color: tool === "eraser" ? "#667eea" : "#6b7280",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                🧹 Eraser
              </button>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={clear}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: "2px solid #e5e7eb",
                  background: "#fff",
                  color: "#6b7280",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                🗑️ Clear
              </button>
              <button
                onClick={save}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                }}
              >
                💾 Save
              </button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
          style={{
            width: "100%",
            borderRadius: 16,
            border: "2px solid #e5e7eb",
            cursor: tool === "eraser" ? "crosshair" : "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+'), auto",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.05)",
          }}
        />

        <div
          style={{
            marginTop: 16,
            padding: 16,
            background: "#dbeafe",
            borderRadius: 12,
            border: "1px solid #bfdbfe",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, color: "#1e40af", fontSize: 14, lineHeight: 1.6 }}>
            💡 <strong>Mindful Tip:</strong> Focus on the process, not the outcome. Each stroke is a moment of
            presence. There's no right or wrong way to create.
          </p>
        </div>
      </div>
    </div>
  );
}

// -------------------------------
// 5) Enhanced Gratitude Journal
// -------------------------------
export function GratitudeJournal() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState(() => JSON.parse(localStorage.getItem("gratitude_entries") || "[]"));
  const [mood, setMood] = useState("😊");

  const moods = ["😊", "😌", "🥰", "✨", "🌟", "💚", "🙏"];

  useEffect(() => {
    localStorage.setItem("gratitude_entries", JSON.stringify(entries));
  }, [entries]);

  const add = () => {
    if (!text.trim()) {
      alert("Please write something you're grateful for ❤️");
      return;
    }
    const newEntry = {
      id: Date.now(),
      text: text.trim(),
      mood,
      when: new Date().toISOString(),
    };
    setEntries((e) => [newEntry, ...e]);
    setText("");
    setMood("😊");
  };

  const remove = (id) => {
    if (window.confirm("Remove this entry?")) {
      setEntries((e) => e.filter((x) => x.id !== id));
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%)",
        padding: "40px 20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          padding: 40,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1f2937", marginBottom: 8 }}>
            💛 Gratitude Journal
          </h1>
          <p style={{ color: "#6b7280", fontSize: 16 }}>
            Cultivate positivity by noting what you're thankful for
          </p>
        </div>

        {/* Input Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #fef3c7, #fef9c3)",
            padding: 24,
            borderRadius: 16,
            marginBottom: 32,
            border: "1px solid #fde68a",
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#92400e", marginBottom: 8, display: "block" }}>
              HOW ARE YOU FEELING?
            </label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {moods.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  style={{
                    fontSize: 32,
                    padding: 8,
                    borderRadius: 12,
                    border: mood === m ? "3px solid #f59e0b" : "2px solid #fde68a",
                    background: mood === m ? "#fef3c7" : "#fff",
                    cursor: "pointer",
                    transform: mood === m ? "scale(1.1)" : "scale(1)",
                    transition: "all 0.2s",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#92400e", marginBottom: 8, display: "block" }}>
              I'M GRATEFUL FOR...
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Even the smallest thing matters... a warm cup of tea, a kind word, the morning sun..."
              style={{
                width: "100%",
                minHeight: 100,
                padding: 16,
                borderRadius: 12,
                border: "2px solid #fde68a",
                fontSize: 15,
                fontFamily: "'Inter', sans-serif",
                resize: "vertical",
                background: "#fff",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={add}
              style={{
                flex: 1,
                padding: "14px 24px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
              }}
            >
              ✨ Save Entry
            </button>
            <button
              onClick={() => setText("")}
              style={{
                padding: "14px 24px",
                borderRadius: 12,
                border: "2px solid #fde68a",
                background: "#fff",
                color: "#92400e",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Entries List */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>
            Your Gratitude Collection ({entries.length})
          </div>

          {entries.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: 48,
                background: "#f9fafb",
                borderRadius: 16,
                border: "2px dashed #e5e7eb",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
              <p style={{ color: "#6b7280", margin: 0 }}>
                Your gratitude journey starts here. Write your first entry above!
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {entries.map((en) => (
                <motion.div
                  key={en.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: "#fff",
                    padding: 20,
                    borderRadius: 16,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{ fontSize: 32 }}>{en.mood}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, color: "#1f2937", lineHeight: 1.7, marginBottom: 8 }}>
                        {en.text}
                      </div>
                      <div style={{ fontSize: 13, color: "#9ca3af" }}>
                        {new Date(en.when).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(en.id)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "1px solid #fecaca",
                      background: "#fef2f2",
                      color: "#dc2626",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    🗑️ Remove
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// -------------------------------
// Enhanced Anxiety Spinner - Professional & Engaging
// -------------------------------
export function AnxietySpinner() {
  const categories = [
    { name: "Deep Breathing", icon: "🫁", color: "#60A5FA", tip: "4-7-8 technique: Breathe in for 4, hold for 7, out for 8" },
    { name: "Call Someone", icon: "📞", color: "#34D399", tip: "Reach out to a friend or family member" },
    { name: "Take a Walk", icon: "🚶", color: "#A78BFA", tip: "Even 5 minutes outside can reset your mind" },
    { name: "Hydrate", icon: "💧", color: "#22D3EE", tip: "Drink a full glass of water slowly" },
    { name: "Stretch", icon: "🧘", color: "#FB923C", tip: "Simple neck and shoulder rolls work wonders" },
    { name: "Journal", icon: "📝", color: "#F472B6", tip: "Write down 3 things you're grateful for" },
  ];

  const [angle, setAngle] = useState(0);
  const [selected, setSelected] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setSelected(null);
    setShowConfetti(false);
    
    const rounds = Math.floor(Math.random() * 3) + 5; // 5-7 full rotations
    const pick = Math.floor(Math.random() * categories.length);
    const segmentAngle = 360 / categories.length;
    const extraSpin = Math.random() * (segmentAngle * 0.8) + (segmentAngle * 0.1);
    const finalAngle = 360 * rounds + segmentAngle * pick + extraSpin;
    
    setAngle((a) => a + finalAngle);

    setTimeout(() => {
      const selectedCategory = categories[pick];
      setSelected(selectedCategory);
      setHistory(prev => [selectedCategory, ...prev.slice(0, 4)]);
      setStreak(prev => prev + 1);
      setSpinning(false);
      setShowConfetti(true);
      
      setTimeout(() => setShowConfetti(false), 2000);
    }, 3500);
  };

  const segmentAngle = 360 / categories.length;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        background: 'white',
        borderRadius: 24,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '32px 40px',
          color: 'white',
        }}>
          <h1 style={{ fontSize: 36, margin: 0, fontWeight: 700 }}>🎯 Mindful Moments Spinner</h1>
          <p style={{ margin: '8px 0 0 0', opacity: 0.95, fontSize: 16 }}>
            Take a spin and discover your next calming activity
          </p>
          
          {/* Streak Counter */}
          <div style={{
            marginTop: 16,
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)',
            padding: '8px 16px',
            borderRadius: 20,
            backdropFilter: 'blur(10px)',
          }}>
            🔥 {streak} spin{streak !== 1 ? 's' : ''} today
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: 40 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 40,
            alignItems: 'center',
          }}>
            {/* Spinner Wheel */}
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 320,
                height: 320,
                margin: '0 auto',
                position: 'relative',
              }}>
                {/* Outer glow ring */}
                <div style={{
                  position: 'absolute',
                  inset: -8,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  opacity: 0.3,
                  filter: 'blur(12px)',
                }} />
                
                {/* Wheel container */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    transform: `rotate(${angle}deg)`,
                    transition: spinning ? 'transform 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                  }}
                >
                  {/* Wheel segments */}
                  {categories.map((cat, i) => {
                    const rotation = segmentAngle * i;
                    return (
                      <div
                        key={i}
                        style={{
                          position: 'absolute',
                          width: '50%',
                          height: '50%',
                          left: '50%',
                          top: '50%',
                          transformOrigin: '0% 0%',
                          transform: `rotate(${rotation}deg)`,
                          clipPath: `polygon(0 0, 100% 0, 100% 100%)`,
                          background: cat.color,
                          border: '2px solid white',
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          left: '60%',
                          top: '20%',
                          transform: 'rotate(-45deg)',
                          fontSize: 32,
                        }}>
                          {cat.icon}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Center circle */}
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                  }}>
                    ✨
                  </div>
                </div>

                {/* Pointer */}
                <div style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: 36,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                  zIndex: 10,
                }}>
                  ▼
                </div>
              </div>

              {/* Confetti effect */}
              {showConfetti && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  animation: 'fadeOut 2s forwards',
                }}>
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: `${50 + Math.cos(i * 18 * Math.PI / 180) * 40}%`,
                        top: `${50 + Math.sin(i * 18 * Math.PI / 180) * 40}%`,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: categories[i % categories.length].color,
                        animation: `confetti ${1 + Math.random()}s ease-out forwards`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Panel */}
            <div>
              <button
                onClick={spin}
                disabled={spinning}
                style={{
                  width: '100%',
                  padding: '18px 32px',
                  fontSize: 20,
                  fontWeight: 700,
                  borderRadius: 16,
                  border: 'none',
                  background: spinning 
                    ? '#CBD5E1' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  cursor: spinning ? 'not-allowed' : 'pointer',
                  boxShadow: spinning ? 'none' : '0 8px 24px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease',
                  transform: spinning ? 'scale(0.98)' : 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  if (!spinning) e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  if (!spinning) e.target.style.transform = 'scale(1)';
                }}
              >
                {spinning ? '🎲 Spinning...' : '🎯 Spin the Wheel'}
              </button>

              {/* Selected Result */}
              {selected && (
                <div style={{
                  marginTop: 24,
                  padding: 24,
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${selected.color}22, ${selected.color}11)`,
                  border: `2px solid ${selected.color}`,
                  animation: 'slideIn 0.5s ease-out',
                }}>
                  <div style={{
                    fontSize: 48,
                    textAlign: 'center',
                    marginBottom: 8,
                  }}>
                    {selected.icon}
                  </div>
                  <h3 style={{
                    fontSize: 24,
                    fontWeight: 700,
                    margin: '0 0 8px 0',
                    textAlign: 'center',
                    color: '#1F2937',
                  }}>
                    {selected.name}
                  </h3>
                  <p style={{
                    margin: 0,
                    color: '#6B7280',
                    textAlign: 'center',
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}>
                    {selected.tip}
                  </p>
                </div>
              )}

              {/* History */}
              {history.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h4 style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#6B7280',
                    margin: '0 0 12px 0',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>
                    Recent Activities
                  </h4>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {history.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '6px 12px',
                          borderRadius: 20,
                          background: `${item.color}22`,
                          fontSize: 13,
                          color: '#374151',
                        }}
                      >
                        <span>{item.icon}</span>
                        <span style={{ fontWeight: 500 }}>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes confetti {
          to {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 + 100}px) rotate(${Math.random() * 360}deg);
            opacity: 0;
          }
        }
        
        @keyframes fadeOut {
          to { opacity: 0; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}


// -------------------------------
// 7) Enhanced Word Relax
// -------------------------------
export function WordRelax() {
  const calmingWords = [
    "calm", "breathe", "peace", "soft", "rest", "gentle",
    "still", "quiet", "serene", "ease", "flow", "balance",
  ];

  const [targetWord] = useState(() => calmingWords[Math.floor(Math.random() * calmingWords.length)]);
  const [letters, setLetters] = useState(() =>
    shuffle(targetWord.split("")).map((c, i) => ({ id: i + "-" + c + Math.random(), letter: c, used: false }))
  );
  const [built, setBuilt] = useState("");
  const [found, setFound] = useState([]);
  const [hint, setHint] = useState(false);

  const addLetter = (idx) => {
    setBuilt((b) => b + letters[idx].letter);
    setLetters((ls) => ls.map((l, i) => (i === idx ? { ...l, used: true } : l)));
  };

  const removeLast = () => {
    if (!built) return;
    const last = built.slice(-1);
    setBuilt((b) => b.slice(0, -1));
    for (let i = letters.length - 1; i >= 0; i--) {
      if (letters[i].letter === last && letters[i].used) {
        setLetters((ls) => ls.map((l, idx) => (idx === i ? { ...l, used: false } : l)));
        break;
      }
    }
  };

  const submit = () => {
    const word = built.toLowerCase();
    if (calmingWords.includes(word)) {
      if (!found.includes(word)) {
        setFound((f) => [...f, word]);
        setTimeout(() => {
          alert(`Beautiful! "${word}" is a calming word. You're doing great! 🌟`);
        }, 100);
      }
      setBuilt("");
      setLetters((ls) => ls.map((l) => ({ ...l, used: false })));
    } else {
      alert("Not quite a calming word. Try rearranging the letters! 💭");
    }
  };

  const reset = () => {
    const newWord = calmingWords[Math.floor(Math.random() * calmingWords.length)];
    setLetters(shuffle(newWord.split("")).map((c, i) => ({ id: i + "-" + c + Math.random(), letter: c, used: false })));
    setBuilt("");
    setFound([]);
    setHint(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)",
        padding: "40px 20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          padding: 40,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1f2937", marginBottom: 8 }}>
            🔤 Calming Word Builder
          </h1>
          <p style={{ color: "#6b7280", fontSize: 16 }}>
            Arrange letters to form peaceful, soothing words
          </p>
        </div>

        {/* Letters */}
        <div
          style={{
            background: "#f9fafb",
            padding: 24,
            borderRadius: 16,
            marginBottom: 24,
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", marginBottom: 16 }}>
            TAP LETTERS TO BUILD A WORD
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {letters.map((l, i) => (
              <motion.button
                key={l.id}
                onClick={() => !l.used && addLetter(i)}
                disabled={l.used}
                whileHover={{ scale: l.used ? 1 : 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: l.used ? "#e5e7eb" : "linear-gradient(135deg, #667eea, #764ba2)",
                  border: "none",
                  color: l.used ? "#9ca3af" : "#fff",
                  fontSize: 24,
                  fontWeight: 700,
                  cursor: l.used ? "not-allowed" : "pointer",
                  boxShadow: l.used ? "none" : "0 4px 12px rgba(102, 126, 234, 0.3)",
                }}
              >
                {l.letter}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Built Word Display */}
        <div
          style={{
            background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
            padding: 24,
            borderRadius: 16,
            marginBottom: 24,
            border: "2px solid #bfdbfe",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1e40af", marginBottom: 12 }}>
            YOUR WORD
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#1f2937", minHeight: 48, letterSpacing: 4 }}>
            {built || "..."}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <button
            onClick={submit}
            disabled={!built}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: 12,
              border: "none",
              background: built ? "linear-gradient(135deg, #10b981, #059669)" : "#e5e7eb",
              color: "#fff",
              fontWeight: 700,
              cursor: built ? "pointer" : "not-allowed",
              boxShadow: built ? "0 4px 12px rgba(16, 185, 129, 0.3)" : "none",
            }}
          >
            ✓ Submit
          </button>
          <button
            onClick={removeLast}
            disabled={!built}
            style={{
              padding: "14px 24px",
              borderRadius: 12,
              border: "2px solid #e5e7eb",
              background: "#fff",
              color: "#6b7280",
              fontWeight: 700,
              cursor: built ? "pointer" : "not-allowed",
            }}
          >
            ← Back
          </button>
          <button
            onClick={() => setHint(!hint)}
            style={{
              padding: "14px 24px",
              borderRadius: 12,
              border: "2px solid #fde68a",
              background: hint ? "#fef3c7" : "#fff",
              color: "#92400e",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            💡
          </button>
        </div>

        {hint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "#fef3c7",
              padding: 16,
              borderRadius: 12,
              border: "1px solid #fde68a",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            <div style={{ color: "#92400e", fontSize: 14 }}>
              💭 <strong>Hint:</strong> The word has {targetWord.length} letters and brings{" "}
              {targetWord === "calm" ? "stillness" : targetWord === "peace" ? "tranquility" : "serenity"}
            </div>
          </motion.div>
        )}

        {/* Found Words */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", marginBottom: 12 }}>
            WORDS DISCOVERED ({found.length})
          </div>
          {found.length === 0 ? (
            <div style={{ textAlign: "center", padding: 32, background: "#f9fafb", borderRadius: 12, color: "#9ca3af" }}>
              No words found yet. Keep trying! 🌟
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {found.map((f) => (
                <motion.div
                  key={f}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 20,
                    background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
                    border: "1px solid #6ee7b7",
                    color: "#065f46",
                    fontWeight: 700,
                  }}
                >
                  ✨ {f}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button
            onClick={reset}
            style={{
              padding: "12px 32px",
              borderRadius: 12,
              border: "2px solid #e5e7eb",
              background: "#fff",
              color: "#6b7280",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🔄 New Word
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EnhancedGamesBundle() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Enhanced Mental Wellness Games</h2>
      <p>Import any component: BreathingGame, MemoryMatch, BubblePop, ColorCalm, GratitudeJournal, AnxietySpinner, WordRelax</p>
    </div>
  );
}

