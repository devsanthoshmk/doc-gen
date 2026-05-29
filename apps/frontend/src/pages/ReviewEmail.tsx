import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyEmail } from "../data/dummyEmail";
import Stepper from "../components/Stepper";
import { IconMailFast, IconX } from "@tabler/icons-react";

export default function ReviewEmail() {
  const [pageState, setPageState] = useState("loading");
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageState("review");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (pageState === "review") {
      const emailLines = [
        "To: " + dummyEmail.to,
        "Subject: " + dummyEmail.subject,
        "---",
        ...dummyEmail.body.split("\n").filter(Boolean),
      ];

      let lineIndex = 0;
      const interval = setInterval(() => {
        if (lineIndex < emailLines.length) {
          setVisibleLines((prev) => [...prev, emailLines[lineIndex]]);
          lineIndex++;
        } else {
          clearInterval(interval);
        }
      }, 40);

      return () => clearInterval(interval);
    }
  }, [pageState]);

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
    @keyframes lineReveal {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  return (
    <div className="animate-fade-up" style={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column", paddingBottom: "40px" }}>
      <Stepper currentStep={3} />
      <style>{keyframes}</style>
      
      <div style={{ display: "flex", gap: "2px", background: "var(--border-strong)", border: "1px solid var(--border-strong)", flex: 1, minHeight: 0 }}>
        
        {/* Left Column (Input) */}
        <div style={{ width: "35%", background: "var(--bg-base)", padding: "40px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          {pageState === "loading" ? (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}>
              <div style={{ color: "var(--text-secondary)", fontSize: "12px", fontWeight: 700, letterSpacing: "2px", marginBottom: "16px" }}>
                PROCESSING
              </div>
              <h2 style={{ fontSize: "32px", fontFamily: "Syne, sans-serif", marginBottom: "24px" }}>
                Generating Dispatch...
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Synthesizing document data into email format.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}>
              <div style={{ color: "var(--accent-primary)", fontSize: "12px", fontWeight: 700, letterSpacing: "2px", marginBottom: "16px" }}>
                STATUS: READY
              </div>
              <h2 style={{ fontSize: "32px", fontFamily: "Syne, sans-serif", marginBottom: "24px" }}>
                Dispatch Ready.
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "48px", lineHeight: 1.6 }}>
                Review the synthesized email. Approve to execute delivery or reject to recalibrate.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <button
                  className="btn-primary"
                  onClick={() => navigate("/generate/success")}
                  style={{ width: "100%", justifyContent: "space-between" }}
                >
                  Execute Delivery <IconMailFast size={18} />
                </button>
                <button
                  className="btn-outline"
                  onClick={() => setShowFeedbackModal(true)}
                  style={{ width: "100%", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)" }}
                >
                  Reject & Recalibrate
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Viewer) */}
        <div style={{ width: "65%", background: "var(--bg-surface)", padding: "60px", position: "relative", overflowY: "auto" }}>
          {pageState === "loading" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingTop: "40px" }}>
              {["80%", "90%", "60%", "75%", "85%", "40%"].map((w, i) => (
                <div key={i} className="skeleton-dark" style={skeletonBarStyle(w)} />
              ))}
            </div>
          ) : (
            <div style={{ height: "100%", overflowY: "auto", paddingRight: "20px" }}>
              {visibleLines.map((line, index) => {
                if (!line) return null;
                if (line === "---") {
                  return (
                    <div
                      key={index}
                      style={{
                        height: "1px",
                        backgroundColor: "var(--border-strong)",
                        margin: "24px 0",
                        animation: `lineReveal 0.4s ease ${index * 0.03}s both`,
                      }}
                    ></div>
                  );
                } else if (line.startsWith("To:") || line.startsWith("Subject:")) {
                  return (
                    <div
                      key={index}
                      style={{
                        animation: `lineReveal 0.4s ease ${index * 0.03}s both`,
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "baseline",
                        gap: "12px",
                      }}
                    >
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", letterSpacing: "0.1em", textTransform: "uppercase", width: "80px" }}>
                        {line.split(":")[0]}:
                      </div>
                      <div style={{ fontSize: "16px", color: "var(--text-primary)", fontFamily: "Outfit, sans-serif", fontWeight: 500 }}>
                        {line.substring(line.indexOf(":") + 2)}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      style={{
                        fontSize: "15px",
                        color: "var(--text-primary)",
                        lineHeight: 1.8,
                        fontFamily: "Outfit, sans-serif",
                        animation: `lineReveal 0.4s ease ${index * 0.03}s both`,
                        marginBottom: "8px",
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

      {/* Feedback Modal */}
      <div style={modalOverlayStyle}>
        <div className="glass-panel" style={{ width: "100%", maxWidth: "500px", padding: "40px", position: "relative" }}>
          <button 
            style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
            onClick={() => setShowFeedbackModal(false)}
          >
            <IconX size={24} />
          </button>
          <h2 style={{ fontSize: "24px", fontFamily: "Syne, sans-serif", marginBottom: "24px" }}>Recalibrate Dispatch</h2>
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
              setFeedback("");
              setShowFeedbackModal(false);
              setVisibleLines([]); // Clear existing lines before going back to loading
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
