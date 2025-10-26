import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs";

function CreateAccount() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[email]) {
      Swal.fire({
        title: "Account already exists",
        text: "Would you like to sign in instead?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Go to Sign In",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#2AB7CA",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signin");
        }
      });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    users[email] = { email, password: hashedPassword, assessment: null };
    localStorage.setItem("users", JSON.stringify(users));

    Swal.fire("Success", "Account created successfully!", "success").then(() => {
      navigate("/signin");
    });
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
          Create Account
        </h3>

        <Form onSubmit={handleSubmit} autoComplete="off">
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="new-email"
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
            Sign Up
          </Button>
        </Form>

        <p
          className="text-center mt-3"
          style={{ fontSize: "0.9rem", color: "#555" }}
        >
          Already have an account?{" "}
          <span
            style={{ color: "#2AB7CA", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </Card>
    </div>
  );
}

export default CreateAccount;
