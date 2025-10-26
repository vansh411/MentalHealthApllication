import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Button, Row, Col, Card } from "react-bootstrap";
import { useSpring, animated } from "@react-spring/web";

function FeatureCard({ icon, title, text, delay }) {
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
          borderRadius: "15px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          padding: "2rem 1rem",
          textAlign: "center",
          transition: "transform 0.3s, box-shadow 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{icon}</div>
        <Card.Body>
          <Card.Title style={{ fontWeight: "700", color: "#222" }}>{title}</Card.Title>
          <Card.Text style={{ color: "#555" }}>{text}</Card.Text>
        </Card.Body>
      </Card>
    </animated.div>
  );
}

function Frontpage() {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("loggedInUser");
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const assessmentCompleted = JSON.parse(localStorage.getItem("assessmentCompleted")) || {};

  let initials = "";
  if (loggedInUser && users[loggedInUser]) {
    const email = users[loggedInUser].email;
    initials = email
      .split("@")[0]
      .split(".")
      .map((part) => part[0].toUpperCase())
      .join("");
  }

  const handleAssessment = () => {
    if (!loggedInUser) navigate("/signin");
    else if (assessmentCompleted[loggedInUser]) navigate("/userhome");
    else navigate("/questions");
  };

  const quotes = [
    "Your mental health is a priority, not a luxury.",
    "It’s okay to not be okay — what matters is you’re trying.",
    "Healing takes time, but every step counts.",
    "You are not your thoughts. You are the observer of them.",
    "Even the darkest night will end, and the sun will rise again.",
  ];
  const [currentQuote, setCurrentQuote] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setCurrentQuote((prev) => (prev + 1) % quotes.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const blogs = [
    {
      title: "How Social Media Affects Mental Health",
      text: "Learn how to maintain healthy boundaries online and avoid comparison traps.",
      img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    },
    {
      title: "Building Digital Balance",
      text: "Discover simple steps to balance your screen time and mental peace.",
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    },
    {
      title: "The Power of Mindful Scrolling",
      text: "Turn your social media feed into a space of positivity and inspiration.",
      img: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980",
    },
  ];

  const books = [
    { title: "The Anxiety and Phobia Workbook", author: "Edmund J. Bourne", link: "#" },
    { title: "Feeling Good: The New Mood Therapy", author: "David D. Burns", link: "#" },
    { title: "Lost Connections", author: "Johann Hari", link: "#" },
    { title: "The Happiness Trap", author: "Russ Harris", link: "#" },
    { title: "Mind Over Mood", author: "Dennis Greenberger", link: "#" },
  ];

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", background: "#F9FAFB", minHeight: "100vh", color: "#222" }}>
      {/* Navbar */}
      <Navbar
        expand="lg"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 999,
          background: "#2C3E50",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          padding: "0.8rem 2rem",
        }}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" style={{ fontWeight: "bold", color: "#fff", fontSize: "1.4rem" }}>
            MindCare
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll" className="justify-content-end">
            <Nav>
              {!loggedInUser ? (
                <>
                  <Nav.Link as={Link} to="/signin" style={{ color: "#fff", fontWeight: 500 }}>
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/createaccount" style={{ color: "#fff", fontWeight: 500 }}>
                    Sign Up
                  </Nav.Link>
                </>
              ) : (
                <div
                  onClick={() => navigate("/profile")}
                  style={{
                    backgroundColor: "#28A745",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "45px",
                    height: "45px",
                    lineHeight: "45px",
                    textAlign: "center",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "18px",
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

      {/* Hero Section */}
      <div style={{ textAlign: "center", padding: "80px 5% 50px 5%" }}>
        <Card
          style={{
            background: "linear-gradient(135deg, #5DADE2, #48C9B0)",
            color: "#fff",
            borderRadius: "20px",
            maxWidth: "720px",
            margin: "0 auto",
            padding: "3rem 2rem",
            boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
            transition: "transform 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <h1 style={{ fontSize: "2.8rem", fontWeight: "700" }}>Your Mental Health Companion</h1>
          <p style={{ fontSize: "1.1rem", marginTop: "1rem" }}>
            Talk to a friendly chatbot, track your mood, and get personalized insights.
          </p>
          <Button
            onClick={handleAssessment}
            style={{
              backgroundColor: "#28A745",
              color: "#fff",
              border: "none",
              padding: "0.9rem 2.2rem",
              fontSize: "1.2rem",
              fontWeight: "700",
              marginTop: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#218838";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#28A745";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Take Assessment
          </Button>
        </Card>

        {/* Quote */}
        <Card
          style={{
            marginTop: "25px",
            maxWidth: "650px",
            marginLeft: "auto",
            marginRight: "auto",
            padding: "1rem 2rem",
            borderRadius: "15px",
            background: "#FFF",
            color: "#222",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            fontStyle: "italic",
            fontSize: "1.05rem",
          }}
        >
          “{quotes[currentQuote]}”
        </Card>
      </div>

      {/* Features */}
      <Container className="py-5">
        <h2 className="text-center mb-5" style={{ fontWeight: "700", color: "#222" }}>
          Features
        </h2>
        <Row className="g-4">
          {[
            { icon: "🤖", title: "AI Chatbot", text: "Talk with a human-like chatbot that listens and responds with empathy." },
            { icon: "😊", title: "Mood Tracker", text: "Track your daily emotions and monitor mental health patterns over time." },
            { icon: "📊", title: "Personalized Reports", text: "Get weekly summaries with insights and recommendations for your wellbeing." },
          ].map((f, i) => (
            <Col md={4} key={i}>
              <FeatureCard {...f} delay={i * 200} />
            </Col>
          ))}
        </Row>
      </Container>

      {/* Blogs */}
      <Container className="pb-5">
        <h2 className="text-center mb-4" style={{ fontWeight: "700", color: "#222" }}>
          Mental Health Blogs
        </h2>
        <Row className="g-4">
          {blogs.map((blog, i) => (
            <Col md={4} key={i}>
              <Card style={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}>
                <Card.Img src={blog.img} />
                <Card.Body>
                  <Card.Title style={{ fontWeight: "700", color: "#222" }}>{blog.title}</Card.Title>
                  <Card.Text style={{ color: "#555" }}>{blog.text}</Card.Text>
                  <Button
                    style={{
                      borderRadius: "10px",
                      fontWeight: "700",
                      backgroundColor: "#48C9B0",
                      border: "none",
                      color: "#fff",
                      padding: "0.5rem 1rem",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3CB0A5")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#48C9B0")}
                  >
                    Read More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Book Recommendations */}
      <Container className="pb-5">
        <h2 className="text-center mb-4" style={{ fontWeight: "700", color: "#222" }}>
          Recommended Books
        </h2>
        <Row className="g-4">
          {books.map((book, i) => (
            <Col md={4} key={i}>
              <Card style={{ borderRadius: "15px", boxShadow: "0 6px 20px rgba(0,0,0,0.08)", padding: "1.5rem" }}>
                <Card.Body>
                  <Card.Title style={{ fontWeight: "700" }}>{book.title}</Card.Title>
                  <Card.Text style={{ color: "#555", marginBottom: "0.5rem" }}>{book.author}</Card.Text>
                  <Button
                    as="a"
                    href={book.link}
                    target="_blank"
                    style={{
                      borderRadius: "10px",
                      fontWeight: "700",
                      backgroundColor: "#5DADE2",
                      border: "none",
                      color: "#fff",
                      padding: "0.5rem 1rem",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4A90D9")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#5DADE2")}
                  >
                    Learn More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#F1F3F6",
          color: "#222",
          textAlign: "center",
          padding: "1rem",
          borderTop: "1px solid #ccc",
        }}
      >
        <Container>
          <p>&copy; {new Date().getFullYear()} MindCare. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}

export default Frontpage;
