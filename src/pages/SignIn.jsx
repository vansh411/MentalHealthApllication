import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (!users[email]) {
      Swal.fire("Error", "User not found", "error");
      return;
    }

    if (!bcrypt.compareSync(password, users[email].password)) {
      Swal.fire("Error", "Incorrect password", "error");
      return;
    }

    localStorage.setItem("loggedInUser", email);

    if (users[email].assessment) {
      navigate("/userhome");
    } else {
      navigate("/questions");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #E0F7FA, #B2EBF2)",
        fontFamily: "Poppins, sans-serif",
        padding: "2rem",
      }}
    >
      <Card
        className="shadow"
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "2.5rem 2rem",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        }}
      >
        <h3
          className="text-center mb-4"
          style={{ fontWeight: "bold", color: "#222" }}
        >
          Sign In
        </h3>
        <Form onSubmit={handleLogin} autoComplete="off">
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              style={{
                borderRadius: "12px",
                padding: "0.75rem",
                border: "1px solid #ccc",
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              style={{
                borderRadius: "12px",
                padding: "0.75rem",
                border: "1px solid #ccc",
              }}
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100"
            style={{
              backgroundColor: "#2AB7CA",
              border: "none",
              padding: "0.75rem",
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderRadius: "12px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#2196A0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2AB7CA";
            }}
          >
            Sign In
          </Button>
        </Form>

        <p
          className="text-center mt-3"
          style={{ fontSize: "0.9rem", color: "#555" }}
        >
          Don’t have an account?{" "}
          <span
            style={{ color: "#2AB7CA", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/createaccount")}
          >
            Sign Up
          </span>
        </p>
      </Card>
    </div>
  );
}

export default SignIn;
