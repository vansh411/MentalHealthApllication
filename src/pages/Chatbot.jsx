import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setMessages(prev => [...prev, { sender: "bot", text: "Thanks for sharing. I'm here to listen!" }]);
    setInput("");
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
      {open && (
        <Card style={{ width: "300px", maxHeight: "400px", overflowY: "auto" }}>
          <Card.Body>
            <div style={{ marginBottom: "10px" }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
                  <span style={{ display: "inline-block", padding: "5px 10px", borderRadius: "15px", backgroundColor: msg.sender === "user" ? "#2AB7CA" : "#E2E2E2", color: msg.sender === "user" ? "white" : "black", marginBottom: "5px" }}>
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
            <Button className="mt-2 w-100" onClick={handleSend}>Send</Button>
          </Card.Body>
        </Card>
      )}
      <Button onClick={() => setOpen(!open)} style={{ borderRadius: "50%", width: "60px", height: "60px" }}>💬</Button>
    </div>
  );
}

export default Chatbot;
