import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
  Button,
  Row,
  Col,
  Card,
  Modal,
} from "react-bootstrap";
import { useSpring, animated } from "@react-spring/web";


// ----------------------------------------
// Feature Card Component
// ----------------------------------------
function FeatureCard({ icon, title, text, delay, onClick }) {
  const style = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    delay,
  });

  return (
    <animated.div style={style}>
      <Card
        style={{
          background: "#fff",
          borderRadius: "18px",
          boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
          padding: "2rem 1rem",
          textAlign: "center",
          transition: "0.3s",
          cursor: onClick ? "pointer" : "default",
        }}
        onClick={onClick}
        className="hover-up"
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{icon}</div>
        <Card.Body>
          <Card.Title style={{ fontWeight: "700", color: "#222" }}>
            {title}
          </Card.Title>
          <Card.Text style={{ color: "#555" }}>{text}</Card.Text>
        </Card.Body>
      </Card>
    </animated.div>
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
          padding: "2rem",
          borderRadius: "15px",
          textAlign: "center",
        }}
      >
        <h3 style={{ fontWeight: "700", marginBottom: "10px" }}>
          Take Your Assessment?
        </h3>
        <p style={{ color: "#666", fontSize: "1.05rem" }}>
          This quick assessment helps us tailor your mental wellness experience.
          You can choose to do it now or later.
        </p>

        <div className="d-flex justify-content-center mt-4 gap-3">
          <Button
            style={{
              padding: "0.7rem 1.8rem",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#2ecc71",
              fontWeight: "600",
            }}
            onClick={handleStart}
          >
            Start Now
          </Button>

          <Button
            style={{
              padding: "0.7rem 1.8rem",
              borderRadius: "12px",
              background: "#eee",
              color: "#555",
              fontWeight: "600",
              border: "none",
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
          padding: "2rem",
          borderRadius: "15px",
          textAlign: "center",
        }}
      >
        <h3 style={{ fontWeight: "700", marginBottom: "10px" }}>
          Need Someone to Talk To?
        </h3>

        <p style={{ color: "#666", fontSize: "1.05rem" }}>
          You can chat with our friendly AI chatbot anytime for emotional
          support, insights, or just a calming conversation.
        </p>

        <div className="d-flex justify-content-center mt-4 gap-3">
          <Button
            style={{
              padding: "0.7rem 1.8rem",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#3498db",
              fontWeight: "600",
            }}
            onClick={handleChat}
          >
            Talk to Chatbot
          </Button>

          <Button
            style={{
              padding: "0.7rem 1.8rem",
              borderRadius: "12px",
              background: "#eee",
              color: "#555",
              fontWeight: "600",
              border: "none",
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
  setShowAssessmentModal(false);   // close first popup
  setShowChatbotModal(true);       // show chatbot modal immediately
};

const goToChatbot = () => {
  setShowChatbotModal(false);
  window.open("http://localhost:8501", "_blank"); // open chatbot
  navigate("/questions"); // navigate after chatbot
};


  // Quotes
  const quotes = [
    "Your mental health is a priority, not a luxury.",
    "It’s okay to not be okay — what matters is you’re trying.",
    "Healing takes time, but every step counts.",
    "You are not your thoughts. You are the observer of them.",
    "Even the darkest night will end, and the sun will rise again.",
  ];
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentQuote((prev) => (prev + 1) % quotes.length),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        background: "#F4F7FA",
        minHeight: "100vh",
        color: "#222",
      }}
    >
      {/* Navbar */}
      <Navbar
        expand="lg"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 999,
          background: "linear-gradient(90deg, #2C3E50, #1A252F, #2C3E50)",
          padding: "0.9rem 2rem",
        }}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            style={{ fontWeight: "bold", color: "#fff", fontSize: "1.5rem" }}
          >
            MindCare
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {!loggedInUser ? (
                <>
                  <Nav.Link as={Link} to="/signin" style={{ color: "#fff" }}>
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/createaccount" style={{ color: "#fff" }}>
                    Sign Up
                  </Nav.Link>
                </>
              ) : (
                <div
                  onClick={() => navigate("/profile")}
                  style={{
                    backgroundColor: "#2ecc71",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "45px",
                    height: "45px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontWeight: "700",
                    marginLeft: "10px",
                  }}
                >
                  {initials}
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* HERO */}
      <div style={{ textAlign: "center", padding: "80px 5%" }}>
        <Card
          style={{
            background: "linear-gradient(135deg, #6DD5FA, #2980B9)",
            color: "#fff",
            borderRadius: "25px",
            maxWidth: "760px",
            margin: "0 auto",
            padding: "3.2rem 2rem",
            boxShadow: "0 18px 40px rgba(0,0,0,0.2)",
          }}
          className="hover-scale"
        >
          <h1 style={{ fontWeight: "800", fontSize: "2.9rem" }}>
            Your Mental Health Companion
          </h1>
          <p
            style={{
              fontSize: "1.15rem",
              marginTop: "1rem",
              opacity: 0.95,
            }}
          >
            Chat with an empathetic AI, track your mood, and gain helpful insights.
          </p>
          <Button
            style={{
              marginTop: "1.7rem",
              padding: "0.9rem 2.2rem",
              backgroundColor: "#2ecc71",
              border: "none",
              borderRadius: "12px",
              fontWeight: "700",
            }}
            onClick={openAssessmentModal}
          >
            Take Assessment
          </Button>
        </Card>

        <Card
          style={{
            marginTop: "25px",
            maxWidth: "650px",
            margin: "25px auto",
            padding: "1rem 2rem",
            borderRadius: "15px",
            background: "#fff",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            fontStyle: "italic",
          }}
        >
          “{quotes[currentQuote]}”
        </Card>
      </div>

      {/* FEATURES */}
     
      {/* MINI GAMES SECTION  */}
{/* MINI GAMES SECTION  */}
<Container className="pb-5 mt-5">
  <h2 className="text-center mb-5" style={{ fontWeight: "700" }}>
    Mind-Healing Mini Games 🎮
  </h2>

  <Row className="g-4">
    {[
      {
        icon: "🌬️",
        title: "Breathing Bubble",
        text: "Interactive inhale-exhale game for instant relaxation.",
        onClick: () => navigate("/game-breathing"),
      },
      {
        icon: "🫧",
        title: "Bubble Pop",
        text: "Pop bubbles to relieve stress and calm your mind.",
        onClick: () => navigate("/game-bubble"),
      },
      {
        icon: "🎨",
        title: "Color Calm",
        text: "Relaxing color-filling activity to reduce anxiety.",
        onClick: () => navigate("/game-color"),
      },
      {
        icon: "🧠",
        title: "Memory Match",
        text: "Match pairs to boost focus and mental clarity.",
        onClick: () => navigate("/game-memory"),
      },
      {
        icon: "💛",
        title: "Gratitude Journal",
        text: "Write something positive to uplift your mood.",
        onClick: () => navigate("/game-gratitude"),
      },
      {
        icon: "🔄",
        title: "Anxiety Spinner",
        text: "Spin to release stress through calming motion.",
        onClick: () => navigate("/game-spinner"),
      },
      {
        icon: "🔤",
        title: "Word Relax",
        text: "Type soothing words to relax your mind.",
        onClick: () => navigate("/game-word"),
      },
    ].map((g, i) => (
      <Col md={4} key={i}>
        <FeatureCard {...g} delay={i * 150} />
      </Col>
    ))}
  </Row>
</Container>
 {/* EXTERNAL STRESS-RELIEF GAMES SECTION */}
<Container className="pb-5 mt-5">
  <h2 className="text-center mb-5" style={{ fontWeight: "700" }}>
    Stress-Relief Activities 🌿
  </h2>

  <Row className="g-4">
    {[
      {
        icon: "🌬️",
        title: "Calm Breathing Exercise",
        text: "Guided box breathing for instant relaxation.",
        onClick: () => window.open("https://calm.com/breathe", "_blank"),
      },
      {
        icon: "🧘",
        title: "MHA Stress Toolkit",
        text: "Grounding exercises & mental wellness activities.",
        onClick: () =>
          window.open(
            "https://screening.mhanational.org/stress-toolkits/",
            "_blank"
          ),
      },
     
     
      {
        icon: "🎧",
        title: "A Soft Murmur",
        text: "Mix calming background sounds to relax or study.",
        onClick: () => window.open("https://asoftmurmur.com/", "_blank"),
      },
      {
        icon: "🌧️",
        title: "Rainy Mood",
        text: "Relax with peaceful rain sound therapy.",
        onClick: () => window.open("https://rainymood.com/", "_blank"),
      },
    ].map((item, i) => (
      <Col md={4} key={i}>
        <FeatureCard {...item} delay={i * 150} />
      </Col>
    ))}
  </Row>
</Container>


      {/* FOOTER */}
      <footer
        style={{
          background: "#EEF1F4",
          padding: "1.2rem",
          textAlign: "center",
          borderTop: "1px solid #ddd",
        }}
      >
        <p>© {new Date().getFullYear()} MindCare. All rights reserved.</p>
      </footer>

      {/* Modal */}
      <AssessmentModal
        show={showAssessmentModal}
        handleClose={() => setShowAssessmentModal(false)}
        handleStart={handleStartAssessment}
      />
   <ChatbotModal
  show={showChatbotModal}
  handleClose={() => {
    setShowChatbotModal(false);
    navigate("/questions"); // navigate if user says "Not Now"
  }}
  handleChat={goToChatbot}
/>


    </div>
  );
}

export default Frontpage;
