// src/pages/UserHome.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Card, Row, Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const UserHome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

const [verdict, setVerdict] = React.useState("");

useEffect(() => {
  const storedVerdict = localStorage.getItem("verdict");
  if (storedVerdict) setVerdict(storedVerdict);
}, []);


  // Dummy chart data for mood tracking
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Mood Level",
        data: [3, 4, 2, 5, 4, 3, 4],
        borderColor: "#2AB7CA",
        backgroundColor: "#88D498",
        tension: 0.4,
      },
    ],
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand>User Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll" className="justify-content-end">
            <Nav>
              <Nav.Link onClick={() => navigate("/profile")}>Profile</Nav.Link>
              <Nav.Link onClick={() => {
                localStorage.removeItem("user");
                navigate("/");
              }}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">
        <h2>Welcome, {user?.email || "Guest"}!</h2>
        <p>Here's your weekly mood summary:</p>

        <Card className="shadow-sm p-3 mb-4">
          <Line data={data} />
        </Card>

        <Card className="p-3 shadow-sm mt-4">
            <Card.Title>Your Mental Health Verdict</Card.Title>
            <Card.Text>
              {verdict ? verdict : "No assessment yet. Please complete your first test."}
            </Card.Text>
        </Card>


        <Row className="g-4">
          <Col md={6}>
            <Card className="p-3 shadow-sm">
              <Card.Title>Take New Assessment</Card.Title>
              <Card.Text>
                Answer a new set of questions to track your mental health.
              </Card.Text>
              <Card.Footer>
                <button className="btn btn-primary" onClick={() => navigate("/questions")}>
                  Start Assessment
                </button>
              </Card.Footer>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-3 shadow-sm">
              <Card.Title>View Reports</Card.Title>
              <Card.Text>
                Access personalized reports and insights based on previous assessments.
              </Card.Text>
              <Card.Footer>
                <button className="btn btn-success" onClick={() => alert("Feature coming soon!")}>
                  View Reports
                </button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserHome;
