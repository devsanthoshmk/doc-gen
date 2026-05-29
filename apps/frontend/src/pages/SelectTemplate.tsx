import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconArrowRight,
  IconFileText,
  IconChartBar,
  IconFlag,
  IconCalendarWeek,
  IconCircleCheck,
  IconUsers,
} from "@tabler/icons-react";
import { templates } from "../data/templates";
import { useGenerate } from "../context/useGenerate";
import Stepper from "../components/Stepper";

const templateDescriptions: { [key: number]: string } = {
  1: "Standard formal update on project status, risks, and next steps.",
  2: "Detailed analytical report tailored for external client review.",
  3: "Celebrate and document the completion of a major project phase.",
  4: "Brief, bulleted summary of weekly achievements and blockers.",
  5: "Formal sign-off document outlining final deliverables and handover.",
  6: "High-level executive summary tailored for internal leadership.",
};

const templateIcons: { [key: number]: React.ReactNode } = {
  1: <IconFileText size={24} stroke={1.5} />,
  2: <IconChartBar size={24} stroke={1.5} />,
  3: <IconFlag size={24} stroke={1.5} />,
  4: <IconCalendarWeek size={24} stroke={1.5} />,
  5: <IconCircleCheck size={24} stroke={1.5} />,
  6: <IconUsers size={24} stroke={1.5} />,
};

export default function SelectTemplate() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { setSelectedTemplate } = useGenerate();

  const handleNext = () => {
    if (selectedId !== null) {
      const selectedTemplateName = templates.find((t) => t.id === selectedId)?.name;
      if (selectedTemplateName) {
        setSelectedTemplate(selectedTemplateName);
        navigate("/generate/enter-content");
      }
    }
  };

  return (
    <div className="animate-fade-up" style={{ minHeight: "80vh", display: "flex", flexDirection: "column" }}>
      <Stepper currentStep={1} />

      <div style={{ marginBottom: "60px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", textTransform: "uppercase", marginBottom: "1rem" }}>
          Template <span style={{ color: "var(--accent-primary)" }}>Architecture.</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
          Select the base structural foundation for your generated document.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1px",
          background: "var(--border-strong)",
          border: "1px solid var(--border-strong)",
          maxWidth: "1100px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {templates.map((template) => {
          const isSelected = selectedId === template.id;
          return (
            <div
              key={template.id}
              onClick={() => setSelectedId(template.id)}
              style={{
                background: isSelected ? "var(--accent-glow)" : "var(--bg-base)",
                padding: "32px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                borderBottom: isSelected ? "2px solid var(--accent-primary)" : "2px solid transparent",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.background = "var(--bg-elevated)";
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.background = "var(--bg-base)";
              }}
            >
              <div
                style={{
                  color: isSelected ? "var(--accent-primary)" : "var(--text-primary)",
                  transition: "color 0.3s ease",
                }}
              >
                {templateIcons[template.id]}
              </div>
              <div>
                <h3 style={{ fontSize: "20px", fontFamily: "Syne, sans-serif", marginBottom: "8px" }}>
                  {template.name}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {templateDescriptions[template.id]}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "60px", marginBottom: "60px" }}>
        <button
          className={selectedId !== null ? "btn-primary" : "btn-outline"}
          disabled={selectedId === null}
          onClick={handleNext}
          style={{ opacity: selectedId === null ? 0.5 : 1 }}
        >
          Initialize Template <IconArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
