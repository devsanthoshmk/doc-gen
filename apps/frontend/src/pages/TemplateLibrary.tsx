import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Template {
  id: number;
  title: string;
  category: string;
  status: "Published" | "Drafting" | "Archived";
  description: string;
  updatedAt: string;
  uses: string;
  icon: string;
}

const INITIAL_TEMPLATES: Template[] = [
  {
    id: 1,
    title: "Master Service Agreement",
    category: "Legal",
    status: "Published",
    description: "Standard contract for long-term consulting engagements and vendor relations.",
    updatedAt: "2d ago",
    uses: "1.2k uses",
    icon: "gavel",
  },
  {
    id: 2,
    title: "Onboarding Roadmap",
    category: "HR",
    status: "Published",
    description: "A structured 30-60-90 day plan for new hires across all departments.",
    updatedAt: "5d ago",
    uses: "842 uses",
    icon: "person_add",
  },
  {
    id: 3,
    title: "Quarterly Budget Report",
    category: "Finance",
    status: "Drafting",
    description: "Financial performance summary and projections for stakeholder review.",
    updatedAt: "1h ago",
    uses: "0 uses",
    icon: "payments",
  },
  {
    id: 4,
    title: "Vendor Quality Audit",
    category: "Operations",
    status: "Published",
    description: "Inspection checklist for third-party logistics and manufacturing partners.",
    updatedAt: "12d ago",
    uses: "312 uses",
    icon: "settings_suggest",
  },
];

export default function TemplateLibrary() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Most Recent");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const filteredTemplates = INITIAL_TEMPLATES.filter((tpl) => {
    const matchesSearch =
      tpl.title.toLowerCase().includes(search.toLowerCase()) ||
      tpl.description.toLowerCase().includes(search.toLowerCase());
    const matchesDomain = selectedDomain === "All" || tpl.category === selectedDomain;
    const matchesStatus = selectedStatus === "All" || tpl.status === selectedStatus;
    return matchesSearch && matchesDomain && matchesStatus;
  });

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 48px 4rem 48px" }}>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "1.5rem",
          marginBottom: "4rem",
        }}
      >
        <div>
          <h1
            className="font-playfair"
            style={{
              fontSize: "3rem",
              fontWeight: "700",
              color: "#5d3fd3",
              marginBottom: "1rem",
            }}
          >
            Template Library
          </h1>
          <p style={{ color: "#44474d", fontSize: "18px", fontFamily: "DM Sans" }}>
            Standardize your document workflows with pre-built frameworks.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => navigate("/templates/upload")}
            className="transition-soft"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #c5c6cd",
              color: "#1a1c1b",
              fontWeight: "700",
              padding: "12px 24px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              fontSize: "14px",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              upload_file
            </span>
            <span>Upload Template</span>
          </button>
          <button
            onClick={() => navigate("/templates/editor")}
            className="transition-soft"
            style={{
              backgroundColor: "#FFBF00",
              border: "none",
              color: "#0A192F",
              fontWeight: "700",
              padding: "12px 24px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              fontSize: "14px",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              add_circle
            </span>
            <span>Create New Template</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2.5rem",
          paddingBottom: "1.5rem",
          borderBottom: "1px solid rgba(197, 198, 205, 0.3)",
        }}
      >
        <div style={{ position: "relative", width: "100%", maxWidth: "320px" }}>
          <span
            className="material-symbols-outlined"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#44474d",
              fontSize: "20px",
            }}
          >
            search
          </span>
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 40px",
              backgroundColor: "#ffffff",
              border: "1px solid #c5c6cd",
              borderRadius: "12px",
              outline: "none",
              fontSize: "14px",
              transition: "border-color 0.18s ease",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #c5c6cd",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
              color: "#44474d",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">Domain: All</option>
            <option value="Legal">Legal</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #c5c6cd",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
              color: "#44474d",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">Status: All</option>
            <option value="Published">Published</option>
            <option value="Drafting">Drafting</option>
            <option value="Archived">Archived</option>
          </select>

          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #c5c6cd",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
              color: "#44474d",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option>Sort: Most Recent</option>
            <option>A - Z</option>
            <option>Popularity</option>
          </select>
        </div>
      </div>

      {/* Grid & Cards */}
      {filteredTemplates.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="card-shadow transition-soft"
              onMouseEnter={() => setHoveredCard(tpl.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(197, 198, 205, 0.3)",
                borderRadius: "12px",
                padding: "20px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                cursor: "pointer",
                transform: hoveredCard === tpl.id ? "translateY(-4px)" : "none",
                borderColor: hoveredCard === tpl.id ? "rgba(93, 63, 211, 0.3)" : "rgba(197, 198, 205, 0.3)",
              }}
            >
              {/* Card Icon Header */}
              <div
                style={{
                  width: "100%",
                  height: "128px",
                  backgroundColor: "rgba(93, 63, 211, 0.05)",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.05,
                    backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                    backgroundSize: "8px 8px",
                  }}
                />
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "48px", color: "rgba(93, 63, 211, 0.4)" }}
                >
                  {tpl.icon}
                </span>
              </div>

              {/* Title & Info */}
              <div style={{ flexGrow: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#5d3fd3",
                    }}
                  >
                    {tpl.category}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: tpl.status === "Published" ? "#22c55e" : "#ffbf00",
                      }}
                    />
                    <span style={{ fontSize: "11px", color: "#44474d", fontWeight: 500 }}>
                      {tpl.status}
                    </span>
                  </div>
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#1a1c1b",
                    marginBottom: "8px",
                    fontFamily: "DM Sans",
                  }}
                >
                  {tpl.title}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#44474d",
                    lineHeight: "1.6",
                    marginBottom: "16px",
                  }}
                >
                  {tpl.description}
                </p>
              </div>

              {/* Footer */}
              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(197, 198, 205, 0.2)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#44474d" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                    history
                  </span>
                  <span style={{ fontSize: "11px", fontFamily: "JetBrains Mono" }}>
                    Updated {tpl.updatedAt}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#44474d" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                    visibility
                  </span>
                  <span style={{ fontSize: "11px", fontFamily: "JetBrains Mono" }}>{tpl.uses}</span>
                </div>
              </div>

              {/* Hover Overlay Actions */}
              {hoveredCard === tpl.id && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.96)",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "12px",
                    padding: "24px",
                    zIndex: 10,
                  }}
                >
                  <button
                    onClick={() => navigate("/generate/select-template")}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#5d3fd3",
                      color: "#ffffff",
                      borderRadius: "8px",
                      fontWeight: "500",
                      fontSize: "14px",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                      visibility
                    </span>
                    <span>Use Template</span>
                  </button>
                  <button
                    onClick={() => navigate("/templates/editor")}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#1a1c1b",
                      color: "#ffffff",
                      borderRadius: "8px",
                      fontWeight: "500",
                      fontSize: "14px",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                      edit
                    </span>
                    <span>Edit Template</span>
                  </button>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <button
                      style={{
                        padding: "8px",
                        border: "1px solid #c5c6cd",
                        borderRadius: "8px",
                        fontSize: "13px",
                        color: "#1a1c1b",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                        content_copy
                      </span>
                      <span>Duplicate</span>
                    </button>
                    <button
                      style={{
                        padding: "8px",
                        border: "1px solid #c5c6cd",
                        borderRadius: "8px",
                        fontSize: "13px",
                        color: "#1a1c1b",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                        archive
                      </span>
                      <span>Archive</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "5rem 1rem",
            textAlign: "center",
          }}
        >
          <div style={{ width: "192px", height: "192px", marginBottom: "1.5rem", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(93, 63, 211, 0.05)",
                borderRadius: "50%",
                transform: "scale(1.3)",
              }}
            />
            <div
              className="card-shadow"
              style={{
                position: "relative",
                zIndex: 1,
                backgroundColor: "#ffffff",
                padding: "2rem",
                borderRadius: "16px",
                border: "1px solid #c5c6cd",
                display: "inline-block",
                marginTop: "1.5rem",
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "#5d3fd3", fontSize: "64px" }}>
                search_off
              </span>
            </div>
          </div>
          <h3
            className="font-playfair"
            style={{ fontSize: "1.875rem", color: "#1a1c1b", marginBottom: "0.5rem" }}
          >
            No templates found
          </h3>
          <p
            style={{
              color: "#44474d",
              fontSize: "16px",
              maxWidth: "448px",
              marginBottom: "2rem",
              lineHeight: "1.5",
            }}
          >
            It looks like you haven't created any templates that match your search. Start by building a
            custom framework for your team.
          </p>
          <button
            onClick={() => navigate("/templates/editor")}
            className="transition-soft"
            style={{
              backgroundColor: "#FFBF00",
              color: "#0A192F",
              fontWeight: "700",
              padding: "12px 32px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span className="material-symbols-outlined">add</span>
            <span>Create Your First Template</span>
          </button>
        </div>
      )}
    </div>
  );
}
