import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, type ApiError } from "../api/client";
import { useGenerate } from "../context/useGenerate";
import Stepper from "../components/Stepper";
import {
  IconSparkles,
  IconFileDescription,
  IconArrowRight,
  IconX,
} from "@tabler/icons-react";

type PageState = "idle" | "loading" | "review";

export default function EnterContent() {
  const [pageState, setPageState] = useState<PageState>("idle");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [renderedLines, setRenderedLines] = useState<string[]>([]);
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [requestError, setRequestError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    content,
    setContent,
    templateId,
    selectedTemplate,
    setDocumentId,
    setStructuredData,
    setOutputUrl,
    setGeneratedDocument,
  } = useGenerate();

  useEffect(() => {
    if (!templateId) {
      navigate("/generate/select-template");
    }
  }, [navigate, templateId]);

  useEffect(() => {
    if (pageState !== "review" || renderedLines.length === 0) return;

    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev.length < renderedLines.length) {
          return [...prev, renderedLines[prev.length]];
        }
        clearInterval(interval);
        return prev;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [pageState, renderedLines]);

  /** Calls the worker to structure content, validate it, and render the docx. */
  const handleGenerateDocument = async (nextContent = content) => {
    if (!templateId) return;

    setRequestError(null);
    setValidationErrors([]);
    setVisibleLines([]);
    setRenderedLines([]);
    setPageState("loading");

    try {
      const result = await api.generateDocument({
        templateId,
        content: nextContent,
      });
      const preview = JSON.stringify(result.structuredData, null, 2);
      setDocumentId(result.documentId);
      setStructuredData(result.structuredData);
      setOutputUrl(result.outputUrl ?? "");
      setGeneratedDocument(preview);
      setRenderedLines(preview.split("\n"));
      setPageState("review");
    } catch (err) {
      const apiError = err as ApiError;
      setRequestError(apiError.message ?? "Generation failed");
      setValidationErrors(apiError.body?.errors ?? []);
      setPageState("idle");
    }
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
    <div
      className="animate-fade-up"
      style={{
        height: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "40px",
      }}
    >
      <Stepper currentStep={2} />
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
          {pageState !== "review" ? (
            <>
              <h1
                style={{
                  fontSize: "32px",
                  marginBottom: "16px",
                  fontFamily: "Syne, sans-serif",
                }}
              >
                Define Content
              </h1>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  marginBottom: "24px",
                  lineHeight: 1.6,
                }}
              >
                Articulate your requirements. Our engine will synthesize the data
                into a structural document.
              </p>
              {selectedTemplate ? (
                <div
                  style={{
                    color: "var(--accent-primary)",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    marginBottom: "16px",
                  }}
                >
                  Template: {selectedTemplate}
                </div>
              ) : null}

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
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--accent-primary)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--border-subtle)")
                }
              />

              {requestError ? (
                <div
                  style={{
                    marginBottom: "16px",
                    color: "#ef4444",
                    fontSize: "13px",
                    lineHeight: 1.6,
                  }}
                >
                  {requestError}
                </div>
              ) : null}
              {validationErrors.length > 0 ? (
                <div
                  style={{
                    marginBottom: "16px",
                    padding: "16px",
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    color: "#fca5a5",
                  }}
                >
                  {validationErrors.map((error) => (
                    <div key={error} style={{ fontSize: "12px", lineHeight: 1.6 }}>
                      {error}
                    </div>
                  ))}
                </div>
              ) : null}

              <button
                className={content.trim() !== "" ? "btn-primary" : "btn-outline"}
                disabled={content.trim() === ""}
                onClick={() => void handleGenerateDocument()}
                style={{ opacity: content.trim() === "" ? 0.5 : 1, width: "100%" }}
              >
                <IconSparkles size={18} /> GENERATE
              </button>
            </>
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
                STATUS: COMPLETE
              </div>
              <h2
                style={{
                  fontSize: "32px",
                  fontFamily: "Syne, sans-serif",
                  marginBottom: "24px",
                }}
              >
                Document Compiled.
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  marginBottom: "48px",
                  lineHeight: 1.6,
                }}
              >
                Review the generated structured output. Approve to draft the
                email, or reject to refine the input and regenerate.
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
                  style={{
                    width: "100%",
                    color: "#ef4444",
                    borderColor: "rgba(239, 68, 68, 0.3)",
                  }}
                >
                  Reject & Refine
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
          {pageState === "idle" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                opacity: 0.5,
              }}
            >
              <IconFileDescription
                size={48}
                stroke={1}
                color="var(--text-secondary)"
                style={{ marginBottom: "24px" }}
              />
              <div style={skeletonBarStyle("60%")} />
              <div style={skeletonBarStyle("40%")} />
              <div style={skeletonBarStyle("75%")} />
            </div>
          ) : pageState === "loading" ? (
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
              <div
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "15px",
                  lineHeight: 1.8,
                  color: "var(--text-primary)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {visibleLines.length > 0 ? visibleLines.join("\n") : "{\n  \n}"}
              </div>
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
            Refinement Feedback
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "13px",
              lineHeight: 1.6,
              marginBottom: "16px",
            }}
          >
            This pass appends your note to the source content and regenerates the
            document.
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
            placeholder="Instruct the AI on what needs to be changed..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button
            className="btn-primary"
            style={{ width: "100%" }}
            onClick={() => {
              const refinedContent = [
                content,
                feedback.trim() ? `Refinement note:\n${feedback.trim()}` : "",
              ]
                .filter(Boolean)
                .join("\n\n");
              setContent(refinedContent);
              setFeedback("");
              setShowFeedbackModal(false);
              void handleGenerateDocument(refinedContent);
            }}
          >
            Submit Instructions
          </button>
        </div>
      </div>
    </div>
  );
}
