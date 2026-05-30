import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useGenerate } from "../context/useGenerate";
import Stepper from "../components/Stepper";
import { IconMailFast, IconX } from "@tabler/icons-react";

export default function ReviewEmail() {
  const [pageState, setPageState] = useState("loading");
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { documentId, generatedEmail, setGeneratedEmail } = useGenerate();

  const emailLines = useMemo(
    () => [
      `To: ${generatedEmail.to}`,
      `Subject: ${generatedEmail.subject}`,
      "---",
      ...generatedEmail.body.split("\n").filter(Boolean),
    ],
    [generatedEmail.body, generatedEmail.subject, generatedEmail.to]
  );

  useEffect(() => {
    if (!documentId) {
      navigate("/generate/enter-content");
      return;
    }

    async function loadDraft() {
      setPageState("loading");
      setVisibleLines([]);
      setError(null);
      try {
        const draft = await api.draftEmail(documentId);
        setGeneratedEmail({
          to: draft.to,
          subject: draft.subject,
          body: draft.body,
        });
        setPageState("review");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to draft email");
        setPageState("review");
      }
    }

    void loadDraft();
  }, [documentId, navigate, setGeneratedEmail]);

  useEffect(() => {
    if (pageState !== "review") return;

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
  }, [emailLines, pageState]);

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
    <div
      className="animate-fade-up"
      style={{
        height: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "40px",
      }}
    >
      <Stepper currentStep={3} />
      <style>{keyframes}</style>

      <div
        style={{
          display: "flex",
          gap: "2px",
          background: "var(--border-strong)",
          border: "1px solid var(--border-strong)",
          flex: 1,
          minHeight: 0,
        }}
      >
        <div
          style={{
            width: "35%",
            background: "var(--bg-base)",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {pageState === "loading" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  marginBottom: "16px",
                }}
              >
                PROCESSING
              </div>
              <h2
                style={{
                  fontSize: "32px",
                  fontFamily: "Syne, sans-serif",
                  marginBottom: "24px",
                }}
              >
                Generating Dispatch...
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                Synthesizing document data into email format.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  color: "var(--accent-primary)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  marginBottom: "16px",
                }}
              >
                STATUS: READY
              </div>
              <h2
                style={{
                  fontSize: "32px",
                  fontFamily: "Syne, sans-serif",
                  marginBottom: "24px",
                }}
              >
                Dispatch Ready.
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  marginBottom: "24px",
                  lineHeight: 1.6,
                }}
              >
                Review the synthesized email draft. Approve to finish this
                generation flow or reject to regenerate the draft.
              </p>
              {error ? (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    marginBottom: "24px",
                  }}
                >
                  {error}
                </div>
              ) : null}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <button
                  className="btn-primary"
                  onClick={() => navigate("/generate/success")}
                  style={{ width: "100%", justifyContent: "space-between" }}
                >
                  Finalize Draft <IconMailFast size={18} />
                </button>
                <button
                  className="btn-outline"
                  onClick={() => setShowFeedbackModal(true)}
                  style={{
                    width: "100%",
                    color: "#ef4444",
                    borderColor: "rgba(239, 68, 68, 0.3)",
                  }}
                >
                  Reject & Recalibrate
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            width: "65%",
            background: "var(--bg-surface)",
            padding: "60px",
            position: "relative",
            overflowY: "auto",
          }}
        >
          {pageState === "loading" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                paddingTop: "40px",
              }}
            >
              {["80%", "90%", "60%", "75%", "85%", "40%"].map((width) => (
                <div
                  key={width}
                  className="skeleton-dark"
                  style={skeletonBarStyle(width)}
                />
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
                    />
                  );
                }
                if (line.startsWith("To:") || line.startsWith("Subject:")) {
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
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          width: "80px",
                        }}
                      >
                        {line.split(":")[0]}:
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          color: "var(--text-primary)",
                          fontFamily: "Outfit, sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        {line.substring(line.indexOf(":") + 2)}
                      </div>
                    </div>
                  );
                }
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
              })}
            </div>
          )}
        </div>
      </div>

      <div style={modalOverlayStyle}>
        <div
          className="glass-panel"
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "40px",
            position: "relative",
          }}
        >
          <button
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
            onClick={() => setShowFeedbackModal(false)}
          >
            <IconX size={24} />
          </button>
          <h2
            style={{
              fontSize: "24px",
              fontFamily: "Syne, sans-serif",
              marginBottom: "16px",
            }}
          >
            Recalibrate Dispatch
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "13px",
              lineHeight: 1.6,
              marginBottom: "16px",
            }}
          >
            This pass regenerates from the saved document data. A future backend
            extension can use this note as a true email-redraft prompt.
          </p>
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
              outline: "none",
            }}
            placeholder="Optional note for the next implementation pass..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button
            className="btn-primary"
            style={{ width: "100%" }}
            onClick={() => {
              if (!documentId) return;
              setFeedback("");
              setShowFeedbackModal(false);
              setPageState("loading");
              setVisibleLines([]);
              setError(null);
              void api
                .draftEmail(documentId)
                .then((draft) => {
                  setGeneratedEmail({
                    to: draft.to,
                    subject: draft.subject,
                    body: draft.body,
                  });
                  setPageState("review");
                })
                .catch((err: unknown) => {
                  setError(
                    err instanceof Error ? err.message : "Failed to redraft email"
                  );
                  setPageState("review");
                });
            }}
          >
            Submit Instructions
          </button>
        </div>
      </div>
    </div>
  );
}
