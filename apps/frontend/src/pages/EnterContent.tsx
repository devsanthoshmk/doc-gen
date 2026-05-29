import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGenerate } from "../context/useGenerate";
import { dummyDocument } from "../data/dummyDocument";
import Stepper from "../components/Stepper";
import { IconSparkles, IconFileDescription } from "@tabler/icons-react";

type PageState = "idle" | "loading" | "review";

export default function EnterContent() {
  const [pageState, setPageState] = useState<PageState>("idle");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [editableDocument] = useState(dummyDocument);
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const navigate = useNavigate();
  const { content, setContent } = useGenerate();

  const documentLines = dummyDocument.split("\n");

  useEffect(() => {
    if (pageState === "review") {
      const interval = setInterval(() => {
        setVisibleLines((prev) => {
          if (prev.length < documentLines.length) {
            return [...prev, documentLines[prev.length]];
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [pageState, documentLines]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleGenerateDocument = () => {
    setPageState("loading");
    setTimeout(() => {
      setPageState("review");
    }, 3000);
  };

  const handleApprove = () => {
    navigate("/generate/review-email");
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

  // Styles
  const containerStyle: React.CSSProperties = {
    padding: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const contentWrapperStyle: React.CSSProperties = {
    display: "flex",
    gap: "32px",
  };

  const leftColumnStyle: React.CSSProperties = {
    width: "32%",
    display: "flex",
    flexDirection: "column",
  };

  const rightColumnStyle: React.CSSProperties = {
    width: "68%",
    display: "flex",
    flexDirection: "column",
  };

  const leftCardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    position: "relative",
  };

  const purpleTopBorderStyle: React.CSSProperties = {
    height: "3px",
    background: "linear-gradient(90deg, #5d3fd3 0%, #7c3aed 100%)",
    width: "100%",
  };

  const leftCardContentStyle: React.CSSProperties = {
    padding: "32px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: 700,
    color: "#111827",
    fontFamily: "Playfair Display",
    marginBottom: "12px",
    margin: "0 0 12px 0",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: "1.6",
    marginBottom: "24px",
    fontFamily: "DM Sans",
    margin: "0 0 24px 0",
  };

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "200px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "16px",
    fontSize: "15px",
    fontFamily: "DM Sans",
    color: "#374151",
    boxSizing: "border-box",
    fontStyle: "normal",
  };

  const hintBadgeStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "12px",
    fontSize: "13px",
    color: "#5d3fd3",
    fontWeight: 500,
  };

  const generateButtonStyle: React.CSSProperties = {
    marginTop: "24px",
    width: "100%",
    background: "linear-gradient(135deg, #5d3fd3 0%, #7c3aed 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease",
  };

  const rightCardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    minHeight: "500px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px",
    textAlign: "center",
  };

  const idleIconWrapperStyle: React.CSSProperties = {
    width: "80px",
    height: "80px",
    borderRadius: "20px",
    background: "#ede9fe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
  };

  const idleTitleStyle: React.CSSProperties = {
    fontSize: "22px",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "12px",
    fontFamily: "DM Sans",
    margin: "0 0 12px 0",
  };

  const idleDescriptionStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.6",
    maxWidth: "360px",
    marginBottom: "32px",
    fontFamily: "DM Sans",
    margin: "0 auto 32px auto",
  };

  const skeletonBarStyle: (width: string) => React.CSSProperties = (
    width: string,
  ) => ({
    background: "#f3f4f6",
    borderRadius: "6px",
    height: "12px",
    marginBottom: "12px",
    width,
    margin: `0 ${width === "50%" ? "auto 0 auto" : "auto 12px auto"}`,
  });

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

  const pageViewerContainerStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    padding: "0",
    maxHeight: "600px",
    overflowY: "auto",
    width: "100%",
  };

  const pageStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "auto",
    padding: "24px 0",
    marginBottom: "32px",
    position: "relative",
    textAlign: "left",
    borderBottom: "1px solid #f0f0f0",
  };

  const paragraphStyle: React.CSSProperties = {
    fontSize: "13px",
    lineHeight: "1.8",
    color: "#1a1c1b",
    fontFamily: "DM Sans, sans-serif",
    marginBottom: "16px",
    textDecoration: "none",
    textAlign: "left",
  };

  const pageNumberStyle: React.CSSProperties = {
    fontSize: "11px",
    color: "#75777e",
    textAlign: "center",
    position: "absolute",
    bottom: "16px",
    width: "100%",
    left: "0",
  };

  const documentTextStyle: React.CSSProperties = {
    fontSize: "14px",
    lineHeight: "1.8",
    color: "#333",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
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
    .reveal-line {
      animation: lineReveal 0.4s ease forwards;
    }
  `;

  return (
    <>
      <Stepper currentStep={2} />
      <style>{keyframes}</style>
      <div style={containerStyle}>
        <div style={contentWrapperStyle}>
          {/* Left Column */}
          <div style={leftColumnStyle}>
            <div style={leftCardStyle}>
              <div style={purpleTopBorderStyle}></div>
              <div style={leftCardContentStyle}>
                {pageState !== "review" ? (
                  <>
                    <h1 style={titleStyle}>Generate Document</h1>
                    <p style={subtitleStyle}>
                      Describe your requirements below. Our AI will draft the
                      document based on your inputs.
                    </p>
                    <textarea
                      style={textareaStyle}
                      placeholder="Type your content here... For example: 'Draft a non-disclosure agreement for a new software contractor, including standard confidentiality clauses and a 2-year term.'"
                      value={content}
                      onChange={handleTextareaChange}
                    />
                    <div style={hintBadgeStyle}>
                      <IconSparkles size={14} />
                      <span>Be specific for better results</span>
                    </div>
                    <button
                      style={{
                        ...generateButtonStyle,
                        opacity: content.trim() === "" ? 0.6 : 1,
                        cursor:
                          content.trim() === "" ? "not-allowed" : "pointer",
                      }}
                      onClick={handleGenerateDocument}
                      disabled={content.trim() === ""}
                      onMouseEnter={(e) => {
                        if (content.trim() !== "") {
                          e.currentTarget.style.boxShadow =
                            "0 8px 24px rgba(93,63,211,0.3)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <IconSparkles size={20} />
                      Generate Document
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        color: "#5d3fd3",
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "1px",
                        marginBottom: "16px",
                      }}
                    >
                      ✦ AI GENERATED
                    </div>
                    <h2
                      style={{
                        fontFamily: "Playfair Display",
                        fontSize: "28px",
                        color: "#111827",
                        marginBottom: "12px",
                        margin: "0 0 12px 0",
                      }}
                    >
                      Document Ready
                    </h2>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "14px",
                        marginBottom: "32px",
                        margin: "0 0 32px 0",
                      }}
                    >
                      Review your generated document. It has been populated
                      using your inputs.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <button
                        style={{
                          width: "100%",
                          padding: "12px 24px",
                          fontSize: "16px",
                          fontWeight: "600",
                          border: "2px solid #5d3fd3",
                          borderRadius: "8px",
                          backgroundColor: "#5d3fd3",
                          color: "#ffffff",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onClick={handleApprove}
                      >
                        Approve
                      </button>
                      <button
                        style={{
                          width: "100%",
                          padding: "12px 24px",
                          fontSize: "16px",
                          fontWeight: "600",
                          border: "2px solid #ef4444",
                          borderRadius: "8px",
                          backgroundColor: "transparent",
                          color: "#ef4444",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onClick={handleRejectClick}
                      >
                        Reject with Feedback
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={rightColumnStyle}>
            <div style={rightCardStyle}>
              {pageState === "idle" ? (
                <>
                  <div style={idleIconWrapperStyle}>
                    <IconFileDescription size={36} color="#7c3aed" />
                  </div>
                  <h2 style={idleTitleStyle}>Ready to generate</h2>
                  <p style={idleDescriptionStyle}>
                    Your document will appear here once you provide requirements
                    and click generate. You can then review and refine the
                    content.
                  </p>
                  <div style={skeletonBarStyle("60%")}></div>
                  <div style={skeletonBarStyle("80%")}></div>
                  <div style={skeletonBarStyle("50%")}></div>
                </>
              ) : pageState === "loading" ? (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: "32px",
                  }}
                >
                  {["90%", "75%", "85%", "60%", "80%", "70%", "90%", "65%"].map(
                    (width, index) => (
                      <div
                        key={index}
                        style={{
                          ...skeletonBarStyle(width),
                          animation: "pulse 2s ease-in-out infinite",
                        }}
                      ></div>
                    ),
                  )}
                </div>
              ) : pageState === "review" && visibleLines.length > 0 ? (
                <div
                  style={{
                    ...pageViewerContainerStyle,
                    color: "#1a1c1b",
                  }}
                >
                  {(() => {
                    const displayText =
                      visibleLines.length > 0
                        ? visibleLines.join("\n")
                        : editableDocument;
                    const paragraphs = displayText
                      .split("\n\n")
                      .filter((p) => p.trim());
                    const paragraphsPerPage = 8;
                    const totalPages = Math.ceil(
                      paragraphs.length / paragraphsPerPage,
                    );

                    return (
                      <>
                        {Array.from({ length: totalPages }).map(
                          (_, pageIndex) => {
                            const startIdx = pageIndex * paragraphsPerPage;
                            const endIdx = Math.min(
                              startIdx + paragraphsPerPage,
                              paragraphs.length,
                            );
                            const pageParagraphs = paragraphs.slice(
                              startIdx,
                              endIdx,
                            );

                            return (
                              <div
                                key={pageIndex}
                                style={{
                                  ...pageStyle,
                                  ...(pageIndex === 0 && {
                                    borderTop: "3px solid #5d3fd3",
                                  }),
                                }}
                              >
                                {pageParagraphs.map((paragraph, paraIndex) => (
                                  <div key={paraIndex} style={paragraphStyle}>
                                    {paragraph}
                                  </div>
                                ))}
                                <div style={pageNumberStyle}>
                                  Page {pageIndex + 1} of {totalPages}
                                </div>
                              </div>
                            );
                          },
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div style={documentTextStyle}>{editableDocument}</div>
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
