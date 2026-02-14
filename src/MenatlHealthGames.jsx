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

