import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { auth, googleProvider, facebookProvider, signInWithPopup } from "./firebase";

// Inline styles as a style tag for animations
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .ca-root {
      min-height: 100vh;
      display: flex;
      font-family: 'DM Sans', sans-serif;
      background: #F7F5F2;
      position: relative;
      overflow: hidden;
    }

    /* Left panel */
    .ca-left {
      width: 42%;
      background: linear-gradient(160deg, #2D6A6A 0%, #1A4A4A 60%, #0F3333 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 3rem;
      position: relative;
      overflow: hidden;
    }

    .ca-left::before {
      content: '';
      position: absolute;
      top: -80px; right: -80px;
      width: 340px; height: 340px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
    }
    .ca-left::after {
      content: '';
      position: absolute;
      bottom: -60px; left: -60px;
      width: 260px; height: 260px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
    }

    .ca-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .ca-brand-icon {
      width: 40px; height: 40px;
      border-radius: 12px;
      background: rgba(255,255,255,0.15);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem;
    }

    .ca-brand-name {
      font-family: 'DM Serif Display', serif;
      color: #fff;
      font-size: 1.4rem;
      letter-spacing: -0.02em;
    }

    .ca-left-content {
      position: relative;
      z-index: 1;
    }

    .ca-tagline {
      font-family: 'DM Serif Display', serif;
      font-size: 2.5rem;
      color: #fff;
      line-height: 1.2;
      margin-bottom: 1.25rem;
      letter-spacing: -0.03em;
    }

    .ca-tagline em {
      font-style: italic;
      color: #A8D5C2;
    }

    .ca-desc {
      color: rgba(255,255,255,0.65);
      font-size: 0.95rem;
      line-height: 1.75;
      font-weight: 300;
      max-width: 300px;
    }

    .ca-testimonial {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 1.5rem;
      position: relative;
      z-index: 1;
    }

    .ca-testimonial-quote {
      color: rgba(255,255,255,0.85);
      font-size: 0.9rem;
      line-height: 1.7;
      font-weight: 300;
      margin-bottom: 1rem;
    }

    .ca-testimonial-author {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .ca-avatar {
      width: 38px; height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #A8D5C2, #6BAED6);
      display: flex; align-items: center; justify-content: center;
      font-weight: 600;
      color: #1A4A4A;
      font-size: 0.85rem;
    }

    .ca-author-name {
      color: #fff;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .ca-author-role {
      color: rgba(255,255,255,0.5);
      font-size: 0.75rem;
    }

    /* Right panel */
    .ca-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
    }

    .ca-form-container {
      width: 100%;
      max-width: 420px;
      animation: fadeUp 0.6s ease both;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .ca-form-header {
      margin-bottom: 2.25rem;
    }

    .ca-step-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #2D6A6A;
      margin-bottom: 0.6rem;
    }

    .ca-form-title {
      font-family: 'DM Serif Display', serif;
      font-size: 2.1rem;
      color: #1A2B2B;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 0.5rem;
    }

    .ca-form-sub {
      color: #7A8C8C;
      font-size: 0.9rem;
      font-weight: 300;
    }

    /* Form fields */
    .ca-field {
      margin-bottom: 1.25rem;
      position: relative;
    }

    .ca-label {
      display: block;
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #3D5555;
      margin-bottom: 0.5rem;
    }

    .ca-input-wrap {
      position: relative;
    }

    .ca-input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #8AABAB;
      font-size: 1rem;
      pointer-events: none;
    }

    .ca-input {
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

    .ca-input::placeholder { color: #A8BFBF; }

    .ca-input:focus {
      border-color: #2D6A6A;
      box-shadow: 0 0 0 4px rgba(45,106,106,0.1);
    }

    /* Strength bar */
    .ca-strength {
      display: flex;
      gap: 4px;
      margin-top: 0.5rem;
    }

    .ca-strength-bar {
      height: 3px;
      flex: 1;
      border-radius: 99px;
      background: #E5EDED;
      transition: background 0.3s;
    }

    .ca-strength-bar.weak { background: #E07070; }
    .ca-strength-bar.medium { background: #E0B870; }
    .ca-strength-bar.strong { background: #5BAD8B; }

    .ca-strength-label {
      font-size: 0.72rem;
      color: #8AABAB;
      margin-top: 0.3rem;
    }

    /* Submit button */
    .ca-btn-primary {
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
      transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
      letter-spacing: 0.01em;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .ca-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(45,106,106,0.35);
    }

    .ca-btn-primary:active { transform: translateY(0); }

    /* Divider */
    .ca-divider {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .ca-divider-line {
      flex: 1;
      height: 1px;
      background: #DDE5E5;
    }

    .ca-divider-text {
      font-size: 0.78rem;
      color: #8AABAB;
      font-weight: 500;
      white-space: nowrap;
    }

    /* OAuth buttons */
    .ca-oauth-row {
      display: flex;
      gap: 0.75rem;
    }

    .ca-oauth-btn {
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

    .ca-oauth-btn:hover {
      border-color: #2D6A6A;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      transform: translateY(-1px);
    }

    .ca-oauth-btn.facebook {
      background: #1877F2;
      border-color: #1877F2;
      color: #fff;
    }

    .ca-oauth-btn.facebook:hover {
      box-shadow: 0 4px 16px rgba(24,119,242,0.35);
      border-color: #1877F2;
    }

    /* Footer link */
    .ca-footer-link {
      text-align: center;
      margin-top: 1.75rem;
      font-size: 0.88rem;
      color: #7A8C8C;
    }

    .ca-footer-link span {
      color: #2D6A6A;
      font-weight: 600;
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    /* Decorative blob */
    .ca-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      pointer-events: none;
    }

    /* Privacy note */
    .ca-privacy {
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
      background: #EEF5F5;
      border-radius: 10px;
      padding: 0.75rem 1rem;
      margin-top: 1rem;
    }

    .ca-privacy-icon {
      font-size: 1rem;
      margin-top: 1px;
      flex-shrink: 0;
    }

    .ca-privacy-text {
      font-size: 0.78rem;
      color: #4A7070;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .ca-left { display: none; }
      .ca-right { padding: 2rem 1.5rem; }
    }
  `}</style>
);

function getPasswordStrength(password) {
  if (!password) return { level: 0, label: "", bars: [null, null, null] };
  const hasUpper = /[A-Z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = (password.length >= 8 ? 1 : 0) + (hasUpper ? 1 : 0) + (hasNum ? 1 : 0) + (hasSpecial ? 1 : 0);
  if (score <= 1) return { level: 1, label: "Weak", bars: ["weak", null, null] };
  if (score <= 2) return { level: 2, label: "Fair", bars: ["medium", "medium", null] };
  return { level: 3, label: "Strong", bars: ["strong", "strong", "strong"] };
}

function CreateAccount() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setUsername(""); setEmail(""); setPassword("");
  }, []);

  const strength = getPasswordStrength(password);

  const saveUser = (user) => {
    let users = JSON.parse(localStorage.getItem("users")) || {};
    users[user.email] = user;
    localStorage.setItem("users", JSON.stringify(users));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      Swal.fire("Error", "Please fill all fields", "error"); return;
    }
    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[email]) {
      Swal.fire({
        title: "Account already exists",
        text: "Would you like to sign in instead?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Go to Sign In",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#2D6A6A",
      }).then((r) => { if (r.isConfirmed) navigate("/signin"); });
      return;
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    saveUser({ username, email, password: hashedPassword, assessment: null, oauth: false });
    Swal.fire("Welcome aboard 🌿", "Your account has been created. Let's begin your journey.", "success").then(() => navigate("/signin"));
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      saveUser({ username: user.displayName || "Google User", email: user.email, displayName: user.displayName, oauth: true, assessment: null });
      Swal.fire("Welcome 🌿", `Good to see you, ${user.displayName}!`, "success");
      localStorage.setItem("loggedInUser", user.email);
      navigate("/");
    } catch (error) { Swal.fire("Error", error.message, "error"); }
  };

  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      saveUser({ username: user.displayName || "Facebook User", email: user.email, displayName: user.displayName, oauth: true, assessment: null });
      Swal.fire("Welcome 🌿", `Good to see you, ${user.displayName}!`, "success");
      localStorage.setItem("loggedInUser", user.email);
      navigate("/");
    } catch (error) { Swal.fire("Error", error.message, "error"); }
  };

  return (
    <>
      <GlobalStyle />
      <div className="ca-root">
        {/* Left Panel */}
        <div className="ca-left">
          <div className="ca-brand">
            <div className="ca-brand-icon">🌿</div>
            <span className="ca-brand-name">Serenity</span>
          </div>

          <div className="ca-left-content">
            <h2 className="ca-tagline">
              Your mind deserves<br /><em>gentle care.</em>
            </h2>
            <p className="ca-desc">
              Join thousands who are taking small, meaningful steps toward emotional balance and mental clarity — every single day.
            </p>
          </div>

          <div className="ca-testimonial">
            <p className="ca-testimonial-quote">
              "This app helped me understand my patterns and build habits that actually stick. I feel more in control of my mental health than ever before."
            </p>
            <div className="ca-testimonial-author">
              <div className="ca-avatar">SM</div>
              <div>
                <div className="ca-author-name">Sarah M.</div>
                <div className="ca-author-role">Member since 2024</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="ca-right">
          <div className="ca-form-container">
            <div className="ca-form-header">
              <div className="ca-step-label">Begin your journey</div>
              <h1 className="ca-form-title">Create your<br />account</h1>
              <p className="ca-form-sub">Free forever. No credit card required.</p>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off">
              {/* Name */}
              <div className="ca-field">
                <label className="ca-label">Full Name</label>
                <div className="ca-input-wrap">
                  <span className="ca-input-icon">👤</span>
                  <input
                    className="ca-input"
                    type="text"
                    placeholder="How should we call you?"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="ca-field">
                <label className="ca-label">Email Address</label>
                <div className="ca-input-wrap">
                  <span className="ca-input-icon">✉️</span>
                  <input
                    className="ca-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="ca-field">
                <label className="ca-label">Password</label>
                <div className="ca-input-wrap">
                  <span className="ca-input-icon">🔒</span>
                  <input
                    className="ca-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: "2.75rem" }}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute", right: "1rem", top: "50%",
                      transform: "translateY(-50%)", cursor: "pointer",
                      fontSize: "0.85rem", color: "#8AABAB", userSelect: "none"
                    }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>
                {password && (
                  <>
                    <div className="ca-strength">
                      {strength.bars.map((b, i) => (
                        <div key={i} className={`ca-strength-bar ${b || ""}`} />
                      ))}
                    </div>
                    <div className="ca-strength-label">{strength.label} password</div>
                  </>
                )}
              </div>

              <button type="submit" className="ca-btn-primary">
                <span>Create Account</span>
                <span>→</span>
              </button>
            </form>

            {/* Privacy note */}
            <div className="ca-privacy">
              <span className="ca-privacy-icon">🛡️</span>
              <span className="ca-privacy-text">
                Your data is private and encrypted. We never share your personal information or mental health records.
              </span>
            </div>

            <div className="ca-divider">
              <div className="ca-divider-line" />
              <span className="ca-divider-text">or continue with</span>
              <div className="ca-divider-line" />
            </div>

            <div className="ca-oauth-row">
              <button className="ca-oauth-btn" onClick={handleGoogleSignIn}>
                <FcGoogle size={20} />
                <span>Google</span>
              </button>
              <button className="ca-oauth-btn facebook" onClick={handleFacebookSignIn}>
                <FaFacebookF size={18} />
                <span>Facebook</span>
              </button>
            </div>

            <div className="ca-footer-link">
              Already have an account?{" "}
              <span onClick={() => navigate("/signin")}>Sign in</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateAccount;
