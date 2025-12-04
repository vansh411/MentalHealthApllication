import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Card, Button, Form, ProgressBar } from "react-bootstrap";
import Swal from "sweetalert2";

// Question bank
const fullQuestionBank = [
  { category: "depression", question: "Have you recently felt sad, empty, or hopeless?" },
  { category: "depression", question: "Do you have little interest or pleasure in doing things?" },
  { category: "depression", question: "Do you feel tired or have little energy?" },
  { category: "anxiety", question: "Do you often feel nervous, anxious, or on edge?" },
  { category: "anxiety", question: "Do you worry too much about different things?" },
  { category: "adhd", question: "Do you frequently have trouble focusing on tasks?" },
  { category: "adhd", question: "Do you get easily distracted by your surroundings?" },
  { category: "ocd", question: "Do you have repetitive thoughts that are hard to control?" },
  { category: "ocd", question: "Do you feel compelled to perform certain actions repeatedly?" },
  { category: "ptsd", question: "Do you experience flashbacks or intrusive memories?" },
  { category: "ptsd", question: "Do reminders of past events make you extremely upset?" },
  { category: "schizophrenia", question: "Do you hear or see things others do not?" },
  { category: "sleep", question: "Do you have trouble falling or staying asleep?" },
  { category: "bipolar", question: "Have you experienced sudden periods of high energy?" },
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRandomQuestions(fullList, count = 8) {
  return shuffleArray(fullList).slice(0, count);
}

function Questions() {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("loggedInUser");
  const users = JSON.parse(localStorage.getItem("users")) || {};

  useEffect(() => {
    if (!loggedInUser || !users[loggedInUser]) {
      navigate("/signin");
    }
  }, [loggedInUser, users, navigate]);

  const [questions] = useState(getRandomQuestions(fullQuestionBank, 8));
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const currentQuestion = questions[index];

  const handleChange = (e) => {
    setAnswers({ ...answers, [index]: e.target.value });
  };

  const handleNext = async () => {
    if (!answers[index]) {
      Swal.fire("Please answer the question!", "", "warning");
      return;
    }

    if (index === questions.length - 1) {
      const answerList = Object.values(answers);
      const allNo = answerList.every((a) => a === "no");

      try {
        const response = await fetch("http://localhost:8080/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questions: questions.map((q) => q.question),
            answers: answerList,
            noSymptoms: allNo,
          }),
        });

        if (!response.ok) throw new Error("Server response not OK");

        const data = await response.json();
        localStorage.setItem("verdict", data.verdict);

        Swal.fire("Assessment Complete!", `Your result: ${data.verdict}`, "success").then(() =>
          navigate("/userhome")
        );
      } catch (error) {
        console.error("Prediction error:", error);
        // Clear any previous verdict to avoid stale data
        localStorage.removeItem("verdict");
        Swal.fire("Error", "Backend server is unavailable. Please try again later.", "error");
      }

      return;
    }

    setIndex(index + 1);
  };

  const handlePrevious = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <Container style={{ paddingTop: "5%", maxWidth: "650px" }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card
          className="shadow-lg p-4 mx-auto"
          style={{
            borderRadius: "20px",
            background: "linear-gradient(135deg, #F0F7FF, #FFFFFF)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}
        >
          <motion.h5
            className="mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Question {index + 1} / {questions.length}
          </motion.h5>

          <motion.p
            style={{ fontSize: "1.2rem", fontWeight: 600 }}
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {currentQuestion.question}
          </motion.p>

          <Form>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <Form.Check
                type="radio"
                label="Yes"
                name={`q${index}`}
                value="yes"
                checked={answers[index] === "yes"}
                onChange={handleChange}
                className="my-2"
              />
              <Form.Check
                type="radio"
                label="No"
                name={`q${index}`}
                value="no"
                checked={answers[index] === "no"}
                onChange={handleChange}
                className="my-2"
              />
            </motion.div>
          </Form>

          <div className="d-flex justify-content-between mt-4">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button variant="secondary" onClick={handlePrevious} disabled={index === 0}>
                Previous
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="success"
                onClick={handleNext}
                style={{ fontWeight: "600", paddingLeft: "20px", paddingRight: "20px" }}
              >
                {index === questions.length - 1 ? "Finish" : "Next"}
              </Button>
            </motion.div>
          </div>

          <ProgressBar
            now={((index + 1) / questions.length) * 100}
            className="mt-4"
            animated
            style={{ height: "10px", borderRadius: "10px" }}
          />
        </Card>
      </motion.div>
    </Container>
  );
}

export default Questions;
