import React, { useState, useEffect } from "react";
import { Container, Button, Card, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [userRecord, setUserRecord] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("");
  const [lastLogin, setLastLogin] = useState(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Load logged-in user
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) return;

    const allUsers = JSON.parse(localStorage.getItem("users")) || {};
    const userObj = allUsers[storedUser] || allUsers[JSON.parse(storedUser)?.email] || null;

    if (userObj) {
      setUserRecord(userObj);
      setUsername(userObj.username || userObj.displayName || "Anonymous User");
      setProfilePic(userObj.profilePic || "");

      // Handle streak tracking
      const today = new Date().toDateString();
      const lastVisit = userObj.lastLogin || null;
      let currentStreak = userObj.streak || 0;

      if (lastVisit !== today) {
        if (lastVisit) {
          const lastDate = new Date(lastVisit);
          const diffDays = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) currentStreak += 1; // consecutive day
          else currentStreak = 1; // reset streak
        } else {
          currentStreak = 1; // first login
        }

        // Save updated login and streak
        userObj.lastLogin = today;
        userObj.streak = currentStreak;
        allUsers[userObj.email] = userObj;
        localStorage.setItem("users", JSON.stringify(allUsers));
      }

      setStreak(currentStreak);
      setLastLogin(userObj.lastLogin);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePic(reader.result);
      // Update localStorage
      const allUsers = JSON.parse(localStorage.getItem("users")) || {};
      allUsers[userRecord.email].profilePic = reader.result;
      localStorage.setItem("users", JSON.stringify(allUsers));
    };
    reader.readAsDataURL(file);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const saveUsername = () => {
    const allUsers = JSON.parse(localStorage.getItem("users")) || {};
    allUsers[userRecord.email].username = username;
    localStorage.setItem("users", JSON.stringify(allUsers));
    setUserRecord({ ...userRecord, username });
  };

  if (!userRecord) {
    return (
      <Container style={{ paddingTop: "10%", textAlign: "center" }}>
        <h3>No user logged in</h3>
        <Button onClick={() => navigate("/signin")}>Go to Sign In</Button>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: "3%", paddingBottom: "3%" }}>
      <Card
        className="mx-auto p-4 shadow-lg"
        style={{ maxWidth: "500px", borderRadius: "25px", background: "#fff" }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              overflow: "hidden",
              margin: "0 auto 1rem",
              border: "4px solid #2AB7CA",
            }}
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  backgroundColor: "#2AB7CA",
                  color: "#fff",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                  fontWeight: "bold",
                }}
              >
                {username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <Form.Group controlId="profilePicUpload" className="mb-3">
            <Form.Label style={{ fontWeight: "bold", cursor: "pointer", color: "#2AB7CA" }}>
              Upload Profile Picture
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{ display: "none" }}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label style={{ fontWeight: "bold" }}>Username:</Form.Label>
            <Row className="g-2">
              <Col xs={8}>
                <Form.Control value={username} onChange={handleUsernameChange} />
              </Col>
              <Col xs={4}>
                <Button variant="primary" onClick={saveUsername} style={{ width: "100%" }}>
                  Save
                </Button>
              </Col>
            </Row>
          </Form.Group>

          <p style={{ fontSize: "1rem", color: "#555", marginTop: "0.5rem" }}>
            <strong>Email:</strong> {userRecord.email}
          </p>

          <div
            className="d-flex justify-content-around mt-4"
            style={{ textAlign: "center" }}
          >
            <Card
              className="p-3 shadow-sm"
              style={{ flex: 1, marginRight: "0.5rem", borderRadius: "15px" }}
            >
              <h5 style={{ marginBottom: "0.3rem" }}>Login Streak</h5>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2AB7CA" }}>
                {streak} 🔥
              </p>
            </Card>
            <Card
              className="p-3 shadow-sm"
              style={{ flex: 1, marginLeft: "0.5rem", borderRadius: "15px" }}
            >
              <h5 style={{ marginBottom: "0.3rem" }}>Last Login</h5>
              <p style={{ fontSize: "1rem", color: "#555" }}>{lastLogin}</p>
            </Card>
          </div>

          <div className="d-grid mt-4">
            <Button
              variant="success"
              className="mb-2"
              style={{ borderRadius: "12px", fontWeight: "bold" }}
              onClick={() => navigate("/userhome")}
            >
              Go to Dashboard
            </Button>

            <Button
              variant="danger"
              style={{ borderRadius: "12px", fontWeight: "bold" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
}

export default Profile;
