import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Placeholder {
  name: string;
  icon: string;
}

export default function TemplateEditor() {
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState("Executive Consulting Agreement");
  const [toastVisible, setToastVisible] = useState(false);
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([
    { name: "{{client_name}}", icon: "alternate_email" },
    { name: "{{date}}", icon: "calendar_today" },
    { name: "{{company_legal_name}}", icon: "corporate_fare" },
    { name: "{{monthly_retainer_amount}}", icon: "payments" },
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
      setPlaceholders([...placeholders, { name: formatted, icon: "text_fields" }]);
    }
  };

  const handleRemoveField = (name: string) => {
    setPlaceholders(placeholders.filter((p) => p.name !== name));
  };

  const handleAddSuggestion = (name: string) => {
    setPlaceholders([...placeholders, { name, icon: "auto_awesome" }]);
    setAiSuggestions(aiSuggestions.filter((s) => s !== name));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)", overflow: "hidden" }}>
      {/* Editor Content Area (Canvas and Sidebar wrapper) */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* Workspace Canvas (Left side) */}
        <section
          style={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: "rgba(244, 244, 242, 0.5)",
            padding: "3rem 2rem",
            position: "relative",
          }}
          className="custom-scrollbar"
        >
          {/* Document Canvas Sheet */}
          <div
            className="paper-shadow"
            style={{
              maxWidth: "850px",
              margin: "0 auto",
              backgroundColor: "#ffffff",
              border: "1px solid rgba(197, 198, 205, 0.3)",
              padding: "64px",
              minHeight: "1100px",
              position: "relative",
            }}
          >
            {/* Header / Meta */}
            <div
              style={{
                marginBottom: "3rem",
                borderBottom: "1px solid rgba(197, 198, 205, 0.3)",
                paddingBottom: "2rem",
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
                  fontSize: "36px",
                  fontWeight: "700",
                  fontFamily: "Playfair Display",
                  color: "#1a1c1b",
                  outline: "none",
                  backgroundColor: "transparent",
                }}
              />
              <div style={{ display: "flex", gap: "16px", marginTop: "16px", alignItems: "center" }}>
                <span
                  style={{
                    backgroundColor: "rgba(93, 63, 211, 0.1)",
                    border: "1px solid rgba(93, 63, 211, 0.2)",
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    color: "#5d3fd3",
                    fontSize: "11px",
                    fontFamily: "JetBrains Mono",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Drafting
                </span>
                <span style={{ fontSize: "12px", color: "#75777e", fontFamily: "DM Sans" }}>
                  Last edited 2 mins ago
                </span>
              </div>
            </div>

            {/* Simulated Rich Text Editor Content */}
            <div
              style={{
                fontFamily: "DM Sans",
                fontSize: "18px",
                color: "#44474d",
                lineHeight: "1.6",
              }}
            >
              <p style={{ marginBottom: "24px", fontWeight: "700", color: "#1a1c1b" }}>BETWEEN:</p>
              
              <div
                style={{
                  marginBottom: "32px",
                  padding: "16px",
                  backgroundColor: "rgba(93, 63, 211, 0.05)",
                  borderLeft: "3px solid #5d3fd3",
                  fontStyle: "italic",
                }}
              >
                This agreement is dated <span style={{ color: "#5d3fd3", fontWeight: "700" }}>{"{{date}}"}</span> and
                is made between <span style={{ color: "#5d3fd3", fontWeight: "700" }}>{"{{company_legal_name}}"}</span> and the
                individual specified as the client.
              </div>

              <h2
                className="font-playfair"
                style={{ fontSize: "24px", color: "#1a1c1b", marginTop: "48px", marginBottom: "16px" }}
              >
                1. Scope of Services
              </h2>
              <p style={{ marginBottom: "24px" }}>
                The Consultant shall provide executive advisory services to{" "}
                <span style={{ color: "#5d3fd3", fontWeight: "700" }}>{"{{client_name}}"}</span> focused on strategic
                growth and digital transformation. These services will include but are not limited to quarterly
                performance reviews and market positioning analysis.
              </p>

              <h2
                className="font-playfair"
                style={{ fontSize: "24px", color: "#1a1c1b", marginTop: "48px", marginBottom: "16px" }}
              >
                2. Compensation
              </h2>
              <p style={{ marginBottom: "24px" }}>
                For the services rendered,{" "}
                <span style={{ color: "#5d3fd3", fontWeight: "700" }}>{"{{client_name}}"}</span> agrees to pay a fixed
                monthly retainer of{" "}
                <span style={{ color: "#5d3fd3", fontWeight: "700" }}>{"{{monthly_retainer_amount}}"}</span>. Invoices are
                due within 30 days of receipt.
              </p>

              <p
                style={{
                  marginTop: "64px",
                  borderTop: "1px dashed rgba(197, 198, 205, 0.5)",
                  paddingTop: "16px",
                  color: "#d1d1cf",
                  fontFamily: "JetBrains Mono",
                  fontSize: "13px",
                }}
              >
                [End of Template Draft — Add more sections from the sidebar]
              </p>
            </div>

            {/* AI Floating Toolbar */}
            <div
              className="sheet-shadow"
              style={{
                position: "absolute",
                bottom: "32px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#1a1c1b",
                padding: "12px 20px",
                borderRadius: "12px",
                color: "#ffffff",
                zIndex: 20,
                width: "max-content",
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "#FFBF00", fontSize: "20px" }}>
                auto_awesome
              </span>
              <span style={{ fontSize: "14px", fontFamily: "DM Sans" }}>Ask AI to polish paragraph...</span>
              <div style={{ width: "1px", height: "16px", backgroundColor: "rgba(255,255,255,0.2)", margin: "0 8px" }} />
              <button style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", display: "flex" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>format_bold</span>
              </button>
              <button style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", display: "flex" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>format_italic</span>
              </button>
              <button style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", display: "flex" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>link</span>
              </button>
            </div>

          </div>
        </section>

        {/* Right Sidebar: Placeholders Panel (Right side) */}
        <aside
          style={{
            width: "320px",
            backgroundColor: "#eeeeec",
            borderLeft: "1px solid rgba(197, 198, 205, 0.3)",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "24px",
              borderBottom: "1px solid rgba(197, 198, 205, 0.2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 className="font-headline-md" style={{ fontSize: "18px", color: "#1a1c1b", margin: 0 }}>
              Placeholders
            </h3>
            <span className="material-symbols-outlined" style={{ color: "#75777e" }}>
              info
            </span>
          </div>

          {/* Placeholders Content */}
          <div style={{ padding: "24px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px" }} className="custom-scrollbar">
            <p style={{ fontSize: "12px", color: "#44474d", lineHeight: "1.5", opacity: 0.8 }}>
              Click dynamic fields below to insert them into your template, or create custom ones.
            </p>

            {/* List */}
            <div>
              <h4
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#75777e",
                  marginBottom: "12px",
                }}
              >
                Standard Fields
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {placeholders.map((p) => (
                  <div
                    key={p.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px",
                      backgroundColor: "#ffffff",
                      border: "1px solid rgba(10, 25, 47, 0.05)",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "border-color 0.18s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#5d3fd3")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(10, 25, 47, 0.05)")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#5d3fd3" }}>
                        {p.icon}
                      </span>
                      <span style={{ fontSize: "12px", fontFamily: "JetBrains Mono", color: "#1a1c1b" }}>
                        {p.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveField(p.name)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ba1a1a",
                        cursor: "pointer",
                        display: "flex",
                        padding: 0,
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                        close
                      </span>
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
                padding: "12px",
                border: "1px dashed rgba(10, 25, 47, 0.3)",
                backgroundColor: "transparent",
                color: "#44474d",
                fontSize: "12px",
                fontWeight: "500",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#5d3fd3";
                e.currentTarget.style.borderColor = "#5d3fd3";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#44474d";
                e.currentTarget.style.borderColor = "rgba(10, 25, 47, 0.3)";
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                add_circle
              </span>
              <span>Add Dynamic Field</span>
            </button>

            {/* AI Smart Suggest Box */}
            {aiSuggestions.length > 0 && (
              <div
                style={{
                  backgroundColor: "rgba(93, 63, 211, 0.05)",
                  border: "1px solid rgba(93, 63, 211, 0.2)",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span className="material-symbols-outlined" style={{ color: "#5d3fd3", fontSize: "16px" }}>
                    auto_awesome
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#5d3fd3", fontFamily: "DM Sans" }}>
                    AI Smart Suggest
                  </span>
                </div>
                <p style={{ fontSize: "11px", color: "#44474d", marginBottom: "12px" }}>
                  Found {aiSuggestions.length} items that look like they should be placeholders:
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {aiSuggestions.map((sug) => (
                    <span
                      key={sug}
                      onClick={() => handleAddSuggestion(sug)}
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#ffffff",
                        border: "1px solid rgba(93, 63, 211, 0.1)",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontFamily: "JetBrains Mono",
                        color: "#5d3fd3",
                        cursor: "pointer",
                        transition: "background-color 0.18s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(93, 63, 211, 0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
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
              padding: "24px",
              backgroundColor: "#eeeeec",
              borderTop: "1px solid rgba(197, 198, 205, 0.2)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <button
              onClick={() => {
                alert("Template published successfully!");
                navigate("/templates");
              }}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#5d3fd3",
                color: "#ffffff",
                fontWeight: "700",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(93, 63, 211, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                publish
              </span>
              <span>Publish Template</span>
            </button>
            <button
              onClick={handleSaveDraft}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "transparent",
                border: "1px solid #1a1c1b",
                color: "#1a1c1b",
                fontWeight: "700",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1a1c1b";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#1a1c1b";
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                save
              </span>
              <span>Save Draft</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Save Draft Success Toast Notification */}
      {toastVisible && (
        <div
          className="toast-animate card-shadow"
          style={{
            position: "fixed",
            bottom: "32px",
            left: "50%",
            backgroundColor: "#1a1c1b",
            color: "#ffffff",
            padding: "16px 24px",
            borderRadius: "12px",
            fontSize: "14px",
            fontFamily: "DM Sans",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 100,
          }}
        >
          <span className="material-symbols-outlined" style={{ color: "#22c55e", fontSize: "20px" }}>
            check_circle
          </span>
          <span>Draft Saved Successfully</span>
        </div>
      )}
    </div>
  );
}
