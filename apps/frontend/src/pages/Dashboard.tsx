import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconFilePlus,
  IconHistory,
  IconClipboard,
  IconArrowRight,
} from "@tabler/icons-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const pageContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "70vh",
    position: "relative",
  };

  const headerStyle: React.CSSProperties = {
    fontSize: "clamp(3rem, 8vw, 6rem)",
    lineHeight: "0.9",
    textTransform: "uppercase",
    marginBottom: "4rem",
    maxWidth: "1000px",
  };

  const accentWord: React.CSSProperties = {
    color: "var(--accent-primary)",
    display: "block",
  };

  const cardsContainerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "1px",
    background: "var(--border-strong)",
    border: "1px solid var(--border-strong)",
  };

  const cardStyle = (cardId: string): React.CSSProperties => {
    const isHovered = hoveredCard === cardId;
    return {
      background: isHovered ? "var(--bg-elevated)" : "var(--bg-base)",
      padding: "40px",
      cursor: "pointer",
      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      minHeight: "320px",
    };
  };

  const iconWrapperStyle = (isHovered: boolean): React.CSSProperties => ({
    width: "64px",
    height: "64px",
    border: `1px solid ${isHovered ? "var(--accent-primary)" : "var(--border-strong)"}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    color: isHovered ? "var(--accent-primary)" : "var(--text-secondary)",
    transition: "all 0.4s ease",
    marginBottom: "40px",
  });

  const cardTitleStyle: React.CSSProperties = {
    fontSize: "24px",
    fontFamily: "Syne, sans-serif",
    fontWeight: 700,
    marginBottom: "16px",
    color: "var(--text-primary)",
  };

  const cardDescriptionStyle: React.CSSProperties = {
    fontSize: "15px",
    color: "var(--text-secondary)",
    lineHeight: "1.6",
    marginBottom: "40px",
  };

  const actionRowStyle = (isHovered: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: isHovered ? "var(--accent-primary)" : "var(--text-secondary)",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    fontWeight: 600,
    fontFamily: "Outfit, sans-serif",
    transition: "all 0.3s ease",
  });

  const handleCardClick = (path: string) => navigate(path);

  return (
    <div style={pageContainerStyle} className="animate-fade-up">
      <h1 style={headerStyle}>
        Document <br />
        <span style={accentWord}>Intelligence.</span>
      </h1>
      
      <div style={cardsContainerStyle}>
        {/* Card 1 */}
        <div
          style={cardStyle("create-doc")}
          onMouseEnter={() => setHoveredCard("create-doc")}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => handleCardClick("/generate/select-template")}
        >
          <div>
            <div style={iconWrapperStyle(hoveredCard === "create-doc")}>
              <IconFilePlus size={28} stroke={1.5} />
            </div>
            <h2 style={cardTitleStyle}>Create New</h2>
            <p style={cardDescriptionStyle}>
              Instantly generate documents using AI and intelligent templates.
            </p>
          </div>
          <div style={actionRowStyle(hoveredCard === "create-doc")}>
            <span>Initialize</span>
            <IconArrowRight size={20} stroke={hoveredCard === "create-doc" ? 2 : 1.5} />
          </div>
        </div>

        {/* Card 2 */}
        <div
          style={cardStyle("view-history")}
          onMouseEnter={() => setHoveredCard("view-history")}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => handleCardClick("/history")}
        >
          <div>
            <div style={iconWrapperStyle(hoveredCard === "view-history")}>
              <IconHistory size={28} stroke={1.5} />
            </div>
            <h2 style={cardTitleStyle}>Archive</h2>
            <p style={cardDescriptionStyle}>
              Access and manage your complete history of generated documents.
            </p>
          </div>
          <div style={actionRowStyle(hoveredCard === "view-history")}>
            <span>Browse</span>
            <IconArrowRight size={20} stroke={hoveredCard === "view-history" ? 2 : 1.5} />
          </div>
        </div>

        {/* Card 3 */}
        <div
          style={cardStyle("manage-templates")}
          onMouseEnter={() => setHoveredCard("manage-templates")}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => handleCardClick("/templates")}
        >
          <div>
            <div style={iconWrapperStyle(hoveredCard === "manage-templates")}>
              <IconClipboard size={28} stroke={1.5} />
            </div>
            <h2 style={cardTitleStyle}>Templates</h2>
            <p style={cardDescriptionStyle}>
              Architect custom templates to standardize your document generation.
            </p>
          </div>
          <div style={actionRowStyle(hoveredCard === "manage-templates")}>
            <span>Configure</span>
            <IconArrowRight size={20} stroke={hoveredCard === "manage-templates" ? 2 : 1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
