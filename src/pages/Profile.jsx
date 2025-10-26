import React from "react";
import { Container, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("loggedInUser");

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <Container style={{ paddingTop: "5%" }}>
      <Card className="shadow p-4 mx-auto" style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-3">Profile</h3>
        <p><strong>Email:</strong> {loggedInUser}</p>
        <Button className="w-100 mb-2" onClick={() => navigate("/userhome")}>Go to Dashboard</Button>
        <Button className="w-100 mb-2" onClick={handleLogout} variant="danger">Logout</Button>
      </Card>
    </Container>
  );
}

export default Profile;
