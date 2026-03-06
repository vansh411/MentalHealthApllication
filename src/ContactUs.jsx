import React, { useState } from "react";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .cu-root {
      min-height: 100vh;
      font-family: 'DM Sans', sans-serif;
      background: #F7F5F2;
      color: #1A2B2B;
    }

    /* ── Hero ── */
    .cu-hero {
      background: linear-gradient(160deg, #2D6A6A 0%, #1A4A4A 60%, #0F3333 100%);
      padding: 5rem 2rem 6rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .cu-hero::before {
      content: '';
      position: absolute;
      top: -100px; right: -100px;
      width: 400px; height: 400px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
      pointer-events: none;
    }
    .cu-hero::after {
      content: '';
      position: absolute;
      bottom: -80px; left: -80px;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
      pointer-events: none;
    }

    .cu-brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 3rem;
    }
    .cu-brand-icon {
      width: 38px; height: 38px;
      border-radius: 11px;
      background: rgba(255,255,255,0.15);
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem;
    }
    .cu-brand-name {
      font-family: 'DM Serif Display', serif;
      color: #fff;
      font-size: 1.35rem;
      letter-spacing: -0.02em;
    }

    .cu-hero-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: #A8D5C2;
      margin-bottom: 0.75rem;
      position: relative; z-index: 1;
    }
    .cu-hero-title {
      font-family: 'DM Serif Display', serif;
      font-size: clamp(2.2rem, 5vw, 3.4rem);
      color: #fff;
      line-height: 1.15;
      letter-spacing: -0.03em;
      margin-bottom: 1rem;
      position: relative; z-index: 1;
    }
    .cu-hero-title em { font-style: italic; color: #A8D5C2; }
    .cu-hero-sub {
      color: rgba(255,255,255,0.6);
      font-size: 1rem;
      font-weight: 300;
      max-width: 480px;
      margin: 0 auto;
      line-height: 1.7;
      position: relative; z-index: 1;
    }

    /* ── Crisis banner ── */
    .cu-crisis {
      background: #A8D5C2;
      padding: 1rem 2rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .cu-crisis-text {
      font-size: 0.9rem;
      color: #0F3333;
      font-weight: 500;
    }
    .cu-crisis-number {
      font-family: 'DM Serif Display', serif;
      font-size: 1.05rem;
      color: #0F3333;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    /* ── Main layout ── */
    .cu-main {
      max-width: 1100px;
      margin: 0 auto;
      padding: 4rem 2rem;
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 3rem;
      align-items: start;
    }

    /* ── Contact cards ── */
    .cu-cards { display: flex; flex-direction: column; gap: 1rem; }

    .cu-section-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #2D6A6A;
      margin-bottom: 1.25rem;
    }

    .cu-card {
      background: #fff;
      border: 1.5px solid #E5EDED;
      border-radius: 16px;
      padding: 1.4rem 1.5rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
      cursor: default;
      animation: cuUp 0.5s ease both;
    }
    .cu-card:nth-child(1) { animation-delay: 0.05s; }
    .cu-card:nth-child(2) { animation-delay: 0.1s; }
    .cu-card:nth-child(3) { animation-delay: 0.15s; }
    .cu-card:nth-child(4) { animation-delay: 0.2s; }

    @keyframes cuUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .cu-card:hover {
      border-color: #2D6A6A;
      box-shadow: 0 6px 20px rgba(45,106,106,0.1);
      transform: translateY(-2px);
    }

    .cu-card-icon-wrap {
      width: 44px; height: 44px;
      border-radius: 12px;
      background: #EEF5F5;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }
    .cu-card-body { flex: 1; }
    .cu-card-title {
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #3D5555;
      margin-bottom: 0.25rem;
    }
    .cu-card-value {
      font-family: 'DM Serif Display', serif;
      font-size: 1.15rem;
      color: #1A2B2B;
      margin-bottom: 0.2rem;
    }
    .cu-card-note {
      font-size: 0.8rem;
      color: #8AABAB;
      font-weight: 300;
    }
    .cu-card-link {
      color: #2D6A6A;
      text-decoration: none;
      font-family: 'DM Serif Display', serif;
      font-size: 1.1rem;
    }
    .cu-card-link:hover { text-decoration: underline; }

    /* Hours table */
    .cu-hours {
      background: #fff;
      border: 1.5px solid #E5EDED;
      border-radius: 16px;
      padding: 1.4rem 1.5rem;
      margin-top: 1rem;
      animation: cuUp 0.5s 0.25s ease both;
    }
    .cu-hours-title {
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #3D5555;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .cu-hours-row {
      display: flex;
      justify-content: space-between;
      padding: 0.45rem 0;
      border-bottom: 1px solid #F0F5F5;
      font-size: 0.88rem;
    }
    .cu-hours-row:last-child { border-bottom: none; }
    .cu-hours-day { color: #5A7A7A; font-weight: 400; }
    .cu-hours-time { color: #1A2B2B; font-weight: 500; }
    .cu-hours-time.closed { color: #B0C4C4; }

    /* ── Contact form ── */
    .cu-form-card {
      background: #fff;
      border: 1.5px solid #E5EDED;
      border-radius: 20px;
      padding: 2.5rem 2rem;
      animation: cuUp 0.5s 0.1s ease both;
    }

    .cu-form-title {
      font-family: 'DM Serif Display', serif;
      font-size: 1.8rem;
      color: #1A2B2B;
      letter-spacing: -0.02em;
      margin-bottom: 0.4rem;
    }
    .cu-form-sub {
      font-size: 0.88rem;
      color: #7A8C8C;
      font-weight: 300;
      margin-bottom: 1.75rem;
      line-height: 1.6;
    }

    .cu-field { margin-bottom: 1.1rem; }
    .cu-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.09em;
      color: #3D5555;
      margin-bottom: 0.45rem;
    }
    .cu-input-wrap { position: relative; }
    .cu-input-icon {
      position: absolute;
      left: 0.9rem; top: 50%;
      transform: translateY(-50%);
      color: #8AABAB;
      pointer-events: none;
    }
    .cu-input, .cu-select, .cu-textarea {
      width: 100%;
      padding: 0.8rem 1rem 0.8rem 2.6rem;
      border: 1.5px solid #DDE5E5;
      border-radius: 11px;
      background: #F7F5F2;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.92rem;
      color: #1A2B2B;
      outline: none;
      transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    }
    .cu-select { appearance: none; cursor: pointer; }
    .cu-textarea {
      padding: 0.8rem 1rem;
      resize: vertical;
      min-height: 120px;
      line-height: 1.6;
    }
    .cu-input::placeholder,
    .cu-textarea::placeholder { color: #A8BFBF; }
    .cu-input:focus,
    .cu-select:focus,
    .cu-textarea:focus {
      border-color: #2D6A6A;
      background: #fff;
      box-shadow: 0 0 0 4px rgba(45,106,106,0.1);
    }

    .cu-field-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .cu-btn-primary {
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
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .cu-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(45,106,106,0.35);
    }
    .cu-btn-primary:active { transform: translateY(0); }

    /* Success state */
    .cu-success {
      text-align: center;
      padding: 2rem 1rem;
      animation: cuUp 0.4s ease both;
    }
    .cu-success-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .cu-success-title {
      font-family: 'DM Serif Display', serif;
      font-size: 1.6rem;
      color: #1A2B2B;
      margin-bottom: 0.5rem;
    }
    .cu-success-text {
      color: #7A8C8C;
      font-size: 0.9rem;
      line-height: 1.7;
    }

    /* Privacy note */
    .cu-privacy {
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
      background: #EEF5F5;
      border-radius: 10px;
      padding: 0.7rem 0.9rem;
      margin-top: 0.75rem;
    }
    .cu-privacy-text {
      font-size: 0.76rem;
      color: #4A7070;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .cu-main { grid-template-columns: 1fr; gap: 2rem; }
      .cu-field-row { grid-template-columns: 1fr; }
    }
  `}</style>
);

const TOPICS = [
  "General Inquiry",
  "Technical Support",
  "Account & Billing",
  "Mental Health Resources",
  "Crisis Support",
  "Partnership",
  "Feedback",
  "Other",
];

function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <>
      <GlobalStyle />
      <div className="cu-root">

        {/* ── Hero ── */}
        <div className="cu-hero">
          <div className="cu-brand">
            <div className="cu-brand-icon">🌿</div>
            <span className="cu-brand-name">Serenity</span>
          </div>
          <div className="cu-hero-label">We're here for you</div>
          <h1 className="cu-hero-title">Get in <em>touch</em></h1>
          <p className="cu-hero-sub">
            Whether you have a question, need support, or just want to share your experience — our team is ready to listen.
          </p>
        </div>

        {/* ── Crisis banner ── */}
        <div className="cu-crisis">
          <span className="cu-crisis-text">🆘 In crisis? Reach our 24/7 helpline:</span>
          <span className="cu-crisis-number">1-800-SERENITY (1-800-737-3648)</span>
          <span className="cu-crisis-text">· Free · Confidential · Always available</span>
        </div>

        {/* ── Main ── */}
        <div className="cu-main">

          {/* Left — contact info */}
          <div>
            <div className="cu-section-label">Contact Information</div>
            <div className="cu-cards">

              <div className="cu-card">
                <div className="cu-card-icon-wrap">📞</div>
                <div className="cu-card-body">
                  <div className="cu-card-title">Toll-Free Number</div>
                  <a className="cu-card-link" href="tel:18007373648">1-800-737-3648</a>
                  <div className="cu-card-note">No charge from any US phone</div>
                </div>
              </div>

              <div className="cu-card">
                <div className="cu-card-icon-wrap">✉️</div>
                <div className="cu-card-body">
                  <div className="cu-card-title">Email Support</div>
                  <a className="cu-card-link" href="mailto:support@serenity.com">support@serenity.com</a>
                  <div className="cu-card-note">Response within 24 hours</div>
                </div>
              </div>

              <div className="cu-card">
                <div className="cu-card-icon-wrap">💬</div>
                <div className="cu-card-body">
                  <div className="cu-card-title">Live Chat</div>
                  <div className="cu-card-value">Available in-app</div>
                  <div className="cu-card-note">Mon – Fri, 9 AM – 9 PM EST</div>
                </div>
              </div>

              <div className="cu-card">
                <div className="cu-card-icon-wrap">📍</div>
                <div className="cu-card-body">
                  <div className="cu-card-title">Head Office</div>
                  <div className="cu-card-value">New York, NY</div>
                  <div className="cu-card-note">123 Wellness Ave, Suite 400</div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="cu-hours">
              <div className="cu-hours-title">🕐 Support Hours</div>
              {[
                ["Monday – Friday", "8:00 AM – 10:00 PM EST"],
                ["Saturday", "9:00 AM – 6:00 PM EST"],
                ["Sunday", "10:00 AM – 4:00 PM EST"],
                ["Crisis Line", "24 / 7 Always open"],
              ].map(([day, time]) => (
                <div className="cu-hours-row" key={day}>
                  <span className="cu-hours-day">{day}</span>
                  <span className={`cu-hours-time${time === "Closed" ? " closed" : ""}`}>{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="cu-form-card">
            {submitted ? (
              <div className="cu-success">
                <div className="cu-success-icon">🌿</div>
                <div className="cu-success-title">Message received</div>
                <p className="cu-success-text">
                  Thank you, {form.name.split(" ")[0]}. Our team will get back to you at <strong>{form.email}</strong> within 24 hours. Take care of yourself in the meantime.
                </p>
              </div>
            ) : (
              <>
                <div className="cu-form-title">Send us a message</div>
                <p className="cu-form-sub">
                  Fill in the form below and we'll get back to you as soon as possible. All conversations are strictly confidential.
                </p>

                <form onSubmit={handleSubmit} autoComplete="off">

                  <div className="cu-field-row">
                    <div className="cu-field">
                      <label className="cu-label">Full Name</label>
                      <div className="cu-input-wrap">
                        <span className="cu-input-icon">👤</span>
                        <input className="cu-input" name="name" placeholder="Jane Doe"
                          value={form.name} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="cu-field">
                      <label className="cu-label">Email Address</label>
                      <div className="cu-input-wrap">
                        <span className="cu-input-icon">✉️</span>
                        <input className="cu-input" name="email" type="email" placeholder="you@example.com"
                          value={form.email} onChange={handleChange} required />
                      </div>
                    </div>
                  </div>

                  <div className="cu-field">
                    <label className="cu-label">Topic</label>
                    <div className="cu-input-wrap">
                      <span className="cu-input-icon">🗂</span>
                      <select className="cu-select" name="topic" value={form.topic} onChange={handleChange} style={{ paddingLeft: "2.6rem" }}>
                        <option value="">Select a topic...</option>
                        {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="cu-field">
                    <label className="cu-label">Your Message</label>
                    <textarea
                      className="cu-textarea"
                      name="message"
                      placeholder="Share what's on your mind. We're listening..."
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="cu-btn-primary">
                    <span>Send Message</span>
                    <span>→</span>
                  </button>
                </form>

                <div className="cu-privacy">
                  <span>🛡️</span>
                  <span className="cu-privacy-text">
                    Your message is private and secure. We never share your personal information or the contents of your inquiry with third parties.
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

export default ContactUs;
