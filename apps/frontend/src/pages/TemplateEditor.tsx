import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { IconAt, IconCalendar, IconBuildingStore, IconCurrencyDollar, IconSparkles, IconTextPlus, IconX, IconCheck, IconUpload, IconDeviceFloppy, IconBold, IconItalic, IconLink, IconInfoCircle } from "@tabler/icons-react";

interface Placeholder {
  name: string;
  icon: ReactNode;
}

export default function TemplateEditor() {
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState("Executive Consulting Agreement");
  const [toastVisible, setToastVisible] = useState(false);
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([
    { name: "{{client_name}}", icon: <IconAt size={14} /> },
    { name: "{{date}}", icon: <IconCalendar size={14} /> },
    { name: "{{company_legal_name}}", icon: <IconBuildingStore size={14} /> },
    { name: "{{monthly_retainer_amount}}", icon: <IconCurrencyDollar size={14} /> },
  ]);

  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    "{{effective_date}}",
    "{{termination_clause}}",
  ]);

  const handleSaveDraft = () => {
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const handleAddCustomField = () => {
    const fieldName = prompt("Enter custom field name (e.g. client_phone):");
    if (fieldName) {
      const formatted = `{{${fieldName.replace(/[{}]/g, "")}}}`;
      setPlaceholders([...placeholders, { name: formatted, icon: <IconTextPlus size={14} /> }]);
    }
  };

  const handleRemoveField = (name: string) => {
    setPlaceholders(placeholders.filter((p) => p.name !== name));
  };

  const handleAddSuggestion = (name: string) => {
    setPlaceholders([...placeholders, { name, icon: <IconSparkles size={14} /> }]);
    setAiSuggestions(aiSuggestions.filter((s) => s !== name));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 208px)", overflow: "hidden" }} className="animate-fade-up">
      {/* Editor Content Area (Canvas and Sidebar wrapper) */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* Workspace Canvas (Left side) */}
        <section
          style={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: "var(--bg-base)",
            padding: "40px",
            position: "relative",
          }}
          className="custom-scrollbar"
        >
          {/* Document Canvas Sheet */}
          <div
            style={{
              maxWidth: "850px",
              margin: "0 auto",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              padding: "60px 80px",
              minHeight: "1100px",
              position: "relative",
            }}
          >
            {/* Header / Meta */}
            <div
              style={{
                marginBottom: "40px",
                borderBottom: "1px solid var(--border-strong)",
                paddingBottom: "32px",
              }}
            >
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template Name"
                style={{
                  width: "100%",
                  border: "none",
                  padding: 0,
                  fontSize: "32px",
                  fontWeight: 700,
                  fontFamily: "Syne, sans-serif",
                  color: "var(--text-primary)",
                  outline: "none",
                  backgroundColor: "transparent",
                }}
              />
              <div style={{ display: "flex", gap: "16px", marginTop: "16px", alignItems: "center" }}>
                <span
                  style={{
                    backgroundColor: "rgba(204, 255, 0, 0.1)",
                    border: "1px solid rgba(204, 255, 0, 0.2)",
                    padding: "4px 12px",
                    color: "var(--accent-primary)",
                    fontSize: "11px",
                    fontFamily: "Outfit, sans-serif",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Drafting
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: "Outfit, sans-serif" }}>
                  Last edited 2 mins ago
                </span>
              </div>
            </div>

            {/* Simulated Rich Text Editor Content */}
            <div
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "16px",
                color: "var(--text-secondary)",
                lineHeight: 1.8,
              }}
            >
              <p style={{ marginBottom: "24px", fontWeight: 700, color: "var(--text-primary)" }}>BETWEEN:</p>
              
              <div
                style={{
                  marginBottom: "32px",
                  padding: "20px",
                  backgroundColor: "var(--bg-elevated)",
                  borderLeft: "2px solid var(--accent-primary)",
                }}
              >
                This agreement is dated <span style={{ color: "var(--accent-primary)", fontWeight: 700 }}>{"{{date}}"}</span> and
                is made between <span style={{ color: "var(--accent-primary)", fontWeight: 700 }}>{"{{company_legal_name}}"}</span> and the
                individual specified as the client.
              </div>

              <h2
                style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", color: "var(--text-primary)", marginTop: "48px", marginBottom: "16px" }}
              >
                1. Scope of Services
              </h2>
              <p style={{ marginBottom: "24px" }}>
                The Consultant shall provide executive advisory services to{" "}
                <span style={{ color: "var(--accent-primary)", fontWeight: 700 }}>{"{{client_name}}"}</span> focused on strategic
                growth and digital transformation. These services will include but are not limited to quarterly
                performance reviews and market positioning analysis.
              </p>

              <h2
                style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", color: "var(--text-primary)", marginTop: "48px", marginBottom: "16px" }}
              >
                2. Compensation
              </h2>
              <p style={{ marginBottom: "24px" }}>
                For the services rendered,{" "}
                <span style={{ color: "var(--accent-primary)", fontWeight: 700 }}>{"{{client_name}}"}</span> agrees to pay a fixed
                monthly retainer of{" "}
                <span style={{ color: "var(--accent-primary)", fontWeight: 700 }}>{"{{monthly_retainer_amount}}"}</span>. Invoices are
                due within 30 days of receipt.
              </p>

              <p
                style={{
                  marginTop: "80px",
                  borderTop: "1px dashed var(--border-strong)",
                  paddingTop: "24px",
                  color: "var(--text-secondary)",
                  opacity: 0.5,
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "12px",
                  textAlign: "center"
                }}
              >
                END OF DRAFT — APPEND MODULES FROM REPOSITORY
              </p>
            </div>

            {/* AI Floating Toolbar */}
            <div
              style={{
                position: "absolute",
                bottom: "40px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "rgba(5, 5, 5, 0.8)",
                backdropFilter: "blur(8px)",
                border: "1px solid var(--border-strong)",
                padding: "12px 24px",
                borderRadius: "100px",
                color: "var(--text-primary)",
                zIndex: 20,
                width: "max-content",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
              }}
            >
              <IconSparkles size={18} color="var(--accent-primary)" />
              <span style={{ fontSize: "13px", fontFamily: "Outfit, sans-serif", color: "var(--text-secondary)" }}>Ask AI to optimize synthesis...</span>
              <div style={{ width: "1px", height: "16px", backgroundColor: "var(--border-strong)", margin: "0 8px" }} />
              <button style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>
                <IconBold size={16} stroke={2} />
              </button>
              <button style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>
                <IconItalic size={16} stroke={2} />
              </button>
              <button style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>
                <IconLink size={16} stroke={2} />
              </button>
            </div>

          </div>
        </section>

        {/* Right Sidebar: Placeholders Panel (Right side) */}
        <aside
          style={{
            width: "360px",
            backgroundColor: "var(--bg-elevated)",
            borderLeft: "1px solid var(--border-strong)",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "24px 32px",
              borderBottom: "1px solid var(--border-strong)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ fontSize: "16px", fontFamily: "Syne, sans-serif", color: "var(--text-primary)", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
              Variables
            </h3>
            <IconInfoCircle size={18} color="var(--text-secondary)" />
          </div>

          {/* Placeholders Content */}
          <div style={{ padding: "32px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "32px" }} className="custom-scrollbar">
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Inject dynamic data nodes into the schema structure. 
            </p>

            {/* List */}
            <div>
              <h4
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "var(--text-secondary)",
                  marginBottom: "16px",
                }}
              >
                Standard Nodes
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {placeholders.map((p) => (
                  <div
                    key={p.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      backgroundColor: "var(--bg-surface)",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent-primary)";
                      e.currentTarget.style.background = "var(--bg-elevated)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-subtle)";
                      e.currentTarget.style.background = "var(--bg-surface)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ color: "var(--accent-primary)", display: "flex" }}>
                        {p.icon}
                      </span>
                      <span style={{ fontSize: "12px", fontFamily: "Outfit, sans-serif", color: "var(--text-primary)" }}>
                        {p.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveField(p.name)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        display: "flex",
                        padding: 0,
                        opacity: 0.7,
                        transition: "opacity 0.2s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "0.7"}
                    >
                      <IconX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Field Button */}
            <button
              onClick={handleAddCustomField}
              style={{
                width: "100%",
                padding: "16px",
                border: "1px dashed var(--border-strong)",
                backgroundColor: "transparent",
                color: "var(--text-primary)",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent-primary)";
                e.currentTarget.style.borderColor = "var(--accent-primary)";
                e.currentTarget.style.background = "rgba(204,255,0,0.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.borderColor = "var(--border-strong)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <IconTextPlus size={16} /> ADD CUSTOM NODE
            </button>

            {/* AI Smart Suggest Box */}
            {aiSuggestions.length > 0 && (
              <div
                style={{
                  backgroundColor: "rgba(204, 255, 0, 0.05)",
                  border: "1px solid rgba(204, 255, 0, 0.2)",
                  padding: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <IconSparkles size={16} color="var(--accent-primary)" />
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-primary)", fontFamily: "Outfit, sans-serif", textTransform: "uppercase", letterSpacing: "1px" }}>
                    AI Synthesis
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: 1.5 }}>
                  Detected {aiSuggestions.length} potential structural variables:
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {aiSuggestions.map((sug) => (
                    <span
                      key={sug}
                      onClick={() => handleAddSuggestion(sug)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "var(--bg-surface)",
                        border: "1px solid rgba(204, 255, 0, 0.2)",
                        fontSize: "11px",
                        fontFamily: "Outfit, sans-serif",
                        color: "var(--accent-primary)",
                        cursor: "pointer",
                        transition: "background 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(204, 255, 0, 0.1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-surface)")}
                    >
                      {sug}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div
            style={{
              padding: "32px",
              backgroundColor: "var(--bg-surface)",
              borderTop: "1px solid var(--border-strong)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <button
              onClick={() => {
                alert("Template published successfully!");
                navigate("/templates");
              }}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
            >
              <IconUpload size={16} /> PUBLISH SCHEMA
            </button>
            <button
              onClick={handleSaveDraft}
              className="btn-outline"
              style={{ width: "100%", justifyContent: "center" }}
            >
              <IconDeviceFloppy size={16} /> STORE LOCALLY
            </button>
          </div>
        </aside>
      </div>

      {/* Save Draft Success Toast Notification */}
      {toastVisible && (
        <div
          className="animate-fade-up"
          style={{
            position: "fixed",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-primary)",
            padding: "16px 24px",
            fontSize: "14px",
            fontFamily: "Outfit, sans-serif",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 100,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
          }}
        >
          <IconCheck size={20} color="var(--accent-primary)" />
          <span>Local storage successful.</span>
        </div>
      )}
    </div>
  );
}
