import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Navbar, Nav, Card, Row, Col, Button, Spinner } from "react-bootstrap";

export default function UserHome() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("loggedInUser");
  const user = storedUser ? { email: storedUser } : null;

  const [verdict, setVerdict] = useState("");
  const [conditionInfo, setConditionInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

  const [nearbyTherapy, setNearbyTherapy] = useState([]);
  const [treatmentPlan, setTreatmentPlan] = useState([]);
  const [loadingCentres, setLoadingCentres] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [geoError, setGeoError] = useState("");

  useEffect(() => {
    const storedVerdict = localStorage.getItem("verdict");
    if (storedVerdict) setVerdict(storedVerdict);
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
    hidden: { opacity: 0, y: 15 },
    enter: { opacity: 1, y: 0 },
    hover: { scale: 1.02, boxShadow: "0 15px 35px rgba(0,0,0,0.08)" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#eef2f5", fontFamily: "'Inter', sans-serif" }}>
      {/* NAVBAR */}
      <Navbar expand="lg" style={{ background: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <Container>
          <Navbar.Brand style={{ fontWeight: 700, fontSize: "1.5rem", color: "#2c3e50" }}>MindCare</Navbar.Brand>
          <Nav className="ms-auto d-flex gap-2">
            <Button variant="outline-secondary" size="sm" onClick={() => navigate("/profile")}>Profile</Button>
            <Button variant="primary" size="sm" onClick={() => navigate("/")}>Logout</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="py-5">
        {/* GREETING */}
        <Row className="mb-5">
          <Col>
            <h1 style={{ fontWeight: 700, color: "#2c3e50" }}>Hello, {user?.email?.split("@")[0] || "Friend"} </h1>
            <p style={{ color: "#7f8c8d" }}>Here’s your personalized mental wellness overview.</p>
          </Col>
        </Row>

        <Row className="g-4">
          {/* VERDICT CARD */}
          <Col md={6}>
            <motion.div initial="hidden" animate="enter" whileHover="hover" variants={cardVariants} transition={{ duration: 0.4 }}>
              <Card style={{ borderRadius: 20, padding: "30px", background: "#ffffff", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <h4 style={{ fontWeight: 700, color: "#34495e" }}>Assessment Verdict</h4>
                <p style={{ color: "#7f8c8d", marginTop: 12 }}>
                  {verdict || "Take an assessment to get personalized guidance."}
                </p>
                <Button variant="primary" style={{ borderRadius: 8, marginTop: 15 }} onClick={() => navigate("/questions")}>Take/Retake Assessment</Button>
              </Card>
            </motion.div>
          </Col>

          {/* CONDITION INFO CARD */}
          {verdict && (
            <Col md={6}>
              <motion.div initial="hidden" animate="enter" whileHover="hover" variants={cardVariants} transition={{ duration: 0.45 }}>
                <Card style={{ borderRadius: 20, padding: "30px", background: "#ffffff", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                  <h4 style={{ fontWeight: 700, color: "#34495e" }}>About {verdict}</h4>
                  {loadingInfo ? (
                    <Spinner animation="border" size="sm" className="mt-3" />
                  ) : conditionInfo ? (
                    <div style={{ marginTop: 15 }}>
                      <p><strong>Description:</strong> {conditionInfo.description}</p>
                      {conditionInfo.causes?.length > 0 && <p><strong>Causes:</strong> {conditionInfo.causes.join(", ")}</p>}
                      {conditionInfo.effects?.length > 0 && <p><strong>Effects:</strong> {conditionInfo.effects.join(", ")}</p>}
                      {conditionInfo.commonEmotions?.length > 0 && <p><strong>Common Emotions:</strong> {conditionInfo.commonEmotions.join(", ")}</p>}
                    </div>
                  ) : (
                    <p style={{ color: "#7f8c8d", marginTop: 12 }}>No information available.</p>
                  )}
                </Card>
              </motion.div>
            </Col>
          )}

          {/* QUICK ACTIONS CARD */}
          <Col md={6}>
            <motion.div initial="hidden" animate="enter" whileHover="hover" variants={cardVariants} transition={{ duration: 0.45 }}>
              <Card style={{ borderRadius: 20, padding: "30px", background: "#ffffff", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <h4 style={{ fontWeight: 700, color: "#34495e" }}>Quick Actions</h4>
                <div className="d-flex flex-column gap-3 mt-3">
                  <Button variant="outline-info" style={{ borderRadius: 10 }} onClick={() => window.open("http://localhost:8501", "_blank")}> AI Counselor Chat</Button>
                  <Button variant="outline-success" style={{ borderRadius: 10 }} onClick={() => navigate("/chat")}> Connect with Peers</Button>
                </div>
              </Card>
            </motion.div>
          </Col>

          {/* TREATMENT PLAN */}
          <Col md={12}>
            <motion.div initial="hidden" animate="enter" whileHover="hover" variants={cardVariants} transition={{ duration: 0.5 }}>
              <Card style={{ borderRadius: 20, padding: "30px", background: "#ffffff", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <h4 style={{ fontWeight: 700, color: "#34495e" }}>Treatment Plan</h4>
                {loadingPlan ? (
                  <Spinner animation="border" size="sm" className="mt-3" />
                ) : treatmentPlan.length ? (
                  <ul style={{ marginTop: 15, paddingLeft: 20 }}>
                    {treatmentPlan.map((step, idx) => <li key={idx} style={{ marginBottom: 8 }}>{step}</li>)}
                  </ul>
                ) : (
                  <p style={{ color: "#7f8c8d", marginTop: 12 }}>No plan available. Complete your assessment first.</p>
                )}
              </Card>
            </motion.div>
          </Col>

          {/* NEARBY CENTRES */}
          <Col md={12}>
            <motion.div initial="hidden" animate="enter" whileHover="hover" variants={cardVariants} transition={{ duration: 0.55 }}>
              <Card style={{ borderRadius: 20, padding: "30px", background: "#ffffff", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h4 style={{ fontWeight: 700, color: "#34495e" }}>Nearby Therapy Centers</h4>
                  <Button variant="primary" size="sm" onClick={handleFindCentres} disabled={loadingCentres}>
                    {loadingCentres ? (<><Spinner animation="border" size="sm" /> Searching...</>) : "Find Nearby Centres"}
                  </Button>
                </div>
                {geoError && <p style={{ color: "red", marginTop: 10 }}>{geoError}</p>}
                <Row className="mt-4 g-3">
                  {nearbyTherapy.length ? nearbyTherapy.map((center, idx) => (
                    <Col md={4} key={idx}>
                      <Card style={{ borderRadius: 15, padding: "20px", background: "#f9fafc", boxShadow: "0 8px 20px rgba(0,0,0,0.05)" }}>
                        <h6 style={{ fontWeight: 700, color: "#2c3e50" }}>{center.name}</h6>
                        <p style={{ color: "#7f8c8d", fontSize: 13 }}>{center.address}</p>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <span style={{ fontSize: 13 }}>{center.rating ? `★ ${center.rating}` : "No rating"}</span>
                          <Button variant="info" size="sm" style={{ borderRadius: 6 }}
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.name + " " + (center.address || ""))}`, "_blank")}>
                            View Map
                          </Button>
                        </div>
                      </Card>
                    </Col>
                  )) : (
                    <p style={{ color: "#7f8c8d" }}>Click "Find Nearby Centres" to search.</p>
                  )}
                </Row>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
