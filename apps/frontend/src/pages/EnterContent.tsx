import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGenerate } from "../context/useGenerate";
import { dummyDocument } from "../data/dummyDocument";
import Stepper from "../components/Stepper";
import { IconSparkles, IconFileDescription, IconArrowRight, IconX } from "@tabler/icons-react";

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
      }, 30);
      return () => clearInterval(interval);
    }
  }, [pageState, documentLines]);

  const handleGenerateDocument = () => {
    setPageState("loading");
    setTimeout(() => {
      setPageState("review");
    }, 2000);
  };

  const skeletonBarStyle = (width: string): React.CSSProperties => ({
    background: "var(--border-strong)",
    height: "12px",
    marginBottom: "16px",
    width,
    borderRadius: "2px",
  });

  const modalOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(8px)",
    display: showFeedbackModal ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const keyframes = `
    @keyframes pulse-dark {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    .skeleton-dark {
      animation: pulse-dark 1.5s ease-in-out infinite;
    }
  `;

  return (
    <div className="animate-fade-up" style={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column", paddingBottom: "40px" }}>
      <Stepper currentStep={2} />
      <style>{keyframes}</style>
      
      <div style={{ display: "flex", gap: "2px", background: "var(--border-strong)", border: "1px solid var(--border-strong)", flex: 1, minHeight: 0 }}>
        
        {/* Left Column (Input) */}
        <div style={{ width: "35%", background: "var(--bg-base)", padding: "40px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          {pageState !== "review" ? (
            <>
              <h1 style={{ fontSize: "32px", marginBottom: "16px", fontFamily: "Syne, sans-serif" }}>
                Define Content
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "40px", lineHeight: 1.6 }}>
                Articulate your requirements. Our engine will synthesize the data into a structural document.
              </p>
              
              <textarea
                style={{
                  width: "100%",
                  flex: 1,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  padding: "20px",
                  fontSize: "15px",
                  resize: "none",
                  fontFamily: "Outfit, sans-serif",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  marginBottom: "24px",
                }}
                placeholder="Type your context here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = "var(--accent-primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border-subtle)"}
              />

              <button
                className={content.trim() !== "" ? "btn-primary" : "btn-outline"}
                disabled={content.trim() === ""}
                onClick={handleGenerateDocument}
                style={{ opacity: content.trim() === "" ? 0.5 : 1, width: "100%" }}
              >
                <IconSparkles size={18} /> GENERATE
              </button>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}>
              <div style={{ color: "var(--accent-primary)", fontSize: "12px", fontWeight: 700, letterSpacing: "2px", marginBottom: "16px" }}>
                STATUS: COMPLETE
              </div>
              <h2 style={{ fontSize: "32px", fontFamily: "Syne, sans-serif", marginBottom: "24px" }}>
                Document Compiled.
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "48px", lineHeight: 1.6 }}>
                Please review the generated structural content. You can approve to proceed or reject to refine.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <button
                  className="btn-primary"
                  onClick={() => navigate("/generate/review-email")}
                  style={{ width: "100%", justifyContent: "space-between" }}
                >
                  Approve & Continue <IconArrowRight size={18} />
                </button>
                <button
                  className="btn-outline"
                  onClick={() => setShowFeedbackModal(true)}
                  style={{ width: "100%", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)" }}
                >
                  Reject & Refine
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Viewer) */}
        <div style={{ width: "65%", background: "var(--bg-surface)", padding: "60px", position: "relative", overflowY: "auto" }}>
          
          {pageState === "idle" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.5 }}>
              <IconFileDescription size={48} stroke={1} color="var(--text-secondary)" style={{ marginBottom: "24px" }} />
              <div style={skeletonBarStyle("60%")} />
              <div style={skeletonBarStyle("40%")} />
              <div style={skeletonBarStyle("75%")} />
            </div>
          ) : pageState === "loading" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingTop: "40px" }}>
              {["80%", "90%", "60%", "75%", "85%", "40%"].map((w, i) => (
                <div key={i} className="skeleton-dark" style={skeletonBarStyle(w)} />
              ))}
            </div>
          ) : (
            <div style={{ height: "100%", overflowY: "auto", paddingRight: "20px" }}>
              <div style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "15px",
                lineHeight: 1.8,
                color: "var(--text-primary)",
                whiteSpace: "pre-wrap"
              }}>
                {visibleLines.length > 0 ? visibleLines.join("\n") : editableDocument}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <div style={modalOverlayStyle}>
        <div className="glass-panel" style={{ width: "100%", maxWidth: "500px", padding: "40px", position: "relative" }}>
          <button 
            style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
            onClick={() => setShowFeedbackModal(false)}
          >
            <IconX size={24} />
          </button>
          <h2 style={{ fontSize: "24px", fontFamily: "Syne, sans-serif", marginBottom: "24px" }}>Refinement Feedback</h2>
          <textarea
            style={{
              width: "100%",
              height: "150px",
              background: "var(--bg-base)",
              border: "1px solid var(--border-strong)",
              color: "var(--text-primary)",
              padding: "16px",
              fontSize: "14px",
              resize: "none",
              marginBottom: "24px",
              fontFamily: "Outfit, sans-serif",
              outline: "none"
            }}
            placeholder="Instruct the AI on what needs to be changed..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button
            className="btn-primary"
            style={{ width: "100%" }}
            onClick={() => {
              console.log("Feedback:", feedback);
              setFeedback("");
              setShowFeedbackModal(false);
              setPageState("loading");
              setTimeout(() => setPageState("review"), 2000);
            }}
          >
            Submit Instructions
          </button>
        </div>
      </div>

    </div>
  );
}
