import React from "react";

interface StepperProps {
  currentStep: number;
}

const labels = [
  "Select Template",
  "Generate Document",
  "Generate Email",
  "Success",
];

export default function Stepper({ currentStep }: StepperProps) {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 0 60px 0",
    width: "100%",
  };

  const lineWrapperStyle: React.CSSProperties = {
    display: "flex",
    width: "100%",
    maxWidth: "800px",
    height: "2px",
    background: "var(--border-strong)",
    position: "relative",
    marginBottom: "20px",
  };

  const activeLineStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    background: "var(--accent-primary)",
    width: `${((currentStep - 1) / (labels.length - 1)) * 100}%`,
    transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    boxShadow: "0 0 10px var(--accent-glow)",
  };

  const labelsContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "800px",
  };

  const getLabelStyle = (stepNumber: number): React.CSSProperties => {
    const isActive = currentStep >= stepNumber;
    return {
      fontSize: "11px",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
      fontFamily: "Outfit, sans-serif",
      transition: "color 0.3s ease",
      textAlign: "center",
      width: "25%",
    };
  };

  return (
    <div style={containerStyle}>
      <div style={lineWrapperStyle}>
        <div style={activeLineStyle}></div>
      </div>
      <div style={labelsContainerStyle}>
        {labels.map((label, index) => (
          <div key={index} style={getLabelStyle(index + 1)}>
            {`0${index + 1} / ${label}`}
          </div>
        ))}
      </div>
    </div>
  );
}
