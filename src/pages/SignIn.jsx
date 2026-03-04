import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .si-root {
      min-height: 100vh;
      display: flex;
      font-family: 'DM Sans', sans-serif;
      background: #F7F5F2;
    }

    /* ── Left panel ── */
    .si-left {
      width: 42%;
      background: linear-gradient(160deg, #2D6A6A 0%, #1A4A4A 60%, #0F3333 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 3rem;
      position: relative;
      overflow: hidden;
    }

    .si-left::before {
      content: '';
      position: absolute;
      top: -80px; right: -80px;
      width: 340px; height: 340px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
      pointer-events: none;
    }
    .si-left::after {
      content: '';
      position: absolute;
      bottom: -60px; left: -60px;
      width: 260px; height: 260px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
      pointer-events: none;
    }

    .si-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }
    .si-brand-icon {
      width: 40px; height: 40px;
      border-radius: 12px;
      background: rgba(255,255,255,0.15);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem;
    }
    .si-brand-name {
      font-family: 'DM Serif Display', serif;
      color: #fff;
      font-size: 1.4rem;
      letter-spacing: -0.02em;
    }

    .si-left-mid {
      position: relative;
      z-index: 1;
    }

    .si-tagline {
      font-family: 'DM Serif Display', serif;
      font-size: 2.5rem;
      color: #fff;
      line-height: 1.2;
      margin-bottom: 1.25rem;
      letter-spacing: -0.03em;
    }
    .si-tagline em {
      font-style: italic;
      color: #A8D5C2;
    }
    .si-desc {
      color: rgba(255,255,255,0.6);
      font-size: 0.95rem;
      line-height: 1.75;
      font-weight: 300;
      max-width: 300px;
    }

    /* stat pills */
    .si-stats {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      position: relative;
      z-index: 1;
    }
    .si-stat-pill {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 0.9rem 1.2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .si-stat-icon {
      font-size: 1.4rem;
      flex-shrink: 0;
    }
    .si-stat-value {
      font-family: 'DM Serif Display', serif;
      color: #fff;
      font-size: 1.1rem;
    }
    .si-stat-label {
      color: rgba(255,255,255,0.5);
      font-size: 0.78rem;
      margin-top: 1px;
    }

    /* ── Right panel ── */
    .si-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
    }

    .si-form-container {
      width: 100%;
      max-width: 420px;
      animation: siUp 0.55s cubic-bezier(.22,.68,0,1.2) both;
    }

    @keyframes siUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .si-form-header { margin-bottom: 2.25rem; }

    .si-step-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #2D6A6A;
      margin-bottom: 0.6rem;
    }
    .si-form-title {
      font-family: 'DM Serif Display', serif;
      font-size: 2.1rem;
      color: #1A2B2B;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 0.5rem;
    }
    .si-form-sub {
      color: #7A8C8C;
      font-size: 0.9rem;
      font-weight: 300;
    }

    /* Fields */
    .si-field { margin-bottom: 1.25rem; }

    .si-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .si-label {
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #3D5555;
    }
    .si-forgot {
      font-size: 0.78rem;
      color: #2D6A6A;
      font-weight: 500;
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 3px;
      background: none;
      border: none;
      padding: 0;
      font-family: 'DM Sans', sans-serif;
    }
    .si-forgot:hover { color: #1A4A4A; }

    .si-input-wrap { position: relative; }
    .si-input-icon {
      position: absolute;
      left: 1rem; top: 50%;
      transform: translateY(-50%);
      color: #8AABAB;
      font-size: 1rem;
      pointer-events: none;
    }
    .si-input {
      width: 100%;
      padding: 0.85rem 1rem 0.85rem 2.75rem;
      border: 1.5px solid #DDE5E5;
      border-radius: 12px;
      background: #fff;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
      color: #1A2B2B;
      outline: none;
      transition: border-color 0.25s, box-shadow 0.25s;
    }
    .si-input::placeholder { color: #A8BFBF; }
    .si-input:focus {
      border-color: #2D6A6A;
      box-shadow: 0 0 0 4px rgba(45,106,106,0.1);
    }
    .si-toggle {
      position: absolute;
      right: 1rem; top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      font-size: 0.8rem;
      color: #8AABAB;
      font-weight: 500;
      background: none;
      border: none;
      padding: 0;
      font-family: 'DM Sans', sans-serif;
    }
    .si-toggle:hover { color: #2D6A6A; }

    /* Submit */
    .si-btn-primary {
      width: 100%;
      padding: 0.95rem;
      background: linear-gradient(135deg, #2D6A6A, #1A4A4A);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      letter-spacing: 0.01em;
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .si-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(45,106,106,0.35);
    }
    .si-btn-primary:active { transform: translateY(0); }

    /* Remember me */
    .si-remember {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-top: 1rem;
    }
    .si-checkbox {
      width: 16px; height: 16px;
      border-radius: 5px;
      border: 1.5px solid #DDE5E5;
      accent-color: #2D6A6A;
      cursor: pointer;
    }
    .si-remember-label {
      font-size: 0.83rem;
      color: #7A8C8C;
      cursor: pointer;
      user-select: none;
    }

    /* Divider */
    .si-divider {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 1.5rem 0;
    }
    .si-divider-line { flex: 1; height: 1px; background: #DDE5E5; }
    .si-divider-text {
      font-size: 0.78rem;
      color: #8AABAB;
      font-weight: 500;
      white-space: nowrap;
    }

    /* OAuth */
    .si-oauth-row { display: flex; gap: 0.75rem; }
    .si-oauth-btn {
      flex: 1;
      padding: 0.75rem;
      border-radius: 12px;
      border: 1.5px solid #DDE5E5;
      background: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.88rem;
      font-weight: 500;
      color: #3D5555;
      transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    }
    .si-oauth-btn:hover {
      border-color: #2D6A6A;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      transform: translateY(-1px);
    }
    .si-oauth-btn.facebook {
      background: #1877F2;
      border-color: #1877F2;
      color: #fff;
    }
    .si-oauth-btn.facebook:hover {
      box-shadow: 0 4px 16px rgba(24,119,242,0.35);
    }

    /* Footer */
    .si-footer-link {
      text-align: center;
      margin-top: 1.75rem;
      font-size: 0.88rem;
      color: #7A8C8C;
    }
    .si-footer-link span {
      color: #2D6A6A;
      font-weight: 600;
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    /* Error shake */
    .si-input.error {
      border-color: #E07070;
      box-shadow: 0 0 0 4px rgba(224,112,112,0.12);
      animation: shake 0.35s ease;
    }
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }

    @media (max-width: 768px) {
      .si-left { display: none; }
      .si-right { padding: 2rem 1.5rem; }
    }
  `}</style>
);

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [remember, setRemember]   = useState(false);
  const [emailErr, setEmailErr]   = useState(false);
  const [pwErr, setPwErr]         = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setEmailErr(false); setPwErr(false);

    const users = JSON.parse(localStorage.getItem("users")) || {};
    const user  = users[email];

    if (!user) {
      setEmailErr(true);
      Swal.fire({
        icon: "error",
        title: "Account not found",
        text: "We couldn't find an account with that email.",
        confirmButtonColor: "#2D6A6A",
      });
      return;
    }

    if (user.oauth) {
      localStorage.setItem("loggedInUser", email);
      navigate(user.assessment ? "/userhome" : "/");
      return;
    }

    if (!user.password) {
      Swal.fire({
        icon: "warning",
        title: "Password missing",
        text: "Please reset your account to continue.",
        confirmButtonColor: "#2D6A6A",
      });
      return;
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      setPwErr(true);
      Swal.fire({
        icon: "error",
        title: "Incorrect password",
        text: "That password doesn't match. Please try again.",
        confirmButtonColor: "#2D6A6A",
      });
      return;
    }

    if (remember) localStorage.setItem("rememberedEmail", email);
    localStorage.setItem("loggedInUser", email);
    navigate(user.assessment ? "/userhome" : "/");
  };

  return (
    <>
      <GlobalStyle />
      <div className="si-root">

        {/* ── Left panel ── */}
        <div className="si-left">
          <div className="si-brand">
            <div className="si-brand-icon">🌿</div>
            <span className="si-brand-name">Serenity</span>
          </div>

          <div className="si-left-mid">
            <h2 className="si-tagline">
              Welcome<br /><em>back.</em>
            </h2>
            <p className="si-desc">
              Your wellbeing journey continues here. Every day you show up is a step forward — we're glad you're back.
            </p>
          </div>

          <div className="si-stats">
            <div className="si-stat-pill">
              <span className="si-stat-icon">🧘</span>
              <div>
                <div className="si-stat-value">24,000+</div>
                <div className="si-stat-label">Daily active members</div>
              </div>
            </div>
            <div className="si-stat-pill">
              <span className="si-stat-icon">⭐</span>
              <div>
                <div className="si-stat-value">4.9 / 5</div>
                <div className="si-stat-label">Average member rating</div>
              </div>
            </div>
            <div className="si-stat-pill">
              <span className="si-stat-icon">🔒</span>
              <div>
                <div className="si-stat-value">100% Private</div>
                <div className="si-stat-label">Your data is always yours</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="si-right">
          <div className="si-form-container">
            <div className="si-form-header">
              <div className="si-step-label">Welcome back</div>
              <h1 className="si-form-title">Sign in to<br />your account</h1>
              <p className="si-form-sub">Continue where you left off.</p>
            </div>

            <form onSubmit={handleLogin} autoComplete="off">

              {/* Email */}
              <div className="si-field">
                <div className="si-label-row">
                  <label className="si-label">Email Address</label>
                </div>
                <div className="si-input-wrap">
                  <span className="si-input-icon">✉️</span>
                  <input
                    className={`si-input${emailErr ? " error" : ""}`}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailErr(false); }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="si-field">
                <div className="si-label-row">
                  <label className="si-label">Password</label>
                  <button type="button" className="si-forgot">Forgot password?</button>
                </div>
                <div className="si-input-wrap">
                  <span className="si-input-icon">🔒</span>
                  <input
                    className={`si-input${pwErr ? " error" : ""}`}
                    type={showPw ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPwErr(false); }}
                    style={{ paddingRight: "3.5rem" }}
                  />
                  <button
                    type="button"
                    className="si-toggle"
                    onClick={() => setShowPw(!showPw)}
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="si-remember">
                <input
                  type="checkbox"
                  className="si-checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="si-remember-label">Remember me for 30 days</span>
              </label>

              <button type="submit" className="si-btn-primary" style={{ marginTop: "1.25rem" }}>
                <span>Sign In</span>
                <span>→</span>
              </button>
            </form>

            <div className="si-divider">
              <div className="si-divider-line" />
              <span className="si-divider-text">or continue with</span>
              <div className="si-divider-line" />
            </div>

            <div className="si-oauth-row">
              <button className="si-oauth-btn">
                <span style={{ fontSize: "1.2rem" }}>G</span>
                <span>Google</span>
              </button>
              <button className="si-oauth-btn facebook">
                <span style={{ fontSize: "1rem", fontWeight: 700 }}>f</span>
                <span>Facebook</span>
              </button>
            </div>

            <div className="si-footer-link">
              Don't have an account?{" "}
              <span onClick={() => navigate("/createaccount")}>Create one free</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default SignIn;
