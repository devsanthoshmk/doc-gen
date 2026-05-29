import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "../components/Stepper";

export default function Success() {
  const navigate = useNavigate();
  const [generateHover, setGenerateHover] = useState(false);
  const [historyHover, setHistoryHover] = useState(false);

  const containerStyle: React.CSSProperties = {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f7",
    padding: "24px",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    maxWidth: "640px",
    margin: "16px auto",
    padding: "32px",
    textAlign: "center",
    maxHeight: "80vh",
    overflowY: "auto",
  };

  const contentStyle: React.CSSProperties = {
    textAlign: "center",
    maxWidth: "600px",
  };

  const checkmarkCircleStyle: React.CSSProperties = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "#5d3fd3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 32px",
    fontSize: "50px",
    color: "white",
    fontWeight: "bold",
    boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#1a1c1b",
    marginBottom: "12px",
    fontFamily: "Playfair Display, serif",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#44474d",
    marginBottom: "20px",
    lineHeight: "1.6",
    fontFamily: "DM Sans, sans-serif",
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  };

  const generateButtonStyle: React.CSSProperties = {
    backgroundColor: "#5d3fd3",
    color: "white",
    border: "none",
    padding: "14px 32px",
    borderRadius: "4px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  };

  const generateButtonHoverStyle: React.CSSProperties = {
    ...generateButtonStyle,
    backgroundColor: "#4e2ca8",
  };

  const historyButtonStyle: React.CSSProperties = {
    backgroundColor: "white",
    color: "#5d3fd3",
    border: "2px solid #5d3fd3",
    padding: "14px 32px",
    borderRadius: "4px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const historyButtonHoverStyle: React.CSSProperties = {
    ...historyButtonStyle,
    backgroundColor: "#f3e8ff",
  };

  return (
    <>
      <Stepper currentStep={4} />
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={contentStyle}>
            {/* Green Checkmark Circle */}
            <div style={checkmarkCircleStyle}>✓</div>

            {/* Title */}
            <h1 style={titleStyle}>Document Sent Successfully!</h1>

            {/* Subtitle */}
            <p style={subtitleStyle}>
              Your document and email have been sent to the client.
            </p>

            {/* Buttons */}
            <div style={buttonContainerStyle}>
              <button
                style={
                  generateHover ? generateButtonHoverStyle : generateButtonStyle
                }
                onMouseEnter={() => setGenerateHover(true)}
                onMouseLeave={() => setGenerateHover(false)}
                onClick={() => navigate("/generate/select-template")}
              >
                Generate Another Document
              </button>
              <button
                style={
                  historyHover ? historyButtonHoverStyle : historyButtonStyle
                }
                onMouseEnter={() => setHistoryHover(true)}
                onMouseLeave={() => setHistoryHover(false)}
                onClick={() => navigate("#")}
              >
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
