import { useNavigate } from "react-router-dom";
import Stepper from "../components/Stepper";
import { IconCheck, IconRotateClockwise, IconArchive } from "@tabler/icons-react";
import { useGenerate } from "../context/useGenerate";

export default function Success() {
  const navigate = useNavigate();
  const { outputUrl, selectedTemplate, generatedEmail } = useGenerate();

  return (
    <div className="animate-fade-up" style={{ minHeight: "80vh", display: "flex", flexDirection: "column" }}>
      <Stepper currentStep={4} />
      
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
        <div className="glass-panel" style={{ width: "100%", maxWidth: "800px", padding: "80px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          
          <div style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "300px",
            height: "300px",
            background: "var(--accent-glow)",
            filter: "blur(80px)",
            zIndex: 0,
            pointerEvents: "none"
          }}></div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "var(--accent-primary)",
              color: "var(--bg-base)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 40px",
              boxShadow: "0 0 40px var(--accent-glow)",
            }}>
              <IconCheck size={64} stroke={3} />
            </div>

            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", textTransform: "uppercase", marginBottom: "16px", color: "var(--text-primary)" }}>
              Draft Flow <span style={{ color: "var(--accent-primary)" }}>Complete.</span>
            </h1>
            
            <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "400px", margin: "0 auto 60px", lineHeight: 1.6 }}>
              Your generated document and AI email draft are ready for review. No email has been sent in this backend pass.
            </p>
            <div style={{ marginBottom: "40px", color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.8 }}>
              <div>Template: {selectedTemplate || "Unknown template"}</div>
              <div>Email recipient: {generatedEmail.to || "Not drafted"}</div>
            </div>

            <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
              {outputUrl ? (
                <a className="btn-outline" href={outputUrl} target="_blank" rel="noreferrer">
                  <IconArchive size={18} /> Download Output
                </a>
              ) : null}
              <button
                className="btn-primary"
                onClick={() => navigate("/generate/select-template")}
              >
                <IconRotateClockwise size={18} /> Initialize New
              </button>
              <button
                className="btn-outline"
                onClick={() => navigate("/history")}
              >
                <IconArchive size={18} /> Access Archive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
