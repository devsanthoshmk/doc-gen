import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconSearch,
  IconUpload,
  IconPlus,
  IconGavel,
  IconUserPlus,
  IconReceipt2,
  IconAdjustmentsAlt,
  IconEye,
  IconHistory,
  IconCopy,
  IconZoomCancel,
} from "@tabler/icons-react";
import { api, type TemplateRow } from "../api/client";
import { useGenerate } from "../context/useGenerate";

type TemplateCard = TemplateRow & {
  description: string;
  icon: ReactNode;
  statusLabel: "Published" | "Drafting";
  updatedLabel: string;
  usesLabel: string;
};

/** Render-friendly relative timestamp for template metadata. */
function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

function iconForCategory(category: string): ReactNode {
  switch (category.toLowerCase()) {
    case "legal":
      return <IconGavel size={32} stroke={1.5} />;
    case "hr":
      return <IconUserPlus size={32} stroke={1.5} />;
    case "finance":
      return <IconReceipt2 size={32} stroke={1.5} />;
    default:
      return <IconAdjustmentsAlt size={32} stroke={1.5} />;
  }
}

export default function TemplateLibrary() {
  const navigate = useNavigate();
  const { setSelectedTemplate, setTemplateId } = useGenerate();
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Most Recent");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTemplates() {
      try {
        const rows = await api.listTemplates();
        if (!cancelled) {
          setTemplates(rows);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load templates"
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

  const templateCards = useMemo<TemplateCard[]>(
    () =>
      templates.map((template) => ({
        ...template,
        description:
          template.variables.length > 0
            ? template.variables
                .slice(0, 2)
                .map((variable) => variable.description)
                .join(" ")
            : "No variables extracted yet.",
        icon: iconForCategory(template.category),
        statusLabel: template.status === "published" ? "Published" : "Drafting",
        updatedLabel: formatRelativeTime(template.updatedAt ?? template.createdAt),
        usesLabel: `${template.variables.length} variable${
          template.variables.length === 1 ? "" : "s"
        }`,
      })),
    [templates]
  );

  const filteredTemplates = useMemo(() => {
    const filtered = templateCards.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.description.toLowerCase().includes(search.toLowerCase());
      const matchesDomain =
        selectedDomain === "All" || template.category === selectedDomain;
      const matchesStatus =
        selectedStatus === "All" || template.status === selectedStatus;
      return matchesSearch && matchesDomain && matchesStatus;
    });

    return filtered.toSorted((a, b) => {
      if (selectedSort === "A - Z") return a.name.localeCompare(b.name);
      return (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt);
    });
  }, [search, selectedDomain, selectedStatus, selectedSort, templateCards]);

  function handleInitializeTemplate(template: TemplateRow): void {
    setTemplateId(template._id);
    setSelectedTemplate(template.name);
    navigate("/generate/enter-content");
  }

  return (
    <div
      className="animate-fade-up"
      style={{ maxWidth: "1400px", margin: "0 auto", padding: "60px 40px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "60px",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <div>
          <div
            style={{
              color: "var(--accent-primary)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "2px",
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            Repository
          </div>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 4vw, 4rem)",
              fontFamily: "Syne, sans-serif",
              marginBottom: "16px",
            }}
          >
            Template Library
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "16px",
              maxWidth: "600px",
              lineHeight: 1.6,
            }}
          >
            Access and manage structural frameworks for document synthesis.
            Standardize your workflows with live template data.
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
            onClick={() => navigate("/templates/upload")}
            className="btn-primary"
          >
            <IconPlus size={18} /> Create From DOCX
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "40px",
          padding: "20px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "8px",
        }}
      >
        <div style={{ position: "relative", flex: "1 1 300px" }}>
          <IconSearch
            size={20}
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-secondary)",
            }}
          />
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
            onFocus={(e) => (e.target.style.borderColor = "var(--accent-primary)")}
            onBlur={(e) =>
              (e.target.style.borderColor = "var(--border-subtle)")
            }
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
          <option value="published">Published</option>
          <option value="draft">Drafting</option>
        </select>

        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
          className="minimal-input"
          style={{ width: "auto", minWidth: "160px" }}
        >
          <option>Most Recent</option>
          <option>A - Z</option>
        </select>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: "80px 40px", textAlign: "center" }}>
          Loading templates...
        </div>
      ) : error ? (
        <div
          className="glass-panel"
          style={{ padding: "80px 40px", textAlign: "center", color: "#ef4444" }}
        >
          {error}
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredTemplates.map((template) => (
            <div
              key={template._id}
              className="glass-panel"
              onMouseEnter={() => setHoveredCard(template._id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                padding: "32px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform:
                  hoveredCard === template._id ? "translateY(-4px)" : "none",
                borderColor:
                  hoveredCard === template._id
                    ? "var(--accent-primary)"
                    : "var(--border-subtle)",
                boxShadow:
                  hoveredCard === template._id
                    ? "0 8px 32px rgba(204, 255, 0, 0.05)"
                    : "none",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-strong)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-primary)",
                  marginBottom: "24px",
                }}
              >
                {template.icon}
              </div>

              <div style={{ flexGrow: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {template.category}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor:
                          template.status === "published"
                            ? "var(--accent-primary)"
                            : "var(--text-secondary)",
                        boxShadow:
                          template.status === "published"
                            ? "0 0 8px var(--accent-glow)"
                            : "none",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {template.statusLabel}
                    </span>
                  </div>
                </div>

                <h3
                  style={{
                    fontSize: "20px",
                    fontFamily: "Syne, sans-serif",
                    color: "var(--text-primary)",
                    marginBottom: "12px",
                  }}
                >
                  {template.name}
                </h3>

                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    marginBottom: "24px",
                  }}
                >
                  {template.description}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "20px",
                  borderTop: "1px solid var(--border-strong)",
                  color: "var(--text-secondary)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <IconHistory size={16} stroke={1.5} />
                  <span style={{ fontSize: "12px", fontFamily: "Outfit, sans-serif" }}>
                    Updated {template.updatedLabel}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <IconEye size={16} stroke={1.5} />
                  <span style={{ fontSize: "12px", fontFamily: "Outfit, sans-serif" }}>
                    {template.usesLabel}
                  </span>
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(5, 5, 5, 0.95)",
                  backdropFilter: "blur(4px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "32px",
                  opacity: hoveredCard === template._id ? 1 : 0,
                  visibility: hoveredCard === template._id ? "visible" : "hidden",
                  transition: "all 0.2s ease",
                  zIndex: 10,
                }}
              >
                <button
                  onClick={() => handleInitializeTemplate(template)}
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <IconEye size={18} /> INITIALIZE
                </button>
                <button
                  onClick={() =>
                    navigate(`/templates/editor?templateId=${template._id}`)
                  }
                  className="btn-outline"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <IconCopy size={18} /> EDIT SCHEMA
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: "80px 40px", textAlign: "center" }}>
          <IconZoomCancel
            size={48}
            stroke={1.5}
            color="var(--text-secondary)"
            style={{ marginBottom: "24px", opacity: 0.5 }}
          />
          <h3
            style={{
              fontSize: "24px",
              fontFamily: "Syne, sans-serif",
              marginBottom: "12px",
            }}
          >
            No matching templates found
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Try adjusting your filters or upload a new template framework.
          </p>
        </div>
      )}
    </div>
  );
}
