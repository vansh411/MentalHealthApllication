import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Navbar, Nav, Card, Row, Col, Button, Spinner, Badge } from "react-bootstrap";

export default function UserHome() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("loggedInUser");
  const user = storedUser ? { email: storedUser } : null;

  const [verdict, setVerdict] = useState("");
  const [condition, setCondition] = useState("");
  const [conditionInfo, setConditionInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

  const [nearbyTherapy, setNearbyTherapy] = useState([]);
  const [treatmentPlan, setTreatmentPlan] = useState([]);
  const [loadingCentres, setLoadingCentres] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [geoError, setGeoError] = useState("");

  useEffect(() => {
    const storedVerdict = localStorage.getItem("verdict");
    const storedCondition = localStorage.getItem("condition");
    if (storedVerdict) setVerdict(storedVerdict);
    if (storedCondition) setCondition(storedCondition);
  }, []);

  // Fetch treatment plan
  useEffect(() => {
    const storedCondition = localStorage.getItem("condition");
    if (!storedCondition) return;

    const fetchPlan = async () => {
      setLoadingPlan(true);
      try {
        const res = await fetch("http://localhost:8080/treatment-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ condition: storedCondition }),
        });
        const data = await res.json();
        setTreatmentPlan(res.ok ? data.plan || [] : []);
      } catch {
        setTreatmentPlan([]);
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchPlan();
  }, [verdict]);

  // Fetch condition info
  useEffect(() => {
    const storedCondition = localStorage.getItem("condition");
    if (!storedCondition) return;

    const fetchConditionInfo = async () => {
      setLoadingInfo(true);
      try {
        const res = await fetch("http://localhost:8080/condition-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ condition: storedCondition }),
        });
        const data = await res.json();
        setConditionInfo(res.ok ? data : null);
      } catch (err) {
        setConditionInfo(null);
      } finally {
        setLoadingInfo(false);
      }
    };

    fetchConditionInfo();
  }, [verdict]);

  // Fetch nearby centres
  const fetchNearbyFromBackend = async (lat, lng) => {
    setLoadingCentres(true);
    setGeoError("");
    try {
      const res = await fetch("http://localhost:8080/nearby-centres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng, radius: 5000 }),
      });
      const data = await res.json();
      setNearbyTherapy(res.ok ? data.centres || [] : []);
      if (!res.ok) setGeoError("Server error fetching centres.");
    } catch {
      setGeoError("Failed to fetch nearby centres.");
    } finally {
      setLoadingCentres(false);
    }
  };

  const handleFindCentres = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setGeoError("");
    setLoadingCentres(true);
    navigator.geolocation.getCurrentPosition(
      (position) =>
        fetchNearbyFromBackend(position.coords.latitude, position.coords.longitude),
      () => {
        setGeoError("Permission denied or unavailable.");
        setLoadingCentres(false);
      },
      { enableHighAccuracy: true, timeout: 30000 }
    );
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    hover: { y: -5, boxShadow: "0 20px 40px rgba(102, 126, 234, 0.15)" },
  };

  const getConditionColor = (condition) => {
    const colors = {
      "Depression": "#6366f1",
      "Anxiety": "#f59e0b",
      "ADHD": "#10b981",
      "PTSD": "#ef4444",
      "Aspergers": "#8b5cf6",
      "No disorder detected": "#22c55e",
    };
    return colors[condition] || "#6b7280";
  };

  const getConditionIcon = (condition) => {
    const icons = {
      "Depression": "😔",
      "Anxiety": "😰",
      "ADHD": "🎯",
      "PTSD": "💭",
      "Aspergers": "🧩",
      "No disorder detected": "✨",
    };
    return icons[condition] || "🧠";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      {/* MODERN NAVBAR */}
      <Navbar 
        expand="lg" 
        style={{ 
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)"
        }}
      >
        <Container>
          <Navbar.Brand style={{ 
            fontWeight: 800, 
            fontSize: "1.6rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            🧠 MindCare
          </Navbar.Brand>
          <Nav className="ms-auto d-flex gap-2">
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={() => navigate("/profile")}
              style={{
                borderRadius: "10px",
                padding: "8px 20px",
                fontWeight: 600,
                border: "2px solid #e5e7eb"
              }}
            >
              👤 Profile
            </Button>
            <Button 
              onClick={() => navigate("/")}
              style={{
                borderRadius: "10px",
                padding: "8px 20px",
                fontWeight: 600,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none"
              }}
            >
              🚪 Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="py-5">
        {/* HERO GREETING SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "24px",
            padding: "40px",
            marginBottom: "40px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.5)"
          }}>
            <Row className="align-items-center">
              <Col md={8}>
                <h1 style={{ 
                  fontWeight: 800, 
                  color: "#1f2937",
                  fontSize: "2.5rem",
                  marginBottom: "10px"
                }}>
                  {getGreeting()}, {user?.email?.split("@")[0] || "Friend"}! 👋
                </h1>
                <p style={{ 
                  color: "#6b7280",
                  fontSize: "1.1rem",
                  marginBottom: 0
                }}>
                  Here's your personalized mental wellness dashboard
                </p>
              </Col>
              <Col md={4} className="text-end">
                <div style={{
                  background: "linear-gradient(135deg, #667eea15, #764ba215)",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "2px solid #667eea40"
                }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "5px" }}>
                    {getConditionIcon(condition)}
                  </div>
                  <div style={{ fontSize: "14px", color: "#6b7280", fontWeight: 600 }}>
                    {condition || "Take Assessment"}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </motion.div>

        <Row className="g-4">
          {/* ASSESSMENT STATUS CARD */}
          <Col lg={6}>
            <motion.div 
              initial="hidden" 
              animate="enter" 
              whileHover="hover" 
              variants={cardVariants} 
              transition={{ duration: 0.3 }}
            >
              <Card style={{ 
                borderRadius: "20px", 
                padding: "30px",
                background: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                height: "100%"
              }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "12px",
                    background: `${getConditionColor(condition)}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px"
                  }}>
                    📋
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, color: "#1f2937", margin: 0 }}>
                      Assessment Result
                    </h4>
                    {condition && (
                      <Badge 
                        bg="light" 
                        style={{ 
                          color: getConditionColor(condition),
                          fontSize: "12px",
                          fontWeight: 600,
                          marginTop: "5px"
                        }}
                      >
                        {condition}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div style={{
                  background: "#f9fafb",
                  padding: "20px",
                  borderRadius: "12px",
                  marginBottom: "20px"
                }}>
                  <p style={{ 
                    color: "#374151", 
                    lineHeight: 1.7,
                    margin: 0,
                    fontSize: "15px"
                  }}>
                    {verdict || "Take an assessment to receive personalized mental health insights and recommendations."}
                  </p>
                </div>

                <Button 
                  onClick={() => navigate("/questions")}
                  style={{ 
                    borderRadius: "12px",
                    padding: "12px 24px",
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    width: "100%",
                    fontSize: "16px"
                  }}
                >
                  {verdict ? "🔄 Retake Assessment" : "▶️ Start Assessment"}
                </Button>
              </Card>
            </motion.div>
          </Col>

          {/* QUICK ACTIONS CARD */}
          <Col lg={6}>
            <motion.div 
              initial="hidden" 
              animate="enter" 
              whileHover="hover" 
              variants={cardVariants} 
              transition={{ duration: 0.35 }}
            >
              <Card style={{ 
                borderRadius: "20px", 
                padding: "30px",
                background: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                height: "100%"
              }}>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "12px",
                    background: "#22c55e20",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px"
                  }}>
                    ⚡
                  </div>
                  <h4 style={{ fontWeight: 700, color: "#1f2937", margin: 0 }}>
                    Quick Actions
                  </h4>
                </div>

                <div className="d-flex flex-column gap-3">
                  <button
                    onClick={() => window.open("http://localhost:8501", "_blank")}
                    style={{
                      padding: "16px 20px",
                      borderRadius: "12px",
                      border: "2px solid #3b82f6",
                      background: "#eff6ff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      transition: "all 0.2s",
                      fontWeight: 600,
                      color: "#1e40af"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#3b82f6";
                      e.target.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#eff6ff";
                      e.target.style.color = "#1e40af";
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>💬</span>
                    <span>Talk to AI Counselor</span>
                  </button>

                  <button
                    onClick={() => navigate("/chat")}
                    style={{
                      padding: "16px 20px",
                      borderRadius: "12px",
                      border: "2px solid #10b981",
                      background: "#f0fdf4",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      transition: "all 0.2s",
                      fontWeight: 600,
                      color: "#065f46"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#10b981";
                      e.target.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#f0fdf4";
                      e.target.style.color = "#065f46";
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>👥</span>
                    <span>Connect with Peers</span>
                  </button>

                  <button
                    onClick={() => navigate("/games")}
                    style={{
                      padding: "16px 20px",
                      borderRadius: "12px",
                      border: "2px solid #8b5cf6",
                      background: "#faf5ff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      transition: "all 0.2s",
                      fontWeight: 600,
                      color: "#6b21a8"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#8b5cf6";
                      e.target.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#faf5ff";
                      e.target.style.color = "#6b21a8";
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>🎮</span>
                    <span>Wellness Games</span>
                  </button>
                </div>
              </Card>
            </motion.div>
          </Col>

          {/* CONDITION INFO - Only show if verdict exists */}
          {verdict && condition !== "No disorder detected" && (
            <Col lg={12}>
              <motion.div 
                initial="hidden" 
                animate="enter" 
                whileHover="hover" 
                variants={cardVariants} 
                transition={{ duration: 0.4 }}
              >
                <Card style={{ 
                  borderRadius: "20px", 
                  padding: "30px",
                  background: "rgba(255, 255, 255, 0.95)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.5)"
                }}>
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      background: `${getConditionColor(condition)}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px"
                    }}>
                      {getConditionIcon(condition)}
                    </div>
                    <h4 style={{ fontWeight: 700, color: "#1f2937", margin: 0 }}>
                      Understanding {condition}
                    </h4>
                  </div>

                  {loadingInfo ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" style={{ color: "#667eea" }} />
                    </div>
                  ) : conditionInfo ? (
                    <Row className="g-4">
                      <Col md={12}>
                        <div style={{
                          background: "#f9fafb",
                          padding: "20px",
                          borderRadius: "12px"
                        }}>
                          <p style={{ color: "#374151", lineHeight: 1.7, margin: 0 }}>
                            {conditionInfo.description}
                          </p>
                        </div>
                      </Col>

                      {conditionInfo.causes?.length > 0 && (
                        <Col md={4}>
                          <div style={{
                            background: "#fef3c7",
                            padding: "20px",
                            borderRadius: "12px",
                            border: "1px solid #fde68a"
                          }}>
                            <h6 style={{ fontWeight: 700, color: "#92400e", marginBottom: "12px" }}>
                              🔍 Common Causes
                            </h6>
                            <ul style={{ margin: 0, paddingLeft: "20px", color: "#78350f" }}>
                              {conditionInfo.causes.map((cause, idx) => (
                                <li key={idx} style={{ marginBottom: "6px" }}>{cause}</li>
                              ))}
                            </ul>
                          </div>
                        </Col>
                      )}

                      {conditionInfo.effects?.length > 0 && (
                        <Col md={4}>
                          <div style={{
                            background: "#dbeafe",
                            padding: "20px",
                            borderRadius: "12px",
                            border: "1px solid #bfdbfe"
                          }}>
                            <h6 style={{ fontWeight: 700, color: "#1e40af", marginBottom: "12px" }}>
                              💫 Effects
                            </h6>
                            <ul style={{ margin: 0, paddingLeft: "20px", color: "#1e3a8a" }}>
                              {conditionInfo.effects.map((effect, idx) => (
                                <li key={idx} style={{ marginBottom: "6px" }}>{effect}</li>
                              ))}
                            </ul>
                          </div>
                        </Col>
                      )}

                      {conditionInfo.commonEmotions?.length > 0 && (
                        <Col md={4}>
                          <div style={{
                            background: "#fce7f3",
                            padding: "20px",
                            borderRadius: "12px",
                            border: "1px solid #fbcfe8"
                          }}>
                            <h6 style={{ fontWeight: 700, color: "#9f1239", marginBottom: "12px" }}>
                              💭 Common Emotions
                            </h6>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                              {conditionInfo.commonEmotions.map((emotion, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    background: "#fbcfe8",
                                    color: "#831843",
                                    padding: "6px 12px",
                                    borderRadius: "20px",
                                    fontSize: "13px",
                                    fontWeight: 600
                                  }}
                                >
                                  {emotion}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Col>
                      )}
                    </Row>
                  ) : (
                    <p style={{ color: "#6b7280", textAlign: "center" }}>
                      No information available at this time.
                    </p>
                  )}
                </Card>
              </motion.div>
            </Col>
          )}

          {/* TREATMENT PLAN */}
          {verdict && (
            <Col lg={12}>
              <motion.div 
                initial="hidden" 
                animate="enter" 
                whileHover="hover" 
                variants={cardVariants} 
                transition={{ duration: 0.45 }}
              >
                <Card style={{ 
                  borderRadius: "20px", 
                  padding: "30px",
                  background: "rgba(255, 255, 255, 0.95)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.5)"
                }}>
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      background: "#10b98120",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px"
                    }}>
                      📝
                    </div>
                    <h4 style={{ fontWeight: 700, color: "#1f2937", margin: 0 }}>
                      Your Personalized Wellness Plan
                    </h4>
                  </div>

                  {loadingPlan ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" style={{ color: "#667eea" }} />
                    </div>
                  ) : treatmentPlan.length ? (
                    <div style={{
                      background: "#f0fdf4",
                      padding: "25px",
                      borderRadius: "12px",
                      border: "1px solid #bbf7d0"
                    }}>
                      <div className="d-flex flex-column gap-3">
                        {treatmentPlan.map((step, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              gap: "15px",
                              alignItems: "start"
                            }}
                          >
                            <div style={{
                              minWidth: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              background: "#10b981",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "14px"
                            }}>
                              {idx + 1}
                            </div>
                            <p style={{
                              margin: 0,
                              color: "#065f46",
                              lineHeight: 1.6,
                              fontSize: "15px"
                            }}>
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      background: "#f9fafb",
                      padding: "30px",
                      borderRadius: "12px",
                      textAlign: "center"
                    }}>
                      <p style={{ color: "#6b7280", margin: 0 }}>
                        Complete your assessment to receive a personalized treatment plan.
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            </Col>
          )}

          {/* NEARBY THERAPY CENTERS */}
          <Col lg={12}>
            <motion.div 
              initial="hidden" 
              animate="enter" 
              whileHover="hover" 
              variants={cardVariants} 
              transition={{ duration: 0.5 }}
            >
              <Card style={{ 
                borderRadius: "20px", 
                padding: "30px",
                background: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.5)"
              }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      background: "#3b82f620",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px"
                    }}>
                      📍
                    </div>
                    <h4 style={{ fontWeight: 700, color: "#1f2937", margin: 0 }}>
                      Nearby Therapy Centers
                    </h4>
                  </div>
                  <Button 
                    onClick={handleFindCentres} 
                    disabled={loadingCentres}
                    style={{
                      borderRadius: "12px",
                      padding: "10px 20px",
                      fontWeight: 600,
                      background: loadingCentres ? "#e5e7eb" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none"
                    }}
                  >
                    {loadingCentres ? (
                      <>
                        <Spinner animation="border" size="sm" /> Finding...
                      </>
                    ) : (
                      "🔍 Find Centers"
                    )}
                  </Button>
                </div>

                {geoError && (
                  <div style={{
                    background: "#fee2e2",
                    color: "#991b1b",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    border: "1px solid #fecaca"
                  }}>
                    ⚠️ {geoError}
                  </div>
                )}

                {nearbyTherapy.length > 0 ? (
                  <Row className="g-3">
                    {nearbyTherapy.map((center, idx) => (
                      <Col md={4} key={idx}>
                        <motion.div
                          whileHover={{ y: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card style={{ 
                            borderRadius: "16px", 
                            padding: "20px",
                            background: "#f9fafb",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                            border: "1px solid #e5e7eb",
                            height: "100%"
                          }}>
                            <h6 style={{ 
                              fontWeight: 700, 
                              color: "#1f2937",
                              marginBottom: "8px",
                              fontSize: "15px"
                            }}>
                              {center.name}
                            </h6>
                            <p style={{ 
                              color: "#6b7280", 
                              fontSize: "13px",
                              marginBottom: "12px",
                              lineHeight: 1.5
                            }}>
                              📍 {center.address}
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span style={{ 
                                fontSize: "14px",
                                color: "#f59e0b",
                                fontWeight: 600
                              }}>
                                {center.rating ? `⭐ ${center.rating}` : "No rating"}
                              </span>
                              <Button 
                                size="sm"
                                onClick={() => window.open(
                                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.name + " " + (center.address || ""))}`,
                                  "_blank"
                                )}
                                style={{
                                  borderRadius: "8px",
                                  padding: "6px 14px",
                                  background: "#3b82f6",
                                  border: "none",
                                  fontSize: "13px",
                                  fontWeight: 600
                                }}
                              >
                                🗺️ View
                              </Button>
                            </div>
                          </Card>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <div style={{
                    background: "#f9fafb",
                    padding: "40px",
                    borderRadius: "12px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>📍</div>
                    <p style={{ color: "#6b7280", margin: 0 }}>
                      Click "Find Centers" to discover therapy centers near you
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        marginTop: "60px",
        padding: "30px 0",
        textAlign: "center",
        borderTop: "1px solid rgba(255, 255, 255, 0.3)"
      }}>
        <Container>
          <p style={{ color: "#6b7280", margin: 0, fontSize: "14px" }}>
            💙 Your mental health matters. Remember, seeking help is a sign of strength.
          </p>
        </Container>
      </div>
    </div>
  );
}
