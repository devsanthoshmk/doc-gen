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
  1: <IconFileText size={24} color="#5d3fd3" />,
  2: <IconChartBar size={24} color="#5d3fd3" />,
  3: <IconFlag size={24} color="#5d3fd3" />,
  4: <IconCalendarWeek size={24} color="#5d3fd3" />,
  5: <IconCircleCheck size={24} color="#5d3fd3" />,
  6: <IconUsers size={24} color="#5d3fd3" />,
};

export default function SelectTemplate() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { setSelectedTemplate } = useGenerate();

  const handleCardClick = (id: number) => {
    setSelectedId(id);
  };

  const handleNext = () => {
    if (selectedId !== null) {
      const selectedTemplateName = templates.find(
        (t) => t.id === selectedId,
      )?.name;
      if (selectedTemplateName) {
        setSelectedTemplate(selectedTemplateName);
        navigate("/generate/enter-content");
      }
    }
  };

  return (
    <div
      style={{
        padding: "8px 20px",
        minHeight: "100vh",
        backgroundColor: "#f9f9f7",
      }}
    >
      <Stepper currentStep={1} />

      <h1
        style={{
          fontSize: "40px",
          fontWeight: 700,
          color: "#111827",
          fontFamily: "Playfair Display",
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        Choose your template
      </h1>
      <p
        style={{
          fontSize: "16px",
          color: "#6b7280",
          textAlign: "center",
          maxWidth: "640px",
          margin: "0 auto 48px auto",
          lineHeight: "1.6",
          fontFamily: "DM Sans",
        }}
      >
        Select the best starting point for your AI-generated document. We'll
        customize it with your specific data in the next step.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto 48px",
        }}
      >
        {templates.map((template) => {
          const isSelected = selectedId === template.id;
          return (
            <div
              key={template.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                background: isSelected ? "#faf8ff" : "#ffffff",
                borderRadius: "12px",
                padding: "24px",
                border: isSelected ? "2px solid #5d3fd3" : "1px solid #e5e7eb",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => handleCardClick(template.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#5d3fd3";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(93,63,211,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isSelected
                  ? "#5d3fd3"
                  : "#e5e7eb";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(93,63,211,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {templateIcons[template.id]}
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#111827",
                    fontFamily: "DM Sans",
                    margin: "0",
                  }}
                >
                  {template.name}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    lineHeight: "1.5",
                    margin: "0",
                    fontFamily: "DM Sans",
                  }}
                >
                  {templateDescriptions[template.id]}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "48px" }}
      >
        <button
          style={{
            background: selectedId !== null ? "#111827" : "#e5e7eb",
            color: selectedId !== null ? "#ffffff" : "#9ca3af",
            borderRadius: "10px",
            padding: "12px 32px",
            border: "none",
            fontSize: "15px",
            fontWeight: 500,
            cursor: selectedId !== null ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={handleNext}
          disabled={selectedId === null}
          onMouseEnter={(e) => {
            if (selectedId !== null) {
              e.currentTarget.style.background = "#5d3fd3";
            }
          }}
          onMouseLeave={(e) => {
            if (selectedId !== null) {
              e.currentTarget.style.background = "#111827";
            }
          }}
        >
          Next Step <IconArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
