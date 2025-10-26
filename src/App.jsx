import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Frontpage from "./Frontpage";
import CreateAccount from "./pages/CreateAccount";
import SignIn from "./pages/SignIn";
import UserHome from "./pages/UserHome";
import Questions from "./pages/Questions";
import Profile from "./pages/Profile";
import Chatbot from "./pages/Chatbot";
import NavigationButtons from "./NavigationButtons";
function App() {
  return (
    
     <div >
      
     <Chatbot/>
      <Routes>
         
        <Route path="/" element={<Frontpage />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/userhome" element={<UserHome />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
   </div> 
  );
}

export default App;
