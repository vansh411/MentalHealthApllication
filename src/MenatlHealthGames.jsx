import React, { useEffect, useRef, useState } from "react";

/*
  Full-logic mini-game collection

  Exported components (one-file bundle you can import from):
   - BreathingGame
   - MemoryMatch
   - BubblePop
   - ColorCalm
   - GratitudeJournal
   - AnxietySpinner
   - WordRelax

  Notes:
  - All games are dependency-free and use only React + browser APIs.
  - Where appropriate, games persist light state to localStorage (gratitude, color drawing image).
  - Feel free to split components into separate files after verifying behavior.
*/

// -------------------------------
// Helpers
// -------------------------------
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// -------------------------------
// 1) BreathingGame
// -------------------------------
export function BreathingGame() {
  // phases: inhale (4s), hold (2s), exhale (6s) - adjustable
  const cycle = [
    { name: "Inhale", seconds: 4 },
    { name: "Hold", seconds: 2 },
    { name: "Exhale", seconds: 6 },
  ];

  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(cycle[0].seconds);

  useEffect(() => {
    let timer;
    if (running) {
      timer = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            // move to next phase
            setPhaseIdx((p) => (p + 1) % cycle.length);
            return cycle[(phaseIdx + 1) % cycle.length].seconds;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phaseIdx]);

  useEffect(() => {
    // keep timeLeft synced when phase changes
    setTimeLeft(cycle[phaseIdx].seconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseIdx]);

  // size mapping: Inhale expands, Exhale contracts, Hold stable
  const sizeForPhase = (name) => {
    if (name === "Inhale") return 260;
    if (name === "Hold") return 240;
    return 140; // Exhale
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", padding: 20 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Breathing Exercise</h1>
      <p style={{ color: "#555" }}>
        Follow the guidance below. Try to breathe smoothly — inhale, hold, then exhale.
      </p>

      <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 18 }}>
        <div style={{ flex: 1 }}>
          <div
            aria-live="polite"
            style={{
              width: sizeForPhase(cycle[phaseIdx].name),
              height: sizeForPhase(cycle[phaseIdx].name),
              borderRadius: "50%",
              margin: "0 auto",
              transition: "width 800ms ease, height 800ms ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "radial-gradient(circle at 30% 30%, #D6F6FF, #81D4FA)",
              boxShadow: "0 14px 40px rgba(8, 88, 138, 0.12)",
              color: "#04395E",
              fontWeight: 700,
            }}
          >
            {cycle[phaseIdx].name}
          </div>
        </div>

        <div style={{ width: 260 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{cycle[phaseIdx].name}</div>
          <div style={{ marginTop: 8, color: "#444" }}>Time left: {timeLeft}s</div>

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            {!running ? (
              <button className="btn btn-primary" onClick={() => setRunning(true)}>
                Start
              </button>
            ) : (
              <button className="btn btn-warning" onClick={() => setRunning(false)}>
                Pause
              </button>
            )}

            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setRunning(false);
                setPhaseIdx(0);
                setTimeLeft(cycle[0].seconds);
              }}
            >
              Reset
            </button>
          </div>

          <p style={{ marginTop: 12, color: "#666" }}>
            Tip: sit comfortably, place one hand on your abdomen and breathe slowly.
          </p>
        </div>
      </div>
    </div>
  );
}

// -------------------------------
// 2) MemoryMatch (full logic)
// -------------------------------
export function MemoryMatch() {
  const initialPairs = ["🐶", "🍎", "🌟", "🚗", "🎈", "🍩"];
  const [cards, setCards] = useState(() => shuffle([...initialPairs, ...initialPairs]));
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
        // hide after short delay
        setTimeout(() => setOpenIdx([]), 800);
      }
    }
  };

  const reset = () => {
    const shuffled = shuffle([...initialPairs, ...initialPairs]);
    setCards(shuffled);
    setOpenIdx([]);
    setMatched([]);
    setMoves(0);
    setStartTime(null);
    setElapsed(0);
  };

  const won = matched.length === cards.length && cards.length > 0;

  return (
    <div style={{ padding: 20, fontFamily: "Poppins, sans-serif" }}>
      <h1 style={{ fontSize: 26, marginBottom: 8 }}>Memory Match</h1>
      <p style={{ color: "#555" }}>Find all pairs. Moves: {moves} • Time: {elapsed}s</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 72px)", gap: 10, marginTop: 16 }}>
        {cards.map((c, i) => {
          const revealed = openIdx.includes(i) || matched.includes(i);
          return (
            <div
              key={i}
              onClick={() => flip(i)}
              style={{
                width: 72,
                height: 72,
                borderRadius: 8,
                background: revealed ? "#fff" : "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(2,6,23,0.06)",
                userSelect: "none",
              }}
            >
              {revealed ? c : "❓"}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
        <button className="btn btn-outline-primary" onClick={reset}>
          Reset
        </button>
        {won && <div className="alert alert-success">You won! Moves: {moves} • Time: {elapsed}s</div>}
      </div>
    </div>
  );
}

// -------------------------------
// 3) BubblePop (click floating bubbles to pop)
// -------------------------------
export function BubblePop() {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const containerRef = useRef(null);

  // spawn bubbles periodically
  useEffect(() => {
    const spawn = setInterval(() => {
      setBubbles((prev) => {
        const id = Date.now() + Math.random();
        const left = Math.random() * 80 + 5; // percent
        const size = Math.random() * 48 + 32; // px
        return [...prev, { id, left, size, popped: false }].slice(-12); // keep last 12
      });
    }, 900);
    return () => clearInterval(spawn);
  }, []);

  // remove popped bubbles after animation
  useEffect(() => {
    const t = setInterval(() => {
      setBubbles((prev) => prev.filter((b) => !b.popped));
    }, 1200);
    return () => clearInterval(t);
  }, []);

  const pop = (id) => {
    setBubbles((prev) => prev.map((b) => (b.id === id ? { ...b, popped: true } : b)));
    setScore((s) => s + 1);
  };

  return (
    <div style={{ padding: 18, fontFamily: "Poppins, sans-serif" }}>
      <h1 style={{ fontSize: 26 }}>Bubble Pop</h1>
      <p style={{ color: "#555" }}>Tap bubbles to pop and watch your stress go away!</p>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
        <div style={{ fontWeight: 700 }}>Score: {score}</div>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => {
            setBubbles([]);
            setScore(0);
          }}
        >
          Reset
        </button>
      </div>

      <div
        ref={containerRef}
        style={{
          marginTop: 16,
          height: 360,
          borderRadius: 12,
          background: "linear-gradient(180deg,#E6F7FF,#FFFFFF)",
          position: "relative",
          overflow: "hidden",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        {bubbles.map((b) => (
          <div
            key={b.id}
            onClick={() => pop(b.id)}
            style={{
              position: "absolute",
              left: `${b.left}%`,
              bottom: b.popped ? "-40px" : "-10px",
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              background: b.popped
                ? "radial-gradient(circle at 30% 30%, #FFD6E0,#FF9AA2)"
                : "radial-gradient(circle at 30% 30%, #D6ECFF,#89CFF0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: "#03435E",
              transform: b.popped ? "scale(0)" : "translateY(-280px)",
              transition: b.popped ? "transform 600ms ease, opacity 600ms" : "transform 6s linear",
              opacity: b.popped ? 0 : 1,
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(2,6,23,0.06)",
            }}
            aria-hidden={false}
          />
        ))}
      </div>
    </div>
  );
}

// -------------------------------
// 4) ColorCalm — simple drawing canvas
// -------------------------------
export function ColorCalm() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#6EE7B7");
  const [size, setSize] = useState(6);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 480;
    canvas.style.width = "100%";
    canvas.style.borderRadius = "12px";
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctxRef.current = ctx;

    // load saved image if available
    const saved = localStorage.getItem("colorcalm_image");
    if (saved) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = saved;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = size;
    }
  }, [color, size]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX || e.touches[0].clientX) - rect.left) * (canvasRef.current.width / rect.width),
      y: ((e.clientY || e.touches[0].clientY) - rect.top) * (canvasRef.current.height / rect.height),
    };
  };

  const start = (e) => {
    setDrawing(true);
    const { x, y } = getPos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const move = (e) => {
    if (!drawing) return;
    const { x, y } = getPos(e);
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const end = () => {
    setDrawing(false);
    ctxRef.current.closePath();
  };

  const clear = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  const save = () => {
    const data = canvasRef.current.toDataURL();
    localStorage.setItem("colorcalm_image", data);
    alert("Saved to local storage — you can clear or paint more.");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Poppins, sans-serif" }}>
      <h1 style={{ fontSize: 26 }}>Color Calm</h1>
      <p style={{ color: "#555" }}>Paint freely. Use this as a mindful, creative break.</p>

      <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            "#6EE7B7",
            "#93C5FD",
            "#FBCFE8",
            "#FDE68A",
            "#A78BFA",
            "#FCA5A5",
            "#111827",
          ].map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{ width: 28, height: 28, borderRadius: 6, background: c, border: color === c ? "2px solid #000" : "none" }}
            />
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ color: "#666" }}>Brush</label>
          <input type="range" min={1} max={40} value={size} onChange={(e) => setSize(Number(e.target.value))} />
        </div>

        <button className="btn btn-outline-secondary" onClick={clear}>
          Clear
        </button>
        <button className="btn btn-success" onClick={save}>
          Save
        </button>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
        style={{ marginTop: 12, width: "100%", border: "1px solid #E6EEF3" }}
      />
    </div>
  );
}

// -------------------------------
// 5) GratitudeJournal (full CRUD with localStorage)
// -------------------------------
export function GratitudeJournal() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState(() => JSON.parse(localStorage.getItem("gratitude_entries") || "[]"));

  useEffect(() => {
    localStorage.setItem("gratitude_entries", JSON.stringify(entries));
  }, [entries]);

  const add = () => {
    if (!text.trim()) return alert("Write at least one short line — even one word helps.");
    const newEntry = { id: Date.now(), text: text.trim(), when: new Date().toISOString() };
    setEntries((e) => [newEntry, ...e]);
    setText("");
  };

  const remove = (id) => setEntries((e) => e.filter((x) => x.id !== id));

  return (
    <div style={{ padding: 20, fontFamily: "Poppins, sans-serif" }}>
      <h1 style={{ fontSize: 26 }}>Gratitude Journal</h1>
      <p style={{ color: "#555" }}>Write one short thing you’re grateful for and save it.</p>

      <div style={{ marginTop: 12 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="One thing I'm grateful for..."
          style={{ width: "100%", minHeight: 80, padding: 8, borderRadius: 8 }}
        />
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button className="btn btn-primary" onClick={add}>
            Save
          </button>
          <button className="btn btn-outline-secondary" onClick={() => setText("")}>Clear</button>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        {entries.length === 0 ? (
          <div style={{ color: "#777" }}>No entries yet — try saving something small.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {entries.map((en) => (
              <div key={en.id} style={{ background: "#fff", padding: 10, borderRadius: 8, boxShadow: "0 6px 18px rgba(2,6,23,0.04)" }}>
                <div style={{ fontSize: 14, color: "#333" }}>{en.text}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>{new Date(en.when).toLocaleString()}</div>
                <div style={{ marginTop: 8 }}>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(en.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------
// 6) AnxietySpinner (wheel that picks categories)
// -------------------------------
export function AnxietySpinner() {
  const categories = ["Breath", "Call a friend", "Walk", "Hydrate", "Stretch", "Journal"];
  const [angle, setAngle] = useState(0);
  const [selected, setSelected] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const rounds = Math.floor(Math.random() * 4) + 4; // 4-7 rounds
    const pick = Math.floor(Math.random() * categories.length);
    const finalAngle = 360 * rounds + (360 / categories.length) * pick + Math.floor(Math.random() * (360 / categories.length));
    setAngle((a) => a + finalAngle);

    // reveal after animation
    setTimeout(() => {
      setSelected(categories[pick]);
      setSpinning(false);
    }, 3000);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Poppins, sans-serif" }}>
      <h1 style={{ fontSize: 26 }}>Anxiety Spinner</h1>
      <p style={{ color: "#555" }}>Spin for a quick coping suggestion.</p>

      <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 12 }}>
        <div style={{ width: 220, height: 220, position: "relative" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: "8px solid #EFF6FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `rotate(${angle}deg)`,
              transition: "transform 3s cubic-bezier(.17,.67,.45,1)",
            }}
          >
            {/* segments */}
            {categories.map((c, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: "50%",
                  height: "50%",
                  left: "50%",
                  top: "50%",
                  transformOrigin: "0% 0%",
                  transform: `rotate(${(360 / categories.length) * i}deg) translate(-50%, -50%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  paddingLeft: 12,
                  fontSize: 12,
                  color: "#05386B",
                }}
              >
                {c}
              </div>
            ))}
          </div>

          <div style={{ position: "absolute", left: "50%", top: -6, transform: "translateX(-50%)", fontSize: 18 }}>▼</div>
        </div>

        <div>
          <button className="btn btn-primary" onClick={spin} disabled={spinning}>
            {spinning ? "Spinning…" : "Spin"}
          </button>

          <div style={{ marginTop: 12, fontWeight: 700 }}>{selected ? `Suggestion: ${selected}` : "No suggestion yet"}</div>
          <div style={{ marginTop: 8, color: "#666" }}>Try it now — one small action can shift your state.</div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------
// 7) WordRelax — build calming words from letters
// -------------------------------
export function WordRelax() {
  const calmingWords = ["calm", "breathe", "peace", "soft", "rest", "gentle", "still", "quiet"];
  const pool = shuffle((calmingWords[Math.floor(Math.random() * calmingWords.length)] || "calm").split("")).map((c, i) => ({ id: i + "-" + c + Math.random(), letter: c }));

  const [letters, setLetters] = useState(pool);
  const [built, setBuilt] = useState("");
  const [found, setFound] = useState([]);

  const addLetter = (idx) => {
    setBuilt((b) => b + letters[idx].letter);
    setLetters((ls) => ls.map((l, i) => (i === idx ? { ...l, used: true } : l)));
  };

  const removeLast = () => {
    if (!built) return;
    const last = built.slice(-1);
    setBuilt((b) => b.slice(0, -1));
    // mark last unused (first matching used letter from end)
    for (let i = letters.length - 1; i >= 0; i--) {
      if (letters[i].letter === last && letters[i].used) {
        setLetters((ls) => ls.map((l, idx) => (idx === i ? { ...l, used: false } : l)));
        break;
      }
    }
  };

  const submit = () => {
    if (calmingWords.includes(built.toLowerCase())) {
      if (!found.includes(built.toLowerCase())) setFound((f) => [...f, built.toLowerCase()]);
      alert(`Nice — you formed "${built}"!`);
      setBuilt("");
      setLetters((ls) => ls.map((l) => ({ ...l, used: false })));
    } else {
      alert("Not recognized as a calming word — try another combination.");
    }
  };

  const reset = () => {
    const base = shuffle((calmingWords[Math.floor(Math.random() * calmingWords.length)]).split(""));
    setLetters(base.map((c, i) => ({ id: i + "-" + c + Math.random(), letter: c })));
    setBuilt("");
    setFound([]);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Poppins, sans-serif" }}>
      <h1 style={{ fontSize: 26 }}>Word Relax</h1>
      <p style={{ color: "#555" }}>Tap letters to build a calming word. Try to find words like "calm", "peace", or "rest".</p>

      <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {letters.map((l, i) => (
          <button
            key={l.id}
            onClick={() => !l.used && addLetter(i)}
            disabled={l.used}
            style={{ padding: "8px 12px", borderRadius: 8, background: l.used ? "#EDF2F7" : "#fff", border: "1px solid #E6EEF3", cursor: l.used ? "not-allowed" : "pointer" }}
          >
            {l.letter}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ minHeight: 36, fontSize: 18, fontWeight: 700 }}>{built || "(build a word)"}</div>
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button className="btn btn-primary" onClick={submit} disabled={!built}>
            Submit
          </button>
          <button className="btn btn-outline-secondary" onClick={removeLast} disabled={!built}>
            Remove Last
          </button>
          <button className="btn btn-sm btn-outline-primary" onClick={reset}>
            New Letters
          </button>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Found</div>
        <div style={{ marginTop: 6, color: "#333", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {found.length === 0 ? <span style={{ color: "#777" }}>(none yet)</span> : found.map((f) => <span key={f} style={{ background: "#E6F4EA", padding: "6px 8px", borderRadius: 8 }}>{f}</span>)}
        </div>
      </div>
    </div>
  );
}

// default export is optional — export a small landing helper if desired
export default function MiniGamesBundle() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20 }}>Mini-Games Bundle</h2>
      <p style={{ color: "#666" }}>Import any exported component directly into your routes (BreathingGame, MemoryMatch, BubblePop, ColorCalm, GratitudeJournal, AnxietySpinner, WordRelax).</p>
    </div>
  );
}
