import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { IconSearch, IconUpload, IconPlus, IconGavel, IconUserPlus, IconReceipt2, IconAdjustmentsAlt, IconEye, IconHistory, IconCopy, IconArchive, IconZoomCancel } from "@tabler/icons-react";

interface Template {
  id: number;
  title: string;
  category: string;
  status: "Published" | "Drafting" | "Archived";
  description: string;
  updatedAt: string;
  uses: string;
  icon: ReactNode;
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
    icon: <IconGavel size={32} stroke={1.5} />,
  },
  {
    id: 2,
    title: "Onboarding Roadmap",
    category: "HR",
    status: "Published",
    description: "A structured 30-60-90 day plan for new hires across all departments.",
    updatedAt: "5d ago",
    uses: "842 uses",
    icon: <IconUserPlus size={32} stroke={1.5} />,
  },
  {
    id: 3,
    title: "Quarterly Budget Report",
    category: "Finance",
    status: "Drafting",
    description: "Financial performance summary and projections for stakeholder review.",
    updatedAt: "1h ago",
    uses: "0 uses",
    icon: <IconReceipt2 size={32} stroke={1.5} />,
  },
  {
    id: 4,
    title: "Vendor Quality Audit",
    category: "Operations",
    status: "Published",
    description: "Inspection checklist for third-party logistics and manufacturing partners.",
    updatedAt: "12d ago",
    uses: "312 uses",
    icon: <IconAdjustmentsAlt size={32} stroke={1.5} />,
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
    <div className="animate-fade-up" style={{ maxWidth: "1400px", margin: "0 auto", padding: "60px 40px" }}>
      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "60px", flexWrap: "wrap", gap: "24px" }}>
        <div>
          <div style={{ color: "var(--accent-primary)", fontSize: "12px", fontWeight: 700, letterSpacing: "2px", marginBottom: "16px", textTransform: "uppercase" }}>
            Repository
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", fontFamily: "Syne, sans-serif", marginBottom: "16px" }}>
            Template Library
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "600px", lineHeight: 1.6 }}>
            Access and manage structural frameworks for document synthesis. 
            Standardize your workflows with pre-configured models.
          </p>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <button
            onClick={() => navigate("/templates/upload")}
            className="btn-outline"
          >
            <IconUpload size={18} /> Upload Schema
          </button>
          <button
            onClick={() => navigate("/templates/editor")}
            className="btn-primary"
          >
            <IconPlus size={18} /> Create New
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: "16px", 
        marginBottom: "40px", 
        padding: "20px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "8px"
      }}>
        <div style={{ position: "relative", flex: "1 1 300px" }}>
          <IconSearch size={20} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
          <input
            type="text"
            placeholder="Search repository..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 48px",
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              fontFamily: "Outfit, sans-serif",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--accent-primary)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border-subtle)"}
          />
        </div>
        
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="minimal-input"
          style={{ width: "auto", minWidth: "160px" }}
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
          className="minimal-input"
          style={{ width: "auto", minWidth: "160px" }}
        >
          <option value="All">Status: All</option>
          <option value="Published">Published</option>
          <option value="Drafting">Drafting</option>
          <option value="Archived">Archived</option>
        </select>

        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
          className="minimal-input"
          style={{ width: "auto", minWidth: "160px" }}
        >
          <option>Sort: Most Recent</option>
          <option>A - Z</option>
          <option>Popularity</option>
        </select>
      </div>

      {/* Grid & Cards */}
      {filteredTemplates.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="glass-panel"
              onMouseEnter={() => setHoveredCard(tpl.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                padding: "32px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: hoveredCard === tpl.id ? "translateY(-4px)" : "none",
                borderColor: hoveredCard === tpl.id ? "var(--accent-primary)" : "var(--border-subtle)",
                boxShadow: hoveredCard === tpl.id ? "0 8px 32px rgba(204, 255, 0, 0.05)" : "none",
                overflow: "hidden"
              }}
            >
              {/* Card Icon Header */}
              <div style={{ 
                width: "64px", 
                height: "64px", 
                background: "var(--bg-elevated)", 
                border: "1px solid var(--border-strong)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "var(--accent-primary)",
                marginBottom: "24px"
              }}>
                {tpl.icon}
              </div>

              {/* Title & Info */}
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>
                    {tpl.category}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ 
                      width: "6px", 
                      height: "6px", 
                      borderRadius: "50%", 
                      backgroundColor: tpl.status === "Published" ? "var(--accent-primary)" : "var(--text-secondary)",
                      boxShadow: tpl.status === "Published" ? "0 0 8px var(--accent-glow)" : "none"
                    }} />
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {tpl.status}
                    </span>
                  </div>
                </div>
                
                <h3 style={{ fontSize: "20px", fontFamily: "Syne, sans-serif", color: "var(--text-primary)", marginBottom: "12px" }}>
                  {tpl.title}
                </h3>
                
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "24px" }}>
                  {tpl.description}
                </p>
              </div>

              {/* Footer */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "20px", borderTop: "1px solid var(--border-strong)", color: "var(--text-secondary)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <IconHistory size={16} stroke={1.5} />
                  <span style={{ fontSize: "12px", fontFamily: "Outfit, sans-serif" }}>Updated {tpl.updatedAt}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <IconEye size={16} stroke={1.5} />
                  <span style={{ fontSize: "12px", fontFamily: "Outfit, sans-serif" }}>{tpl.uses}</span>
                </div>
              </div>

              {/* Hover Overlay Actions */}
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(5, 5, 5, 0.95)",
                backdropFilter: "blur(4px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "12px",
                padding: "32px",
                opacity: hoveredCard === tpl.id ? 1 : 0,
                visibility: hoveredCard === tpl.id ? "visible" : "hidden",
                transition: "all 0.2s ease",
                zIndex: 10,
              }}>
                <button
                  onClick={() => navigate("/generate/select-template")}
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <IconEye size={18} /> INITIALIZE
                </button>
                <button
                  onClick={() => navigate("/templates/editor")}
                  className="btn-outline"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <IconAdjustmentsAlt size={18} /> EDIT SCHEMA
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <button className="btn-outline" style={{ padding: "8px", justifyContent: "center", fontSize: "12px" }}>
                    <IconCopy size={16} /> DUP
                  </button>
                  <button className="btn-outline" style={{ padding: "8px", justifyContent: "center", fontSize: "12px", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)" }}>
                    <IconArchive size={16} /> ARCHIVE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 20px", textAlign: "center", border: "1px dashed var(--border-strong)" }}>
          <IconZoomCancel size={64} stroke={1} color="var(--text-secondary)" style={{ marginBottom: "24px" }} />
          <h3 style={{ fontSize: "24px", fontFamily: "Syne, sans-serif", color: "var(--text-primary)", marginBottom: "16px" }}>
            Null Result
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "400px", marginBottom: "32px", lineHeight: 1.6 }}>
            No structural frameworks match the current parameters. Adjust filters or initialize a new schema.
          </p>
          <button
            onClick={() => navigate("/templates/editor")}
            className="btn-primary"
          >
            <IconPlus size={18} /> Create New Schema
          </button>
        </div>
      )}
    </div>
  );
}
