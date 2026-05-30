import { useEffect, useMemo, useState } from "react";
import {
  IconSearch,
  IconDownload,
  IconFilter,
  IconFileText,
  IconDotsVertical,
  IconX,
  IconShare,
  IconDownload as IconDownloadDoc,
  IconClock,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { api, type DocumentRow } from "../api/client";

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

function historyStatus(
  status: DocumentRow["status"]
): "Review" | "Approved" | "Email Draft" {
  switch (status) {
    case "approved":
      return "Approved";
    case "email_review":
      return "Email Draft";
    default:
      return "Review";
  }
}

export default function DocumentHistory() {
  const [search, setSearch] = useState("");
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");
  const [records, setRecords] = useState<DocumentRow[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRow | null>(null);
  const [selectedDocDetail, setSelectedDocDetail] = useState<DocumentRow | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDocuments() {
      try {
        const docs = await api.listDocuments();
        if (!cancelled) {
          setRecords(docs);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load history");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDocuments();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredRecords = useMemo(
    () =>
      records.filter(
        (record) =>
          record._id.toLowerCase().includes(search.toLowerCase()) ||
          record.templateName.toLowerCase().includes(search.toLowerCase())
      ),
    [records, search]
  );

  function handleExportCSV(): void {
    const rows = [
      ["documentId", "templateName", "status", "createdAt"],
      ...filteredRecords.map((doc) => [
        doc._id,
        doc.templateName,
        doc.status,
        new Date(doc.createdAt).toISOString(),
      ]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "document-history.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleRowClick(record: DocumentRow): Promise<void> {
    setSelectedDoc(record);
    setSelectedDocDetail(record);
    try {
      const detail = await api.getDocument(record._id);
      setSelectedDocDetail(detail);
    } catch {
      setSelectedDocDetail(record);
    }
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case "Approved":
        return "#22c55e";
      case "Email Draft":
        return "var(--accent-secondary)";
      default:
        return "var(--accent-primary)";
    }
  }

  return (
    <div
      className="animate-fade-up"
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "60px 40px",
        position: "relative",
      }}
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
            Telemetry
          </div>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 4vw, 4rem)",
              fontFamily: "Syne, sans-serif",
              marginBottom: "16px",
            }}
          >
            Document Ledger
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "16px",
              maxWidth: "600px",
              lineHeight: 1.6,
            }}
          >
            Comprehensive audit logs of all synthesized documents. Track
            generation cycles and approval pathways.
          </p>
        </div>
        <button onClick={handleExportCSV} className="btn-outline">
          <IconDownload size={18} /> EXPORT CSV
        </button>
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
            placeholder="Search records..."
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

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="minimal-input"
            style={{ width: "auto", minWidth: "160px" }}
          >
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Custom Range</option>
          </select>
          <button className="btn-outline" style={{ padding: "10px 16px" }}>
            <IconFilter size={18} /> FILTER
          </button>
        </div>
      </div>

      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "var(--text-secondary)",
            }}
          >
            Loading document history...
          </div>
        ) : error ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#ef4444" }}>
            {error}
          </div>
        ) : (
          <>
            <table
              style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}
            >
              <thead>
                <tr
                  style={{
                    background: "var(--bg-elevated)",
                    borderBottom: "1px solid var(--border-strong)",
                  }}
                >
                  <th
                    style={{
                      padding: "16px 24px",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                    }}
                  >
                    Doc ID
                  </th>
                  <th
                    style={{
                      padding: "16px 24px",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                    }}
                  >
                    Template
                  </th>
                  <th
                    style={{
                      padding: "16px 24px",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                    }}
                  >
                    Creator
                  </th>
                  <th
                    style={{
                      padding: "16px 24px",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                    }}
                  >
                    Timestamp
                  </th>
                  <th
                    style={{
                      padding: "16px 24px",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                    }}
                  >
                    Status
                  </th>
                  <th style={{ padding: "16px 24px" }} />
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => {
                  const isSelected = selectedDoc?._id === record._id;
                  const statusLabel = historyStatus(record.status);
                  const statusColor = getStatusColor(statusLabel);

                  return (
                    <tr
                      key={record._id}
                      onClick={() => void handleRowClick(record)}
                      className="hover-highlight"
                      style={{
                        backgroundColor: isSelected
                          ? "rgba(204, 255, 0, 0.05)"
                          : "transparent",
                        borderLeft: isSelected
                          ? "2px solid var(--accent-primary)"
                          : "2px solid transparent",
                        borderBottom: "1px solid var(--border-strong)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <td style={{ padding: "20px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <IconFileText size={20} color="var(--accent-primary)" />
                          <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                            {record._id}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "20px 24px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            backgroundColor: "var(--bg-elevated)",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontFamily: "Outfit, sans-serif",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--border-subtle)",
                          }}
                        >
                          {record.templateName}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "20px 24px",
                          color: "var(--text-primary)",
                          fontSize: "14px",
                        }}
                      >
                        Worker Pipeline
                      </td>
                      <td
                        style={{
                          padding: "20px 24px",
                          color: "var(--text-secondary)",
                          fontSize: "12px",
                          fontFamily: "Outfit, sans-serif",
                        }}
                      >
                        {formatRelativeTime(record.createdAt)}
                      </td>
                      <td style={{ padding: "20px 24px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            color: statusColor,
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: statusColor,
                              boxShadow: `0 0 8px ${statusColor}`,
                            }}
                          />
                          {statusLabel}
                        </span>
                      </td>
                      <td style={{ padding: "20px 24px", textAlign: "right" }}>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <IconDotsVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div
              style={{
                padding: "16px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid var(--border-strong)",
                background: "var(--bg-elevated)",
              }}
            >
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Showing {filteredRecords.length} of {records.length} records
              </span>
              <div style={{ display: "flex", gap: "16px", color: "var(--text-secondary)" }}>
                <span style={{ fontSize: "12px", cursor: "not-allowed", opacity: 0.5 }}>
                  PREV
                </span>
                <span style={{ fontSize: "12px", cursor: "pointer", color: "var(--text-primary)" }}>
                  NEXT
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedDoc ? (
        <>
          <div
            onClick={() => setSelectedDoc(null)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(4px)",
              zIndex: 90,
            }}
          />
          <div
            className="custom-scrollbar"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "480px",
              backgroundColor: "var(--bg-surface)",
              borderLeft: "1px solid var(--border-strong)",
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              boxShadow: "-20px 0 40px rgba(0, 0, 0, 0.5)",
              animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            <div
              style={{
                padding: "32px",
                borderBottom: "1px solid var(--border-strong)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "var(--accent-primary)",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Detail View
                </p>
                <h3
                  style={{ margin: 0, fontSize: "20px", fontFamily: "Syne, sans-serif" }}
                >
                  {selectedDoc._id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  cursor: "pointer",
                  padding: "12px",
                  borderRadius: "50%",
                  display: "flex",
                  color: "var(--text-primary)",
                }}
              >
                <IconX size={18} />
              </button>
            </div>

            <div
              style={{ flex: 1, overflowY: "auto", padding: "32px" }}
              className="custom-scrollbar"
            >
              <div style={{ marginBottom: "48px" }}>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: "var(--text-secondary)",
                    marginBottom: "16px",
                  }}
                >
                  Structured Output
                </p>
                <div
                  style={{
                    minHeight: "220px",
                    backgroundColor: "var(--bg-elevated)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <pre
                    style={{
                      margin: 0,
                      padding: "24px",
                      whiteSpace: "pre-wrap",
                      color: "var(--text-primary)",
                      fontSize: "12px",
                      lineHeight: 1.7,
                      fontFamily: "monospace",
                    }}
                  >
                    {JSON.stringify(
                      selectedDocDetail?.structuredData ?? selectedDoc.structuredData,
                      null,
                      2
                    )}
                  </pre>
                </div>
                {selectedDocDetail?.emailDraft ? (
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "16px",
                      backgroundColor: "var(--bg-base)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        color: "var(--text-secondary)",
                        marginBottom: "12px",
                      }}
                    >
                      Email Draft
                    </p>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--text-primary)",
                        lineHeight: 1.7,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {`To: ${selectedDocDetail.emailDraft.to}\nSubject: ${selectedDocDetail.emailDraft.subject}\n\n${selectedDocDetail.emailDraft.body}`}
                    </div>
                  </div>
                ) : null}
              </div>

              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: "var(--text-secondary)",
                    marginBottom: "32px",
                  }}
                >
                  Audit Trail
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "40px", position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "11px",
                      top: "8px",
                      bottom: "8px",
                      width: "1px",
                      backgroundColor: "var(--border-strong)",
                      zIndex: 1,
                    }}
                  />

                  <div style={{ position: "relative", paddingLeft: "40px", zIndex: 2 }}>
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "var(--bg-surface)",
                        border: "1px solid #22c55e",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconCheck size={12} color="#22c55e" />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          margin: 0,
                        }}
                      >
                        Synthesis Initiated
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          margin: "4px 0 0 0",
                        }}
                      >
                        Worker Pipeline •{" "}
                        {new Date(selectedDoc.createdAt).toLocaleString()}
                      </p>
                      <div
                        style={{
                          marginTop: "12px",
                          backgroundColor: "var(--bg-elevated)",
                          padding: "16px",
                          borderLeft: "2px solid var(--border-strong)",
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Document generated from template {selectedDoc.templateName}.
                      </div>
                    </div>
                  </div>

                  <div style={{ position: "relative", paddingLeft: "40px", zIndex: 2 }}>
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "var(--bg-surface)",
                        border: "1px solid #22c55e",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconCheck size={12} color="#22c55e" />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          margin: 0,
                        }}
                      >
                        Current State
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          margin: "4px 0 0 0",
                        }}
                      >
                        {historyStatus(selectedDoc.status)}
                      </p>
                    </div>
                  </div>

                  <div style={{ position: "relative", paddingLeft: "40px", zIndex: 2 }}>
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "var(--bg-surface)",
                        border: "1px solid var(--accent-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 12px rgba(204,255,0,0.2)",
                      }}
                    >
                      <IconClock size={12} color="var(--accent-primary)" />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "var(--accent-primary)",
                          margin: 0,
                        }}
                      >
                        Output Availability
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          margin: "4px 0 0 0",
                        }}
                      >
                        {selectedDocDetail?.outputUrl
                          ? "Rendered document available for download."
                          : "Rendered file URL not available."}
                      </p>
                      {!selectedDocDetail?.outputUrl ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginTop: "12px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <IconAlertCircle size={14} />
                          <span style={{ fontSize: "12px" }}>
                            The output file may not have been stored for this
                            record.
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "32px",
                backgroundColor: "var(--bg-elevated)",
                borderTop: "1px solid var(--border-strong)",
                display: "flex",
                gap: "16px",
              }}
            >
              {selectedDocDetail?.outputUrl ? (
                <a
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: "center", textDecoration: "none" }}
                  href={selectedDocDetail.outputUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconDownloadDoc size={18} /> EXPORT
                </a>
              ) : (
                <button
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: "center", opacity: 0.5 }}
                  disabled
                >
                  <IconDownloadDoc size={18} /> EXPORT
                </button>
              )}
              <button
                className="btn-outline"
                style={{ padding: "0 24px" }}
                onClick={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify(
                      selectedDocDetail?.structuredData ?? selectedDoc.structuredData,
                      null,
                      2
                    )
                  )
                }
              >
                <IconShare size={18} />
              </button>
            </div>
          </div>
        </>
      ) : null}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
