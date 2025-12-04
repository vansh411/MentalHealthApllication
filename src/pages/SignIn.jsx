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
    const user = users[email];

    if (!user) {
      Swal.fire("Error", "User not found", "error");
      return;
    }

    // OAuth users don’t require password
    if (user.oauth) {
      localStorage.setItem("loggedInUser", email);
      navigate(user.assessment ? "/userhome" : "/");
      return;
    }

    if (!user.password) {
      Swal.fire("Error", "User password is missing. Please reset your account.", "error");
      return;
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      Swal.fire("Error", "Incorrect password", "error");
      return;
    }

    localStorage.setItem("loggedInUser", email);
    navigate(user.assessment ? "/userhome" : "/");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #E0F7FA, #B2EBF2)" }}>
      <Card style={{ maxWidth: "400px", width: "100%", padding: "2.5rem 2rem", borderRadius: "20px" }}>
        <h3 className="text-center mb-4">Sign In</h3>
        <Form onSubmit={handleLogin} autoComplete="off">
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>

          <Button type="submit" className="w-100">Sign In</Button>
        </Form>

        <p className="text-center mt-3">
          Don’t have an account? <span style={{ color: "#2AB7CA", cursor: "pointer" }} onClick={() => navigate("/createaccount")}>Sign Up</span>
        </p>
      </Card>
    </div>
  );
}

export default SignIn;
