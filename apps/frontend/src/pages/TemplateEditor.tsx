import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  IconAt,
  IconCalendar,
  IconBuildingStore,
  IconCurrencyDollar,
  IconTextPlus,
  IconX,
  IconCheck,
  IconUpload,
  IconDeviceFloppy,
  IconInfoCircle,
} from "@tabler/icons-react";
import { api, type TemplateVariable } from "../api/client";

type LocationState = {
  templateId?: string;
  variables?: TemplateVariable[];
  name?: string;
};

interface EditableVariable extends TemplateVariable {
  icon: ReactNode;
}

function iconForVariable(name: string): ReactNode {
  const lowered = name.toLowerCase();
  if (lowered.includes("date")) return <IconCalendar size={14} />;
  if (lowered.includes("company")) return <IconBuildingStore size={14} />;
  if (lowered.includes("amount") || lowered.includes("salary")) {
    return <IconCurrencyDollar size={14} />;
  }
  return <IconAt size={14} />;
}

export default function TemplateEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const state = (location.state as LocationState | null) ?? null;
  const templateId = state?.templateId ?? searchParams.get("templateId") ?? "";
  const [templateName, setTemplateName] = useState(state?.name ?? "");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [variables, setVariables] = useState<EditableVariable[]>(
    (state?.variables ?? []).map((variable) => ({
      ...variable,
      icon: iconForVariable(variable.name),
    }))
  );
  const [loading, setLoading] = useState(
    Boolean(templateId) && !state?.variables?.length
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId) return;

    if (state?.variables?.length) {
      return;
    }

    let cancelled = false;

    async function loadTemplate() {
      try {
        const template = await api.getTemplate(templateId);
        if (cancelled) return;
        setTemplateName(template.name);
        setVariables(
          template.variables.map((variable) => ({
            ...variable,
            icon: iconForVariable(variable.name),
          }))
        );
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load template"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadTemplate();
    return () => {
      cancelled = true;
    };
  }, [state?.variables, templateId]);

  function showToast(message: string): void {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }

  function handleAddCustomField(): void {
    const fieldName = prompt("Enter custom field name (e.g. client_phone):");
    if (!fieldName) return;
    const normalized = fieldName.replace(/[{}]/g, "").trim();
    if (!normalized) return;

    setVariables((prev) => [
      ...prev,
      {
        name: normalized,
        description: `Value for ${normalized}`,
        type: "string",
        icon: <IconTextPlus size={14} />,
      },
    ]);
  }

  function handleRemoveField(name: string): void {
    setVariables((prev) => prev.filter((variable) => variable.name !== name));
  }

  function handleVariableChange(
    name: string,
    patch: Partial<TemplateVariable>
  ): void {
    setVariables((prev) =>
      prev.map((variable) =>
        variable.name === name ? { ...variable, ...patch } : variable
      )
    );
  }

  /** Persists the edited template schema in Convex through the worker API. */
  async function saveTemplate(status: "draft" | "published"): Promise<void> {
    if (!templateId) return;
    setSaving(true);
    setError(null);

    try {
      await api.updateTemplate(templateId, {
        name: templateName,
        variables: variables.map((variable) => ({
          name: variable.name,
          description: variable.description,
          type: variable.type,
        })),
        status,
      });
      showToast(
        status === "published"
          ? "Schema published successfully."
          : "Draft saved successfully."
      );
      if (status === "published") {
        navigate("/templates");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 208px)",
        overflow: "hidden",
      }}
      className="animate-fade-up"
    >
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
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
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginTop: "16px",
                  alignItems: "center",
                }}
              >
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
                  {loading ? "Loading" : "Drafting"}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  Template ID: {templateId || "Not available"}
                </span>
              </div>
            </div>

            <div
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "16px",
                color: "var(--text-secondary)",
                lineHeight: 1.8,
              }}
            >
              <p
                style={{
                  marginBottom: "24px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                REVIEW THE AI-DRAFTED SCHEMA
              </p>
              <div
                style={{
                  marginBottom: "32px",
                  padding: "20px",
                  backgroundColor: "var(--bg-elevated)",
                  borderLeft: "2px solid var(--accent-primary)",
                }}
              >
                {loading
                  ? "Loading template metadata..."
                  : "The worker already extracted variables from the uploaded DOCX and drafted descriptions for them. Review those descriptions here, correct anything ambiguous, then save the draft or publish it."}
              </div>
              {error ?? !templateId ? (
                <div
                  style={{
                    marginBottom: "24px",
                    padding: "16px 20px",
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    color: "#fca5a5",
                    fontSize: "14px",
                  }}
                >
                  {error ?? "No template selected. Upload a DOCX template first."}
                </div>
              ) : null}
              <div
                style={{
                  display: "grid",
                  gap: "16px",
                }}
              >
                {variables.map((variable) => (
                  <div
                    key={variable.name}
                    style={{
                      padding: "20px",
                      backgroundColor: "var(--bg-elevated)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "16px",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          color: "var(--accent-primary)",
                        }}
                      >
                        {variable.icon}
                        <span
                          style={{
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            fontSize: "14px",
                          }}
                        >
                          {`{{${variable.name}}}`}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveField(variable.name)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          display: "flex",
                          padding: 0,
                        }}
                      >
                        <IconX size={14} />
                      </button>
                    </div>
                    <textarea
                      value={variable.description}
                      onChange={(e) =>
                        handleVariableChange(variable.name, {
                          description: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        minHeight: "96px",
                        backgroundColor: "var(--bg-surface)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--text-primary)",
                        padding: "14px",
                        resize: "vertical",
                        fontFamily: "Outfit, sans-serif",
                        fontSize: "14px",
                        outline: "none",
                        marginBottom: "12px",
                      }}
                    />
                    <select
                      value={variable.type ?? "string"}
                      onChange={(e) =>
                        handleVariableChange(variable.name, {
                          type: e.target.value as TemplateVariable["type"],
                        })
                      }
                      className="minimal-input"
                      style={{ width: "160px" }}
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

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
          <div
            style={{
              padding: "24px 32px",
              borderBottom: "1px solid var(--border-strong)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontFamily: "Syne, sans-serif",
                color: "var(--text-primary)",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Variables
            </h3>
            <IconInfoCircle size={18} color="var(--text-secondary)" />
          </div>

          <div
            style={{
              padding: "32px",
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
            className="custom-scrollbar"
          >
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Edit each variable description so the AI can structure raw content
              into the correct JSON shape later.
            </p>
            {variables.map((variable) => (
              <div
                key={variable.name}
                style={{
                  padding: "12px 16px",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                    fontWeight: 700,
                  }}
                >
                  {`{{${variable.name}}}`}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {variable.description}
                </div>
              </div>
            ))}

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
              }}
            >
              <IconTextPlus size={16} /> ADD CUSTOM NODE
            </button>
          </div>

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
              onClick={() => void saveTemplate("published")}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={saving || loading || !templateId}
            >
              <IconUpload size={16} /> PUBLISH SCHEMA
            </button>
            <button
              onClick={() => void saveTemplate("draft")}
              className="btn-outline"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={saving || loading || !templateId}
            >
              <IconDeviceFloppy size={16} /> STORE LOCALLY
            </button>
          </div>
        </aside>
      </div>

      {toastMessage ? (
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
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <IconCheck size={20} color="var(--accent-primary)" />
          <span>{toastMessage}</span>
        </div>
      ) : null}
    </div>
  );
}
