import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Frontpage from "./Frontpage";
import CreateAccount from "./pages/CreateAccount";
import SignIn from "./pages/SignIn";
import UserHome from "./pages/UserHome";
import Questions from "./pages/Questions";
import Profile from "./pages/Profile";
import Chatbot from "./pages/Chatbot";
import WhatsAppClone from "./pages/WhatsApp"; // <-- import the chat page
import NavigationButtons from "./NavigationButtons";

function App() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const loggedInEmail = localStorage.getItem("loggedInEmail");

  useEffect(() => {
    // Initialize Crisp
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "d034d27a-52bd-48c1-82be-a43ac9484f4e"; // Replace with your Crisp ID

    (function () {
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();

    // When Crisp script is loaded, set logged-in user
    const interval = setInterval(() => {
      if (window.$crisp) {
        clearInterval(interval);
        if (loggedInUser) {
          window.$crisp.push(["do", "session:reset"]); // clear old session
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
          <Route path="/" element={<Frontpage />} />
          <Route path="/createaccount" element={<CreateAccount />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/userhome" element={<UserHome />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<WhatsAppClone/>} /> {/* <-- added route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    
  );
}

export default App;
