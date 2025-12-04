import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { auth, googleProvider, facebookProvider, signInWithPopup } from "./firebase";

function CreateAccount() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
  }, []);

  const saveUser = (user) => {
    let users = JSON.parse(localStorage.getItem("users")) || {};
    users[user.email] = user;
    localStorage.setItem("users", JSON.stringify(users));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
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
        if (result.isConfirmed) navigate("/signin");
      });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    saveUser({
      username,
      email,
      password: hashedPassword,
      assessment: null,
      oauth: false,
    });

    Swal.fire("Success", "Account created successfully! Please sign in.", "success").then(() => {
      navigate("/signin");
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      saveUser({
        username: user.displayName || "Google User",
        email: user.email,
        displayName: user.displayName,
        oauth: true,
        assessment: null,
      });

      Swal.fire("Success", `Welcome ${user.displayName}!`, "success");
      localStorage.setItem("loggedInUser", user.email);
      navigate("/");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      saveUser({
        username: user.displayName || "Facebook User",
        email: user.email,
        displayName: user.displayName,
        oauth: true,
        assessment: null,
      });

      Swal.fire("Success", `Welcome ${user.displayName}!`, "success");
      localStorage.setItem("loggedInUser", user.email);
      navigate("/");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #F5F7FA, #E8EEF4)",
        fontFamily: "Poppins, sans-serif",
        padding: "2rem",
      }}
    >
      <Card
        style={{
          maxWidth: "450px",
          width: "100%",
          padding: "3rem 2rem",
          borderRadius: "25px",
          background: "#fff",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
        }}
      >
        <h2 className="text-center mb-4" style={{ fontWeight: "700", color: "#222" }}>
          Create Account
        </h2>

        <Form onSubmit={handleSubmit} autoComplete="off">

          {/* USERNAME FIELD */}
          <Form.Group className="mb-3">
            <Form.Label>name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                borderRadius: "12px",
                padding: "0.85rem",
                border: "1px solid #ddd",
                fontSize: "0.95rem",
                transition: "0.3s",
              }}
            />
          </Form.Group>

          {/* EMAIL FIELD */}
          <Form.Group className="mb-3">
            <Form.Label>email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                borderRadius: "12px",
                padding: "0.85rem",
                border: "1px solid #ddd",
                fontSize: "0.95rem",
                transition: "0.3s",
              }}
            />
          </Form.Group>

          {/* PASSWORD FIELD */}
          <Form.Group className="mb-4">
            <Form.Label>password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                borderRadius: "12px",
                padding: "0.85rem",
                border: "1px solid #ddd",
                fontSize: "0.95rem",
              }}
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100"
            style={{
              background: "linear-gradient(90deg, #2AB7CA, #2196A0)",
              border: "none",
              padding: "0.85rem",
              fontSize: "1.1rem",
              fontWeight: "600",
              borderRadius: "15px",
              transition: "all 0.3s ease",
            }}
          >
            Sign Up
          </Button>
        </Form>

        {/* OAUTH BUTTONS */}
        <div className="d-flex justify-content-between mt-4">
          <Button
            onClick={handleGoogleSignIn}
            style={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              flex: 1,
              marginRight: "0.5rem",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.65rem",
              transition: "0.3s",
            }}
          >
            <FcGoogle size={28} />
          </Button>

          <Button
            onClick={handleFacebookSignIn}
            style={{
              backgroundColor: "#4267B2",
              color: "#fff",
              border: "none",
              flex: 1,
              marginLeft: "0.5rem",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.65rem",
            }}
          >
            <FaFacebookF size={24} />
          </Button>
        </div>

        <p className="text-center mt-4" style={{ fontSize: "0.9rem", color: "#555" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#2AB7CA", cursor: "pointer", fontWeight: "600" }}
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
