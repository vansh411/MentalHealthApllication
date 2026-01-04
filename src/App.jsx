import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Frontpage from "./Frontpage";
import CreateAccount from "./pages/CreateAccount";
import SignIn from "./pages/SignIn";
import UserHome from "./pages/UserHome";
import Questions from "./pages/Questions";
import Profile from "./pages/Profile";
import WhatsAppClone from "./pages/WhatsApp";

// Games
import {
  BreathingGame,
  MemoryMatch,
  BubblePop,
  ColorCalm,
  GratitudeJournal,
  AnxietySpinner,
  WordRelax,
} from "./MenatlHealthGames";

function App() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const loggedInEmail = localStorage.getItem("loggedInEmail");

  useEffect(() => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "d034d27a-52bd-48c1-82be-a43ac9484f4e";

    (function () {
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();

    const interval = setInterval(() => {
      if (window.$crisp) {
        clearInterval(interval);
        if (loggedInUser) {
          window.$crisp.push(["do", "session:reset"]);
          window.$crisp.push(["set", "user:nickname", [loggedInUser]]);
          if (loggedInEmail) {
            window.$crisp.push(["set", "user:email", [loggedInEmail]]);
          }
        }
      }
    }, 100);
  }, [loggedInUser, loggedInEmail]);

  return (
    <div>
      <Routes>
        {/* Main pages */}
        <Route path="/" element={<Frontpage />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/userhome" element={<UserHome />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<WhatsAppClone />} />

        {/* Games */}
        <Route path="/games" element={<div style={{ padding: 20 }}>Select a game from the menu.</div>} />
        <Route path="/game-breathing" element={<BreathingGame />} />
        <Route path="/game-memory" element={<MemoryMatch />} />
        <Route path="/game-bubble" element={<BubblePop />} />
        <Route path="/game-color" element={<ColorCalm />} />
        <Route path="/game-gratitude" element={<GratitudeJournal />} />
        <Route path="/game-spinner" element={<AnxietySpinner />} />
        <Route path="/game-word" element={<WordRelax />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
