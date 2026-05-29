import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyEmail } from "../data/dummyEmail";
import Stepper from "../components/Stepper";

export default function ReviewEmail() {
  const [pageState, setPageState] = useState("loading");
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageState("review");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (pageState === "review") {
      const emailLines = [
        "To: " + dummyEmail.to,
        "Subject: " + dummyEmail.subject,
        "---",
        ...dummyEmail.body
          .split("\n")
          .filter((line) => line !== undefined && line !== null),
      ];

      let lineIndex = 0;
      const interval = setInterval(() => {
        if (lineIndex < emailLines.length) {
          setVisibleLines((prev) => [...prev, emailLines[lineIndex]]);
          lineIndex++;
        } else {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [pageState]);

  const handleApprove = () => {
    navigate("/generate/success");
  };

  const handleRejectClick = () => {
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = () => {
    console.log("Feedback submitted:", feedback);
    setFeedback("");
    setShowFeedbackModal(false);
  };

  const handleCancelFeedback = () => {
    setFeedback("");
    setShowFeedbackModal(false);
  };

  const containerStyle: React.CSSProperties = {
    padding: "32px",
    minHeight: "100vh",
    backgroundColor: "#f9f9f7",
  };

  const contentWrapperStyle: React.CSSProperties = {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    gap: "32px",
  };

  const leftColumnStyle: React.CSSProperties = {
    width: "36%",
    display: "flex",
    flexDirection: "column",
  };

  const rightColumnStyle: React.CSSProperties = {
    width: "65%",
    display: "flex",
    flexDirection: "column",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "32px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#1a1c1b",
    fontFamily: "Playfair Display, serif",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "400",
    color: "#44474d",
    marginBottom: "24px",
    fontFamily: "DM Sans, sans-serif",
  };

  const buttonStyle: (
    variant: "primary" | "outline-purple" | "outline-red",
  ) => React.CSSProperties = (variant) => {
    const baseStyle: React.CSSProperties = {
      width: "100%",
      padding: "12px 24px",
      fontSize: "16px",
      fontWeight: "600",
      border: "2px solid",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginBottom: "12px",
    };

    if (variant === "primary") {
      return {
        ...baseStyle,
        backgroundColor: "#5d3fd3",
        color: "white",
        borderColor: "#5d3fd3",
      };
    } else if (variant === "outline-purple") {
      return {
        ...baseStyle,
        backgroundColor: "transparent",
        color: "#5d3fd3",
        borderColor: "#5d3fd3",
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: "transparent",
        color: "#ef4444",
        borderColor: "#ef4444",
      };
    }
  };

  const modalOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: showFeedbackModal ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    maxWidth: "500px",
    width: "90%",
  };

  const modalTitleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "16px",
  };

  const feedbackTextareaStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "150px",
    padding: "12px",
    fontSize: "14px",
    fontFamily: "inherit",
    border: "2px solid #e0e0e0",
    borderRadius: "6px",
    resize: "vertical",
    boxSizing: "border-box",
    marginBottom: "16px",
  };

  const modalButtonContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  };

  const modalButtonStyle: (
    variant: "primary" | "secondary",
  ) => React.CSSProperties = (variant) => ({
    padding: "10px 24px",
    fontSize: "14px",
    fontWeight: "600",
    border: "2px solid",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: variant === "primary" ? "#5d3fd3" : "transparent",
    color: variant === "primary" ? "white" : "#5d3fd3",
    borderColor: "#5d3fd3",
  });

  const cardStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: "6px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    flex: 1,
    padding: "32px",
    border: "1px solid rgba(0,0,0,0.1)",
  };

  const leftColumnCardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  };

  const gradientBarStyle: React.CSSProperties = {
    height: "3px",
    background: "linear-gradient(90deg, #5d3fd3 0%, #7c3aed 100%)",
    width: "100%",
  };

  const leftColumnPaddingStyle: React.CSSProperties = {
    padding: "32px",
  };

  const aiGeneratedLabelStyle: React.CSSProperties = {
    color: "#5d3fd3",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "1px",
    marginBottom: "12px",
  };

  const skeletonLineStyle: React.CSSProperties = {
    height: "12px",
    backgroundColor: "#e8e8e8",
    borderRadius: "4px",
    marginBottom: "12px",
    animation: "pulse 2s ease-in-out infinite",
  };

  const emailLabelStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "4px",
    fontFamily: "DM Sans, sans-serif",
  };

  const emailFieldStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#333",
    marginBottom: "12px",
    wordBreak: "break-all",
    fontFamily: "DM Sans, sans-serif",
  };

  const dividerStyle: React.CSSProperties = {
    height: "1px",
    backgroundColor: "#e0e0e0",
    margin: "16px 0",
  };

  const emailBodyStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#333",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    fontFamily: "DM Sans, sans-serif",
  };

  const keyframes = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes lineReveal {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <Stepper currentStep={3} />
      <div style={containerStyle}>
        <div style={contentWrapperStyle}>
          {/* Left Column */}
          <div style={leftColumnStyle}>
            {pageState === "loading" ? (
              <>
                <h1 style={titleStyle}>Generating Email...</h1>
                <p style={subtitleStyle}>
                  Please wait while we prepare your email
                </p>
              </>
            ) : (
              <div style={leftColumnCardStyle}>
                <div style={gradientBarStyle}></div>
                <div style={leftColumnPaddingStyle}>
                  <div style={aiGeneratedLabelStyle}>✦ AI GENERATED</div>
                  <h1 style={titleStyle}>Email Ready</h1>
                  <p style={subtitleStyle}>Review your generated email</p>
                  <div style={{ marginTop: "24px" }}>
                    <button
                      style={buttonStyle("primary")}
                      onClick={handleApprove}
                    >
                      Approve
                    </button>
                    <button
                      style={buttonStyle("outline-red")}
                      onClick={handleRejectClick}
                    >
                      Reject with Feedback
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div style={rightColumnStyle}>
            <div style={cardStyle}>
              {pageState === "loading" ? (
                <>
                  {["90%", "75%", "85%", "60%", "80%", "70%", "90%", "65%"].map(
                    (width, index) => (
                      <div
                        key={index}
                        style={{
                          ...skeletonLineStyle,
                          width,
                        }}
                      ></div>
                    ),
                  )}
                </>
              ) : (
                <div>
                  {visibleLines.map((line, index) => {
                    if (!line) return null;

                    if (line === "---") {
                      return (
                        <div
                          key={index}
                          style={{
                            ...dividerStyle,
                            animation: `lineReveal 0.4s ease ${index * 0.05}s both`,
                          }}
                        ></div>
                      );
                    } else if (
                      line.startsWith("To:") ||
                      line.startsWith("Subject:")
                    ) {
                      return (
                        <div
                          key={index}
                          style={{
                            animation: `lineReveal 0.4s ease ${index * 0.05}s both`,
                            marginBottom: "8px",
                          }}
                        >
                          <div style={emailLabelStyle}>
                            {line.split(":")[0]}:
                          </div>
                          <div style={emailFieldStyle}>
                            {line.substring(line.indexOf(":") + 2)}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={index}
                          style={{
                            ...emailBodyStyle,
                            animation: `lineReveal 0.4s ease ${index * 0.05}s both`,
                          }}
                        >
                          {line}
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <div style={modalOverlayStyle}>
        <div style={modalContentStyle}>
          <h2 style={modalTitleStyle}>Provide Feedback</h2>
          <textarea
            style={feedbackTextareaStyle}
            placeholder="Please describe what needs to be changed..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <div style={modalButtonContainerStyle}>
            <button
              style={modalButtonStyle("secondary")}
              onClick={handleCancelFeedback}
            >
              Cancel
            </button>
            <button
              style={modalButtonStyle("primary")}
              onClick={handleSubmitFeedback}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
