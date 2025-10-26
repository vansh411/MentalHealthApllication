import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

function NavigationButtons() {
  const navigate = useNavigate();
  const location = useLocation();

  // Define your page order here
  const pages = ["/", "/createaccount", "/signin"];
  const currentIndex = pages.indexOf(location.pathname);

  // Get previous and next routes if available
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  return (
    <Container
      className="d-flex justify-content-between mt-4"
      style={{ maxWidth: "400px" }}
    >
      <Button
        variant="secondary"
        onClick={() => prevPage && navigate(prevPage)}
        disabled={!prevPage}
        style={{ width: "18%" }}
      >
        ← 
      </Button>

      <Button
        variant="primary"
        onClick={() => nextPage && navigate(nextPage)}
        disabled={!nextPage}
        style={{
          width: "18%",
          backgroundColor: "#2AB7CA",
          border: "none",
        }}
      >
         →
      </Button>
    </Container>
  );
}

export default NavigationButtons;
