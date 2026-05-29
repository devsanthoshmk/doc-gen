import React from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "../components/Stepper";
import { IconCheck, IconRotateClockwise, IconArchive } from "@tabler/icons-react";

export default function Success() {
  const navigate = useNavigate();

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
              Transmission <span style={{ color: "var(--accent-primary)" }}>Successful.</span>
            </h1>
            
            <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "400px", margin: "0 auto 60px", lineHeight: 1.6 }}>
              Your generated document and corresponding email have been successfully delivered to the recipient network.
            </p>

            <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
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
