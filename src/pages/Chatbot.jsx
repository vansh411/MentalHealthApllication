import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const botMessage = { sender: "bot", text: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const botMessage = { sender: "bot", text: "Sorry, I couldn't process your message." };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
      {open && (
        <Card style={{ width: "300px", maxHeight: "400px", overflowY: "auto" }}>
          <Card.Body>
            <div style={{ marginBottom: "10px" }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "5px 10px",
                      borderRadius: "15px",
                      backgroundColor: msg.sender === "user" ? "#2AB7CA" : "#E2E2E2",
                      color: msg.sender === "user" ? "white" : "black",
                      marginBottom: "5px",
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>
            <Form.Control
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button className="mt-2 w-100" onClick={handleSend} disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </Button>
          </Card.Body>
        </Card>
      )}
      <Button
        onClick={() => setOpen(!open)}
        style={{ borderRadius: "50%", width: "60px", height: "60px" }}
      >
        💬
      </Button>
    </div>
  );
}

export default Chatbot;
