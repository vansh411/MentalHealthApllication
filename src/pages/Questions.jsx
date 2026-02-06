import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Card, Button, Form, ProgressBar, Badge } from "react-bootstrap";
import Swal from "sweetalert2";

// --------------------------------------
// ✨ IMPROVED QUESTION BANK
// --------------------------------------
// Structured to ensure we test for each condition properly
const questionsByCategory = {
  depression: [
    { q: "Over the past 2 weeks, have you felt down, depressed, or hopeless?", weight: 2 },
    { q: "Have you lost interest or pleasure in activities you used to enjoy?", weight: 2 },
    { q: "Do you feel tired or have little energy most days?", weight: 1 },
    { q: "Do you have trouble concentrating on tasks or making decisions?", weight: 1 },
    { q: "Have you experienced changes in your appetite or weight recently?", weight: 1 },
  ],
  anxiety: [
    { q: "Do you feel nervous, anxious, or on edge most of the time?", weight: 2 },
    { q: "Do you find it difficult to stop or control worrying?", weight: 2 },
    { q: "Do you worry excessively about many different things?", weight: 1 },
    { q: "Do you experience physical symptoms like rapid heartbeat or sweating when anxious?", weight: 1 },
    { q: "Do you avoid certain situations because they make you anxious?", weight: 1 },
  ],
  adhd: [
    { q: "Do you often have difficulty sustaining attention on tasks or activities?", weight: 2 },
    { q: "Are you easily distracted by external stimuli or unrelated thoughts?", weight: 2 },
    { q: "Do you frequently fail to finish tasks or follow through on instructions?", weight: 1 },
    { q: "Do you have difficulty organizing tasks and managing time?", weight: 1 },
    { q: "Do you often fidget, feel restless, or have difficulty sitting still?", weight: 1 },
  ],
  ocd: [
    { q: "Do you have recurring, unwanted thoughts that cause you distress?", weight: 2 },
    { q: "Do you feel compelled to perform certain behaviors or mental acts repeatedly?", weight: 2 },
    { q: "Do these repetitive behaviors take up a lot of your time (more than 1 hour per day)?", weight: 1 },
    { q: "Do you feel anxious or distressed if you can't perform these rituals?", weight: 1 },
  ],
  ptsd: [
    { q: "Have you experienced or witnessed a traumatic event?", weight: 2 },
    { q: "Do you have repeated, disturbing memories or nightmares about the event?", weight: 2 },
    { q: "Do you actively avoid reminders of the traumatic event?", weight: 1 },
    { q: "Are you easily startled or constantly on guard?", weight: 1 },
    { q: "Do you feel emotionally numb or detached from others?", weight: 1 },
  ],
  bipolar: [
    { q: "Have you experienced periods of unusually elevated mood or energy?", weight: 2 },
    { q: "During these periods, do you sleep less but still feel energized?", weight: 1 },
    { q: "Do you experience extreme mood swings from very high to very low?", weight: 2 },
    { q: "Have you made impulsive decisions during high-energy periods?", weight: 1 },
  ],
  sleep: [
    { q: "Do you regularly have trouble falling asleep or staying asleep?", weight: 2 },
    { q: "Do you wake up feeling tired even after a full night's sleep?", weight: 1 },
    { q: "Does poor sleep affect your daily functioning?", weight: 1 },
  ],
};

// Build a balanced question set (2-3 questions per category)
function buildQuestionSet() {
  const questions = [];
  
  // Take top weighted questions from each category
  Object.entries(questionsByCategory).forEach(([category, categoryQuestions]) => {
    // Sort by weight, take top 2-3
    const sorted = [...categoryQuestions].sort((a, b) => b.weight - a.weight);
    const toTake = category === 'sleep' ? 2 : 3; // Fewer sleep questions
    
    sorted.slice(0, toTake).forEach(item => {
      questions.push({
        category,
        question: item.q,
        weight: item.weight
      });
    });
  });
  
  // Shuffle to mix categories
  return shuffleArray(questions);
}

// Shuffle helper
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --------------------------------------
// MAIN COMPONENT
// --------------------------------------
export default function Questions() {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("loggedInUser");
  const users = JSON.parse(localStorage.getItem("users")) || {};

  useEffect(() => {
    if (!loggedInUser || !users[loggedInUser]) {
      navigate("/signin");
    }
  }, [loggedInUser, users, navigate]);

  const [questions] = useState(buildQuestionSet()); // ~18-20 questions
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const currentQuestion = questions[index];
  
  // Calculate progress by category coverage
  const getCategoryCoverage = () => {
    const answeredCategories = new Set();
    Object.keys(answers).forEach(idx => {
      if (questions[idx]) {
        answeredCategories.add(questions[idx].category);
      }
    });
    return answeredCategories.size;
  };

  const handleChange = (e) => {
    setAnswers({ ...answers, [index]: e.target.value });
  };

  // ------------------------------------------------------
  // HANDLE NEXT BUTTON
  // ------------------------------------------------------
  const handleNext = async () => {
    if (!answers[index]) {
      Swal.fire({
        title: "Please answer the question!",
        text: "We need your response to provide accurate assessment",
        icon: "warning",
        confirmButtonText: "OK"
      });
      return;
    }

    // If last question, submit
    if (index === questions.length - 1) {
      // Show loading
      Swal.fire({
        title: 'Analyzing your responses...',
        text: 'Please wait while we process your assessment',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const answerList = Object.values(answers);
      const allNo = answerList.every((a) => a === "no");

      let verdict = "";
      let condition = "No disorder detected";

      if (allNo) {
        verdict = "Great news! You don't appear to be experiencing significant mental health concerns at this time. Continue practicing self-care.";
        condition = "No disorder detected";
      } else {
        // Call backend
        try {
          const response = await fetch("http://localhost:8080/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              questions: questions.map((q) => q.question),
              answers: answerList,
              noSymptoms: false,
            }),
          });

          if (!response.ok) throw new Error("Server error");

          const data = await response.json();
          verdict = data.verdict;
          condition = (data.labels && data.labels.length > 0) ? data.labels[0] : "No disorder detected";

          console.log("Assessment result:", data);

        } catch (err) {
          console.error(err);
          Swal.fire({
            title: "Connection Error",
            text: "Unable to complete assessment. Please check if the server is running.",
            icon: "error"
          });
          return;
        }
      }

      // Save to localStorage
      localStorage.setItem("verdict", verdict);
      localStorage.setItem("condition", condition);

      // Close loading
      Swal.close();

      // Show verdict popup with options
      Swal.fire({
        title: "Assessment Complete",
        html: `
          <div style="text-align: left; padding: 10px;">
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              ${verdict}
            </p>
            <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
              <p style="font-size: 14px; color: #666; margin: 0;">
                <strong>Important:</strong> This is a preliminary screening tool, not a diagnosis. 
                Please consult a mental health professional for proper evaluation.
              </p>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "💬 Talk to AI Counselor",
        cancelButtonText: "🏠 Return Home",
        allowOutsideClick: false,
        allowEscapeKey: false,
        width: "500px",
        customClass: {
          popup: "rounded-3",
          confirmButton: "btn btn-primary mx-2",
          cancelButton: "btn btn-secondary mx-2",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          window.open("http://localhost:8501", "_blank");
          navigate("/userhome");
        } else {
          navigate("/userhome");
        }
      });

      return;
    }

    setIndex(index + 1);
  };

  const handlePrevious = () => {
    if (index > 0) setIndex(index - 1);
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      depression: "#6366f1",
      anxiety: "#f59e0b",
      adhd: "#10b981",
      ocd: "#8b5cf6",
      ptsd: "#ef4444",
      bipolar: "#ec4899",
      sleep: "#06b6d4"
    };
    return colors[category] || "#6b7280";
  };

  // ------------------------------------------------------
  // UI
  // ------------------------------------------------------
  return (
    <Container style={{ paddingTop: "3%", maxWidth: "700px" }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header with stats */}
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h3 style={{ fontWeight: 700, color: "#1f2937" }}>Mental Health Assessment</h3>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            Categories covered: {getCategoryCoverage()}/7 • 
            Questions: {index + 1}/{questions.length}
          </p>
        </div>

        <Card
          className="shadow-lg p-4 mx-auto"
          style={{
            borderRadius: "20px",
            background: "linear-gradient(135deg, #F0F7FF, #FFFFFF)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}
        >
          {/* Category badge */}
          <div style={{ marginBottom: "15px" }}>
            <Badge 
              style={{ 
                background: getCategoryColor(currentQuestion.category),
                padding: "6px 12px",
                fontSize: "12px",
                textTransform: "capitalize"
              }}
            >
              {currentQuestion.category.replace('_', ' ')}
            </Badge>
          </div>

          <h5 style={{ fontWeight: 600, marginBottom: "1rem", color: "#4b5563" }}>
            Question {index + 1} of {questions.length}
          </h5>

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p style={{ 
                fontSize: "1.15rem", 
                fontWeight: 500, 
                lineHeight: 1.6,
                color: "#1f2937",
                marginBottom: "25px"
              }}>
                {currentQuestion.question}
              </p>
            </motion.div>
          </AnimatePresence>

          <Form>
            <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
              <Form.Check
                type="radio"
                label="Yes"
                name={`q${index}`}
                value="yes"
                checked={answers[index] === "yes"}
                onChange={handleChange}
                id={`yes-${index}`}
                style={{ flex: 1 }}
                className="custom-radio"
              />
              <Form.Check
                type="radio"
                label="No"
                name={`q${index}`}
                value="no"
                checked={answers[index] === "no"}
                onChange={handleChange}
                id={`no-${index}`}
                style={{ flex: 1 }}
                className="custom-radio"
              />
            </div>
          </Form>

          <div className="d-flex justify-content-between mt-4">
            <Button 
              variant="outline-secondary" 
              onClick={handlePrevious} 
              disabled={index === 0}
              style={{ minWidth: "100px" }}
            >
              ← Previous
            </Button>
            <Button 
              variant="primary" 
              onClick={handleNext}
              style={{ 
                minWidth: "100px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none"
              }}
            >
              {index === questions.length - 1 ? "Finish ✓" : "Next →"}
            </Button>
          </div>

          <ProgressBar
            now={((index + 1) / questions.length) * 100}
            className="mt-4"
            animated
            variant="success"
            style={{ 
              height: "12px", 
              borderRadius: "10px",
              background: "#e5e7eb"
            }}
          />
          
          {/* Progress text */}
          <div style={{ 
            textAlign: "center", 
            marginTop: "10px", 
            fontSize: "13px", 
            color: "#6b7280" 
          }}>
            {Math.round(((index + 1) / questions.length) * 100)}% Complete
          </div>
        </Card>

        {/* Disclaimer */}
        <div style={{ 
          marginTop: "20px", 
          padding: "15px", 
          background: "#fef3c7", 
          borderRadius: "12px",
          fontSize: "13px",
          color: "#92400e",
          textAlign: "center"
        }}>
          ⚠️ This assessment is for informational purposes only and is not a substitute for professional diagnosis.
        </div>
      </motion.div>

      <style>{`
        .custom-radio input[type="radio"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
        
        .custom-radio label {
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          padding: 12px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          transition: all 0.2s;
        }
        
        .custom-radio input[type="radio"]:checked + label {
          background: #eff6ff;
          border-color: #3b82f6;
          color: #1e40af;
        }
      `}</style>
    </Container>
  );
}
