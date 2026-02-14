import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Button, Row, Col, Card, Modal } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";

// ----------------------------------------
// Feature Card Component
// ----------------------------------------
function FeatureCard({ icon, title, text, delay, onClick, gradient }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card
        style={{
          background: gradient || "linear-gradient(135deg, #667eea15, #764ba215)",
          borderRadius: "20px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          padding: "2rem 1.5rem",
          textAlign: "center",
          border: "1px solid rgba(102, 126, 234, 0.1)",
          cursor: onClick ? "pointer" : "default",
          height: "100%",
          transition: "all 0.3s ease",
        }}
        onClick={onClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(102, 126, 234, 0.15)";
          e.currentTarget.style.borderColor = "rgba(102, 126, 234, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
          e.currentTarget.style.borderColor = "rgba(102, 126, 234, 0.1)";
        }}
      >
        <div
          style={{
            fontSize: "3.5rem",
            marginBottom: "1rem",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
          }}
        >
          {icon}
        </div>
        <Card.Body style={{ padding: "0.5rem 0" }}>
          <Card.Title
            style={{
              fontWeight: "700",
              color: "#1f2937",
              fontSize: "1.2rem",
              marginBottom: "0.8rem",
            }}
          >
            {title}
          </Card.Title>
          <Card.Text style={{ color: "#6b7280", fontSize: "0.95rem", lineHeight: 1.6 }}>
            {text}
          </Card.Text>
        </Card.Body>
      </Card>
    </motion.div>
  );
}

// ----------------------------------------
// Assessment Modal
// ----------------------------------------
function AssessmentModal({ show, handleClose, handleStart }) {
  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Body
        style={{
          padding: "3rem 2.5rem",
          borderRadius: "20px",
          textAlign: "center",
          background: "linear-gradient(135deg, #f0f9ff, #ffffff)",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "1rem" }}>📋</div>
        <h3 style={{ fontWeight: "800", marginBottom: "12px", color: "#1f2937", fontSize: "28px" }}>
          Ready to Begin Your Journey?
        </h3>
        <p style={{ color: "#6b7280", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem" }}>
          This brief assessment helps us understand your needs and provide personalized support. It takes just 5 minutes.
        </p>

        <div className="d-flex justify-content-center gap-3">
          <Button
            style={{
              padding: "14px 32px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #10b981, #059669)",
              fontWeight: "600",
              fontSize: "16px",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            }}
            onClick={handleStart}
          >
            ✨ Start Assessment
          </Button>

          <Button
            style={{
              padding: "14px 32px",
              borderRadius: "12px",
              background: "#f3f4f6",
              color: "#6b7280",
              fontWeight: "600",
              fontSize: "16px",
              border: "1px solid #e5e7eb",
            }}
            onClick={handleClose}
          >
            Maybe Later
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

// ----------------------------------------
// Chatbot Suggestion Modal
// ----------------------------------------
function ChatbotModal({ show, handleClose, handleChat }) {
  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Body
        style={{
          padding: "3rem 2.5rem",
          borderRadius: "20px",
          textAlign: "center",
          background: "linear-gradient(135deg, #eff6ff, #ffffff)",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "1rem" }}>💬</div>
        <h3 style={{ fontWeight: "800", marginBottom: "12px", color: "#1f2937", fontSize: "28px" }}>
          Need Someone to Talk To?
        </h3>
        <p style={{ color: "#6b7280", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem" }}>
          Our AI companion is here 24/7 to listen, support, and guide you through difficult moments. You're never alone.
        </p>

        <div className="d-flex justify-content-center gap-3">
          <Button
            style={{
              padding: "14px 32px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              fontWeight: "600",
              fontSize: "16px",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
            }}
            onClick={handleChat}
          >
            💭 Start Conversation
          </Button>

          <Button
            style={{
              padding: "14px 32px",
              borderRadius: "12px",
              background: "#f3f4f6",
              color: "#6b7280",
              fontWeight: "600",
              fontSize: "16px",
              border: "1px solid #e5e7eb",
            }}
            onClick={handleClose}
          >
            Not Now
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

// ----------------------------------------
// MAIN FRONT PAGE
// ----------------------------------------
function Frontpage() {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("loggedInUser");
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showChatbotModal, setShowChatbotModal] = useState(false);

  // Get initials
  let initials = "";
  if (loggedInUser && users[loggedInUser]) {
    const email = users[loggedInUser].email;
    initials = email
      .split("@")[0]
      .split(".")
      .map((part) => part[0].toUpperCase())
      .join("");
  }

  const openAssessmentModal = () => {
    if (!loggedInUser) return navigate("/signin");
    setShowAssessmentModal(true);
  };

  const handleStartAssessment = () => {
    setShowAssessmentModal(false);
    setShowChatbotModal(true);
  };

  const goToChatbot = () => {
    setShowChatbotModal(false);
    window.open("http://localhost:8501", "_blank");
    navigate("/questions");
  };

  // Quotes
  const quotes = [
    { text: "Your mental health is a priority, not a luxury.", emoji: "💙" },
    { text: "It's okay to not be okay — what matters is you're trying.", emoji: "🌱" },
    { text: "Healing takes time, but every step counts.", emoji: "✨" },
    { text: "You are not your thoughts. You are the observer of them.", emoji: "🧘" },
    { text: "Even the darkest night will end, and the sun will rise again.", emoji: "🌅" },
  ];
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentQuote((prev) => (prev + 1) % quotes.length), 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        background: "linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)",
        minHeight: "100vh",
        color: "#1f2937",
      }}
    >
      {/* Modern Navbar */}
      <Navbar
        expand="lg"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 999,
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
          padding: "1rem 0",
        }}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            style={{
              fontWeight: "800",
              fontSize: "1.8rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            🧠 MindCare
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav className="align-items-center">
              {!loggedInUser ? (
                <>
                  <Nav.Link
                    as={Link}
                    to="/signin"
                    style={{
                      color: "#6b7280",
                      fontWeight: "600",
                      marginRight: "12px",
                      padding: "8px 20px",
                    }}
                  >
                    Login
                  </Nav.Link>
                  <Button
                    as={Link}
                    to="/createaccount"
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px 24px",
                      fontWeight: "600",
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <div
                  onClick={() => navigate("/profile")}
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    borderRadius: "12px",
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "18px",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  {initials}
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* HERO SECTION */}
      <Container style={{ paddingTop: "60px", paddingBottom: "40px" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "28px",
              padding: "80px 60px",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(102, 126, 234, 0.25)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative circles */}
            <div
              style={{
                position: "absolute",
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -80,
                left: -80,
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.05)",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <h1
                style={{
                  fontWeight: "900",
                  fontSize: "3.5rem",
                  color: "#ffffff",
                  marginBottom: "20px",
                  lineHeight: 1.2,
                }}
              >
                Your Journey to
                <br />
                <span style={{ color: "#a5f3fc" }}>Mental Wellness</span> Starts Here
              </h1>
              <p
                style={{
                  fontSize: "1.3rem",
                  color: "rgba(255, 255, 255, 0.95)",
                  marginBottom: "40px",
                  maxWidth: "700px",
                  margin: "0 auto 40px",
                  lineHeight: 1.7,
                }}
              >
                A compassionate space for self-discovery, healing, and growth. Get personalized support, connect with peers, and build healthier habits.
              </p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <Button
                  onClick={openAssessmentModal}
                  style={{
                    padding: "16px 36px",
                    background: "#ffffff",
                    color: "#667eea",
                    border: "none",
                    borderRadius: "14px",
                    fontWeight: "700",
                    fontSize: "18px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  🎯 Start Your Assessment
                </Button>
                <Button
                  onClick={() => navigate("/chat")}
                  style={{
                    padding: "16px 36px",
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "#ffffff",
                    border: "2px solid rgba(255, 255, 255, 0.5)",
                    borderRadius: "14px",
                    fontWeight: "700",
                    fontSize: "18px",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  💬 Join Community
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rotating Quotes */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
              marginTop: "32px",
              padding: "28px 40px",
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              textAlign: "center",
              maxWidth: "800px",
              margin: "32px auto 0",
              border: "1px solid rgba(102, 126, 234, 0.1)",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>{quotes[currentQuote].emoji}</div>
            <p
              style={{
                fontSize: "1.2rem",
                fontStyle: "italic",
                color: "#374151",
                margin: 0,
                fontWeight: 500,
              }}
            >
              "{quotes[currentQuote].text}"
            </p>
          </motion.div>
        </AnimatePresence>
      </Container>

      {/* Stats Section */}
      <Container style={{ paddingTop: "40px", paddingBottom: "60px" }}>
        <Row className="g-4">
          {[
            { icon: "👥", number: "1000+", label: "Active Members" },
            { icon: "💬", number: "24/7", label: "AI Support" },
            { icon: "🎯", number: "95%", label: "Feel Better" },
            { icon: "🌟", number: "50+", label: "Wellness Tools" },
          ].map((stat, i) => (
            <Col md={3} key={i}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: "#ffffff",
                  padding: "30px",
                  borderRadius: "20px",
                  textAlign: "center",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(102, 126, 234, 0.1)",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>{stat.icon}</div>
                <div style={{ fontSize: "32px", fontWeight: "800", color: "#667eea", marginBottom: "4px" }}>
                  {stat.number}
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280", fontWeight: 600 }}>{stat.label}</div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* WELLNESS GAMES SECTION */}
      <Container style={{ paddingBottom: "80px" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2 style={{ fontWeight: "800", fontSize: "2.5rem", color: "#1f2937", marginBottom: "12px" }}>
            🎮 Interactive Wellness Games
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#6b7280", maxWidth: "600px", margin: "0 auto" }}>
            Engaging activities designed to calm your mind and lift your spirits
          </p>
        </div>

        <Row className="g-4">
          {[
            
            {
              icon: "🧠",
              title: "Memory Match",
              text: "Sharpen focus while enjoying a peaceful matching game",
              onClick: () => navigate("/game-memory"),
              gradient: "linear-gradient(135deg, #84fab015, #8fd3f415)",
            },
            {
              icon: "💛",
              title: "Gratitude Journal",
              text: "Daily prompts to cultivate positivity and thankfulness",
              onClick: () => navigate("/game-gratitude"),
              gradient: "linear-gradient(135deg, #ffeaa715, #ffcb0515)",
            },
            {
              icon: "🎯",
              title: "Anxiety Spinner",
              text: "Discover personalized coping strategies when you need them",
              onClick: () => navigate("/game-spinner"),
              gradient: "linear-gradient(135deg, #667eea15, #764ba215)",
            },
          ].map((game, i) => (
            <Col md={4} key={i}>
              <FeatureCard {...game} delay={i * 0.1} />
            </Col>
          ))}
        </Row>
      </Container>

      {/* EXTERNAL RESOURCES SECTION */}
      <Container style={{ paddingBottom: "80px" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2 style={{ fontWeight: "800", fontSize: "2.5rem", color: "#1f2937", marginBottom: "12px" }}>
            🌿 Curated Wellness Resources
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#6b7280", maxWidth: "600px", margin: "0 auto" }}>
            Trusted external tools and exercises to support your mental health journey
          </p>
        </div>

        <Row className="g-4">
          {[
            {
              icon: "🧘",
              title: "Calm Breathing",
              text: "Professional guided breathing exercises for immediate stress relief",
              onClick: () => window.open("https://calm.com/breathe", "_blank"),
              gradient: "linear-gradient(135deg, #d4fc7915, #99f2c815)",
            },
            {
              icon: "🌸",
              title: "MHA Stress Toolkit",
              text: "Evidence-based grounding techniques and mental wellness activities",
              onClick: () => window.open("https://screening.mhanational.org/stress-toolkits/", "_blank"),
              gradient: "linear-gradient(135deg, #fccb9015, #d57eeb15)",
            },
            {
              icon: "🎧",
              title: "A Soft Murmur",
              text: "Customize ambient sounds to create your perfect focus or relaxation mix",
              onClick: () => window.open("https://asoftmurmur.com/", "_blank"),
              gradient: "linear-gradient(135deg, #a1c4fd15, #c2e9fb15)",
            },
            {
              icon: "🌧️",
              title: "Rainy Mood",
              text: "Soothing rain sounds to help you relax, sleep, or concentrate",
              onClick: () => window.open("https://rainymood.com/", "_blank"),
              gradient: "linear-gradient(135deg, #89f7fe15, #66a6ff15)",
            },
          ].map((resource, i) => (
            <Col md={6} key={i}>
              <FeatureCard {...resource} delay={i * 0.1} />
            </Col>
          ))}
        </Row>
      </Container>

      {/* CTA Section */}
      <Container style={{ paddingBottom: "80px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
            borderRadius: "28px",
            padding: "60px 40px",
            textAlign: "center",
            border: "2px solid #86efac",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>💚</div>
          <h2 style={{ fontWeight: "800", fontSize: "2.2rem", color: "#1f2937", marginBottom: "16px" }}>
            You Don't Have to Face This Alone
          </h2>
          <p style={{ fontSize: "1.15rem", color: "#6b7280", marginBottom: "32px", maxWidth: "700px", margin: "0 auto 32px" }}>
            Join thousands who've found support, understanding, and hope through our community. Your mental health matters, and we're here for you every step of the way.
          </p>
          <Button
            onClick={openAssessmentModal}
            style={{
              padding: "16px 36px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              border: "none",
              borderRadius: "14px",
              fontWeight: "700",
              fontSize: "18px",
              color: "#ffffff",
              boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
            }}
          >
            Begin Your Journey Today
          </Button>
        </motion.div>
      </Container>

      {/* FOOTER */}
      <footer
        style={{
          background: "linear-gradient(135deg, #1f2937, #111827)",
          padding: "50px 0 30px",
          color: "#ffffff",
        }}
      >
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <h4 style={{ fontWeight: "800", marginBottom: "16px", fontSize: "1.5rem" }}>🧠 MindCare</h4>
              <p style={{ color: "#9ca3af", lineHeight: 1.7 }}>
                Empowering you to take control of your mental wellness with compassionate support and evidence-based tools.
              </p>
            </Col>
            <Col md={4}>
              <h5 style={{ fontWeight: "700", marginBottom: "16px" }}>Quick Links</h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link to="/about" style={{ color: "#9ca3af", textDecoration: "none" }}>About Us</Link>
                <Link to="/resources" style={{ color: "#9ca3af", textDecoration: "none" }}>Resources</Link>
                <Link to="/privacy" style={{ color: "#9ca3af", textDecoration: "none" }}>Privacy Policy</Link>
                <Link to="/contact" style={{ color: "#9ca3af", textDecoration: "none" }}>Contact</Link>
              </div>
            </Col>
            <Col md={4}>
              <h5 style={{ fontWeight: "700", marginBottom: "16px" }}>Crisis Support</h5>
              <p style={{ color: "#9ca3af", lineHeight: 1.7, marginBottom: "12px" }}>
                If you're in crisis, help is available 24/7:
              </p>
              <div style={{ color: "#a5f3fc", fontWeight: "600", fontSize: "1.1rem" }}>
                988 - Suicide & Crisis Lifeline
              </div>
            </Col>
          </Row>
          <div
            style={{
              borderTop: "1px solid #374151",
              marginTop: "40px",
              paddingTop: "24px",
              textAlign: "center",
              color: "#9ca3af",
            }}
          >
            <p style={{ margin: 0 }}>© {new Date().getFullYear()} MindCare. All rights reserved. Made with 💙 for mental wellness.</p>
          </div>
        </Container>
      </footer>

      {/* Modals */}
      <AssessmentModal
        show={showAssessmentModal}
        handleClose={() => setShowAssessmentModal(false)}
        handleStart={handleStartAssessment}
      />
      <ChatbotModal
        show={showChatbotModal}
        handleClose={() => {
          setShowChatbotModal(false);
          navigate("/questions");
        }}
        handleChat={goToChatbot}
      />
    </div>
  );
}

export default Frontpage;
