import React, { useEffect, useMemo, useState } from "react";
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
import { api, type TemplateRow } from "../api/client";
import { useGenerate } from "../context/useGenerate";
import Stepper from "../components/Stepper";

function iconForIndex(index: number): React.ReactNode {
  const icons = [
    <IconFileText size={24} stroke={1.5} />,
    <IconChartBar size={24} stroke={1.5} />,
    <IconFlag size={24} stroke={1.5} />,
    <IconCalendarWeek size={24} stroke={1.5} />,
    <IconCircleCheck size={24} stroke={1.5} />,
    <IconUsers size={24} stroke={1.5} />,
  ];
  return icons[index % icons.length];
}

export default function SelectTemplate() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setSelectedTemplate, setTemplateId } = useGenerate();

  useEffect(() => {
    let cancelled = false;

    async function loadTemplates() {
      try {
        const rows = await api.listTemplates("published");
        if (!cancelled) {
          setTemplates(rows);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load published templates"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadTemplates();
    return () => {
      cancelled = true;
    };
  }, []);

  const descriptions = useMemo(
    () =>
      templates.reduce<Record<string, string>>((acc, template) => {
        acc[template._id] =
          template.variables.length > 0
            ? template.variables
                .slice(0, 2)
                .map((variable) => variable.description)
                .join(" ")
            : "Published template ready for AI-driven generation.";
        return acc;
      }, {}),
    [templates]
  );

  const handleNext = () => {
    if (!selectedId) return;
    const template = templates.find((row) => row._id === selectedId);
    if (!template) return;
    setSelectedTemplate(template.name);
    setTemplateId(template._id);
    navigate("/generate/enter-content");
  };

  return (
    <div
      className="animate-fade-up"
      style={{ minHeight: "80vh", display: "flex", flexDirection: "column" }}
    >
      <Stepper currentStep={1} />

      <div style={{ marginBottom: "60px", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Template <span style={{ color: "var(--accent-primary)" }}>Architecture.</span>
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "16px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Select the base structural foundation for your generated document.
        </p>
      </div>

      {loading ? (
        <div
          className="glass-panel"
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            width: "100%",
            padding: "48px",
            textAlign: "center",
            color: "var(--text-secondary)",
          }}
        >
          Loading published templates...
        </div>
      ) : error ? (
        <div
          className="glass-panel"
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            width: "100%",
            padding: "48px",
            textAlign: "center",
            color: "#ef4444",
          }}
        >
          {error}
        </div>
      ) : (
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
          {templates.map((template, index) => {
            const isSelected = selectedId === template._id;
            return (
              <div
                key={template._id}
                onClick={() => setSelectedId(template._id)}
                style={{
                  background: isSelected
                    ? "var(--accent-glow)"
                    : "var(--bg-base)",
                  padding: "32px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderBottom: isSelected
                    ? "2px solid var(--accent-primary)"
                    : "2px solid transparent",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "var(--bg-elevated)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "var(--bg-base)";
                  }
                }}
              >
                <div
                  style={{
                    color: isSelected
                      ? "var(--accent-primary)"
                      : "var(--text-primary)",
                    transition: "color 0.3s ease",
                  }}
                >
                  {iconForIndex(index)}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontFamily: "Syne, sans-serif",
                      marginBottom: "8px",
                    }}
                  >
                    {template.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {descriptions[template._id]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "60px",
          marginBottom: "60px",
        }}
      >
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
