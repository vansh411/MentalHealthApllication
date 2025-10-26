import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Form, ProgressBar } from "react-bootstrap";
import Swal from "sweetalert2";

// Question bank
const questionBank = [
  { type: "Depression", question: "How have you been feeling lately?" },
  { type: "Anxiety", question: "Are there thoughts or worries on your mind?" },
  { type: "ADHD", question: "Describe your focus or attention recently." },
  { type: "PTSD", question: "Any recent memories or feelings triggered by past events?" },
  { type: "Sleep", question: "How would you describe your sleep quality?" },
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function Questions() {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("loggedInUser");
  const users = JSON.parse(localStorage.getItem("users")) || {};

  // Redirect if not logged in
  useEffect(() => {
    if (!loggedInUser || !users[loggedInUser]) {
      navigate("/signin");
    }
  }, [loggedInUser, users, navigate]);

  // Shuffle questions once
  const [questions] = useState(shuffleArray(questionBank));
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // store answers by question index

  const handleChange = (e) => {
    setAnswers({ ...answers, [index]: e.target.value });
  };

  const handleNext = async () => {
  if (!answers[index] || answers[index].trim() === "") {
    Swal.fire("Please write something before continuing!", "", "warning");
    return;
  }

  if (index < questions.length - 1) {
    setIndex(index + 1);
  } else {
    // Save locally
    const updatedUsers = JSON.parse(localStorage.getItem("users")) || {};
    updatedUsers[loggedInUser].assessment = answers;
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    const assessmentCompleted = JSON.parse(localStorage.getItem("assessmentCompleted") || "{}");
    assessmentCompleted[loggedInUser] = true;
    localStorage.setItem("assessmentCompleted", JSON.stringify(assessmentCompleted));

    try {
      // ✅ Send answers to backend Node.js server
      const response = await fetch("http://localhost:8080/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: Object.values(answers) }),
      });

      const data = await response.json();
      const verdict = data.verdict;

      // Save verdict in localStorage for UserHome.jsx
      localStorage.setItem("verdict", verdict);

      Swal.fire("Done!", "Your responses have been submitted.", "success").then(() =>
        navigate("/userhome")
      );
    } catch (error) {
      Swal.fire("Error", "Failed to submit your answers!", "error");
      console.error("Prediction error:", error);
    }
  }
};

  const handlePrevious = () => {
    if (index > 0) setIndex(index - 1);
  };

  const currentQuestion = questions[index];

  return (
    <Container style={{ paddingTop: "5%", maxWidth: "650px" }}>
      <Card className="shadow p-4 mx-auto" style={{ borderRadius: "15px", background: "#F8FAFC" }}>
        <h5 className="mb-3">
          Question {index + 1} / {questions.length}
        </h5>
        <p style={{ fontSize: "1.1rem", fontWeight: 500 }}>{currentQuestion.question}</p>

        <Form.Control
          as="textarea"
          rows={5}
          value={answers[index] || ""}
          onChange={handleChange}
          placeholder="Write your thoughts here..."
          style={{
            marginTop: "1rem",
            borderRadius: "12px",
            padding: "1rem",
            fontSize: "1rem",
            resize: "vertical",
          }}
        />

        <div className="d-flex justify-content-between mt-4">
          <Button variant="secondary" onClick={handlePrevious} disabled={index === 0}>
            Previous
          </Button>
          <Button variant="success" onClick={handleNext}>
            {index === questions.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>

        <ProgressBar
          now={((index + 1) / questions.length) * 100}
          className="mt-3"
          animated
          style={{ height: "8px", borderRadius: "5px" }}
        />
      </Card>
    </Container>
  );
}

export default Questions;
