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
    alignItems: "center",
    gap: "3rem",
    backgroundColor: "#f9f9f7",
  };

  const cardsContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "2rem",
    justifyContent: "center",
    width: "100%",
  };

  const cardStyle: React.CSSProperties = {
    background: "linear-gradient(145deg, #ffffff 0%, #faf8ff 100%)",
    borderRadius: "16px",
    padding: "40px 32px",
    boxShadow: "0 4px 20px rgba(93,63,211,0.15)",
    border: "1px solid rgba(93,63,211,0.12)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    textAlign: "center",
    flex: 1,
    minWidth: "280px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const getCardStyle = (cardId: string): React.CSSProperties => ({
    ...cardStyle,
    transform: hoveredCard === cardId ? "translateY(-6px)" : "translateY(0)",
    boxShadow:
      hoveredCard === cardId
        ? "0 16px 48px rgba(93,63,211,0.25)"
        : "0 4px 20px rgba(93,63,211,0.15)",
  });

  const iconWrapperStyle: React.CSSProperties = {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #5d3fd3 0%, #7c3aed 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "12px",
    fontFamily: "DM Sans",
  };

  const cardDescriptionStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.6",
    marginBottom: "20px",
    maxWidth: "240px",
  };

  const handleCardClick = (path: string) => {
    if (path !== "#") {
      navigate(path);
    }
  };

  const actionRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#5d3fd3",
  };

  return (
    <div style={pageContainerStyle}>
      <h1
        style={{
          fontSize: "42px",
          fontWeight: 700,
          fontFamily: "Playfair Display",
          textAlign: "center",
          marginBottom: "48px",
          background:
            "linear-gradient(135deg, #5d3fd3 0%, #7c3aed 50%, #a78bfa 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        AI-Powered Document Center
      </h1>
      <div style={cardsContainerStyle}>
        <div
          style={getCardStyle("create-doc")}
          onMouseEnter={() => setHoveredCard("create-doc")}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => handleCardClick("/generate/select-template")}
        >
          <div style={iconWrapperStyle}>
            <IconFilePlus size={28} color="#ffffff" />
          </div>
          <h2 style={cardTitleStyle}>Create New Doc</h2>
          <p style={cardDescriptionStyle}>
            Generate a new document using our templates
          </p>
          <div style={actionRowStyle}>
            <span>Get started</span>
            <IconArrowRight size={16} />
          </div>
        </div>

        <div
          style={getCardStyle("view-history")}
          onMouseEnter={() => setHoveredCard("view-history")}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => handleCardClick("/history")}
        >
          <div style={iconWrapperStyle}>
            <IconHistory size={28} color="#ffffff" />
          </div>
          <h2 style={cardTitleStyle}>View History</h2>
          <p style={cardDescriptionStyle}>
            Access your previously created documents
          </p>
          <div style={actionRowStyle}>
            <span>View all</span>
            <IconArrowRight size={16} />
          </div>
        </div>

        <div
          style={getCardStyle("manage-templates")}
          onMouseEnter={() => setHoveredCard("manage-templates")}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => handleCardClick("/templates")}
        >
          <div style={iconWrapperStyle}>
            <IconClipboard size={28} color="#ffffff" />
          </div>
          <h2 style={cardTitleStyle}>Create / Manage Templates</h2>
          <p style={cardDescriptionStyle}>
            Build and customize your document templates
          </p>
          <div style={actionRowStyle}>
            <span>Manage</span>
            <IconArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
