import { useState } from "react";
import { IconSearch, IconDownload, IconFilter, IconFileText, IconDotsVertical, IconX, IconShare, IconDownload as IconDownloadDoc, IconClock, IconCheck, IconAlertCircle } from "@tabler/icons-react";

interface HistoryRecord {
  id: string;
  docName: string;
  templateName: string;
  creatorName: string;
  creatorAvatar: string;
  uploadedTime: string;
  status: "Review" | "Approved" | "Sent";
}

const INITIAL_RECORDS: HistoryRecord[] = [
  {
    id: "1",
    docName: "NDA_Client_Alpha_v2",
    templateName: "Master Service Agreement",
    creatorName: "Alex Reed",
    creatorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcCsD9cUa1323N7yk3Z2Se57vo_sOfnnbAIsPjA0_JaVNobliZP-6YUNNo_EmGf9t7bXKqjKc67fYCzm1IlEVl9iAVLDl6UTpU7-1GXU6jxHLFzF_QpDAs10vEpO6W3J2gPqPY5yB29u0uO66YrfGfVkFwwRgup6fGCWe-CoUq_3N1_Xr3kkiNW537D6z_7sXhMc5FXlX6lpQ5ufnIygVN6CdaW8kwbxjY9ZXc70EnpPRo6pR8555mLxa5OjwhrWRSx3x06WgtwBU",
    uploadedTime: "2h ago",
    status: "Review",
  },
  {
    id: "2",
    docName: "Employment_Contract_082",
    templateName: "Standard Hire",
    creatorName: "Sarah Kim",
    creatorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZbG5_CMCycvOnttsycjjGWMpg7772TkYGsocIGI81jc8fyrcXpxlO57G3a2-p_2M1Hgz6Pegb0cjvUWxHVbke5UG5FaYOXoxJERmKT0bM2FqqLuSNZyKUk56K61jF791cRbAeMMOkJe2yz5fA7ASz2p8yrtqGA5WiCAmWq_nOW2JMkm91AuPC5kBY1swuFQyIKwdlk7oj0fpwWxy71IB983LfWWyaeuS647tvjubqPe9Fr2ZFglqxPVSY9w7aoaheH-IiWMxsMiQ",
    uploadedTime: "Yesterday",
    status: "Approved",
  },
  {
    id: "3",
    docName: "Lease_Agreement_404_B",
    templateName: "Real Estate Pro",
    creatorName: "Jamie L.",
    creatorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAse8GH7NLKwam7RvAk_f1eO9mPxWNpbq7LL9lWmYhrlfFkjpZlGOgYWJepnYqa2V5lCTDM_DjImUBj5zZW2RUl4161NwYsi-E2OPmcleUsL1W7w7ge1IHqzyazw0mbiJzOXWj8SvpKmpNdb7_L7f65PTdUh0CPM2Csqtlt8HjhKuG0l2HtXQbbnPzp45C_P5keE2_QJSAJqk7-qIzGVByQERCpEPxMj_kCCOpXxT5xXvPBa7nMBsvFdCFitDC44DrsyDKAXTxffHQ",
    uploadedTime: "Aug 12, 2023",
    status: "Sent",
  },
];

export default function DocumentHistory() {
  const [search, setSearch] = useState("");
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");
  const [selectedDoc, setSelectedDoc] = useState<HistoryRecord | null>(null);

  const filteredRecords = INITIAL_RECORDS.filter(
    (rec) =>
      rec.docName.toLowerCase().includes(search.toLowerCase()) ||
      rec.templateName.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    alert("Exporting CSV report...");
  };

  const handleRowClick = (rec: HistoryRecord) => {
    setSelectedDoc(rec);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "#22c55e"; // Green
      case "Sent": return "var(--accent-secondary)"; // Blue
      default: return "var(--accent-primary)"; // Yellow/Green
    }
  };

  return (
    <div className="animate-fade-up" style={{ maxWidth: "1400px", margin: "0 auto", padding: "60px 40px", position: "relative" }}>
      
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "60px", flexWrap: "wrap", gap: "24px" }}>
        <div>
          <div style={{ color: "var(--accent-primary)", fontSize: "12px", fontWeight: 700, letterSpacing: "2px", marginBottom: "16px", textTransform: "uppercase" }}>
            Telemetry
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", fontFamily: "Syne, sans-serif", marginBottom: "16px" }}>
            Document Ledger
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "600px", lineHeight: 1.6 }}>
            Comprehensive audit logs of all synthesized documents. Track generation cycles and approval pathways.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="btn-outline"
        >
          <IconDownload size={18} /> EXPORT CSV
        </button>
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
            onFocus={(e) => e.target.style.borderColor = "var(--accent-primary)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border-subtle)"}
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
          
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", marginRight: "16px" }}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEr5TvlY9krNgp86L-Y0o8viyagJZRVW0kUQc_n_I_9-GJR4RZSd1IQREkRmiVw1Rj9sjkb8nfmkrU74BXh5KFXNzcMuaPke664qSeAfw_DGRM6wHPZAj1jmerZ3_e7wGdAp6olExOpLMjbkQc7RhCbG6c9rENaoO1fQW1E9opU7X4kX5B8dUjK1cgBzXLq7sgTg8PbpVDiiA4yZbGD2AGqWcptyPCZivxSbry0wqiniM11zP-gE32r-Suof5buMiNgQ4MOAfrKp0"
                alt="Team member"
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid var(--bg-surface)", marginRight: "-8px", objectFit: "cover" }}
              />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAthNASDOxibtXPx_z-JaGvyYVsLeiLPYrsHF2_a2YQbkvGbwjSsiem1mW1ZW5wMP3PCfvltFQHISKnd3PDPJmtYe1eO6kjaGFvB5eVnd2lVqKm7_-xerCF_f-XNIPu6EG-PA-FrkoUHr8Qtyxdy27gZAdFSBVV1gGQuMkjqwAI-8GIYDtpL7W4bRKQD0iNVVyGnbzEbRiAN1ohinQ-p-9ntcOSGp9K7YkrdeAxVRGUBR9nysKff5N-9pmrHB_Jz_wChaMzdR7ch20"
                alt="Team member"
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid var(--bg-surface)", objectFit: "cover" }}
              />
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "var(--bg-elevated)",
                  border: "2px solid var(--bg-surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "var(--accent-primary)",
                  marginLeft: "-8px",
                }}
              >
                +4
              </div>
            </div>
            <button className="btn-outline" style={{ padding: "10px 16px" }}>
              <IconFilter size={18} /> FILTER
            </button>
          </div>
        </div>
      </div>

      {/* History Records Table */}
      <div style={{ 
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "8px",
        overflow: "hidden"
      }}>
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-strong)" }}>
              <th style={{ padding: "16px 24px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Doc Name</th>
              <th style={{ padding: "16px 24px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Template</th>
              <th style={{ padding: "16px 24px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Creator</th>
              <th style={{ padding: "16px 24px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Timestamp</th>
              <th style={{ padding: "16px 24px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Status</th>
              <th style={{ padding: "16px 24px" }} />
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((rec) => {
              const isSelected = selectedDoc?.id === rec.id;
              const statusColor = getStatusColor(rec.status);
              
              return (
                <tr
                  key={rec.id}
                  onClick={() => handleRowClick(rec)}
                  className="hover-highlight"
                  style={{
                    backgroundColor: isSelected ? "rgba(204, 255, 0, 0.05)" : "transparent",
                    borderLeft: isSelected ? "2px solid var(--accent-primary)" : "2px solid transparent",
                    borderBottom: "1px solid var(--border-strong)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <IconFileText size={20} color="var(--accent-primary)" />
                      <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{rec.docName}</span>
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
                      {rec.templateName}
                    </span>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img
                        src={rec.creatorAvatar}
                        alt={rec.creatorName}
                        style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <span style={{ fontSize: "14px", color: "var(--text-primary)" }}>{rec.creatorName}</span>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px", color: "var(--text-secondary)", fontSize: "12px", fontFamily: "Outfit, sans-serif" }}>
                    {rec.uploadedTime}
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
                        letterSpacing: "1px"
                      }}
                    >
                      <span
                        style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: statusColor, boxShadow: `0 0 8px ${statusColor}` }}
                      />
                      {rec.status}
                    </span>
                  </td>
                  <td style={{ padding: "20px 24px", textAlign: "right" }}>
                    <button style={{ background: "none", border: "none", color: "var(--text-secondary)" }}>
                      <IconDotsVertical size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-strong)", background: "var(--bg-elevated)" }}>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Showing {filteredRecords.length} of 128 records
          </span>
          <div style={{ display: "flex", gap: "16px", color: "var(--text-secondary)" }}>
            <span style={{ fontSize: "12px", cursor: "not-allowed", opacity: 0.5 }}>PREV</span>
            <span style={{ fontSize: "12px", cursor: "pointer", color: "var(--text-primary)" }}>NEXT</span>
          </div>
        </div>
      </div>

      {/* Side drawer for document details */}
      {selectedDoc && (
        <>
          {/* Backdrop Overlay */}
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
          {/* Drawer Sheet */}
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
            {/* Drawer Header */}
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
                <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-primary)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Detail View</p>
                <h3 style={{ margin: 0, fontSize: "20px", fontFamily: "Syne, sans-serif" }}>
                  {selectedDoc.docName}
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
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent-primary)";
                  e.currentTarget.style.color = "var(--accent-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
              >
                <IconX size={18} />
              </button>
            </div>

            {/* Drawer Body Scroll */}
            <div style={{ flex: 1, overflowY: "auto", padding: "32px" }} className="custom-scrollbar">
              
              {/* Document snapshot thumbnail container */}
              <div style={{ marginBottom: "48px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)", marginBottom: "16px" }}>
                  Visual Snapshot
                </p>
                <div
                  style={{
                    aspectRatio: "3/4",
                    backgroundColor: "var(--bg-elevated)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Mock content for preview */}
                  <div style={{ padding: "24px", color: "var(--text-secondary)", fontSize: "8px", opacity: 0.5 }}>
                    <div style={{ width: "40%", height: "12px", background: "var(--text-primary)", marginBottom: "32px" }} />
                    <div style={{ width: "100%", height: "4px", background: "currentColor", marginBottom: "8px" }} />
                    <div style={{ width: "100%", height: "4px", background: "currentColor", marginBottom: "8px" }} />
                    <div style={{ width: "80%", height: "4px", background: "currentColor", marginBottom: "32px" }} />
                    <div style={{ width: "100%", height: "4px", background: "currentColor", marginBottom: "8px" }} />
                    <div style={{ width: "90%", height: "4px", background: "currentColor", marginBottom: "8px" }} />
                  </div>
                </div>
              </div>

              {/* Approval timeline */}
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)", marginBottom: "32px" }}>
                  Audit Trail
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "40px", position: "relative" }}>
                  {/* Vertical connect line */}
                  <div style={{ position: "absolute", left: "11px", top: "8px", bottom: "8px", width: "1px", backgroundColor: "var(--border-strong)", zIndex: 1 }} />

                  {/* Step 1 */}
                  <div style={{ position: "relative", paddingLeft: "40px", zIndex: 2 }}>
                    <div style={{ position: "absolute", left: "0", top: "0", width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "var(--bg-surface)", border: "1px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconCheck size={12} color="#22c55e" />
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcCsD9cUa1323N7yk3Z2Se57vo_sOfnnbAIsPjA0_JaVNobliZP-6YUNNo_EmGf9t7bXKqjKc67fYCzm1IlEVl9iAVLDl6UTpU7-1GXU6jxHLFzF_QpDAs10vEpO6W3J2gPqPY5yB29u0uO66YrfGfVkFwwRgup6fGCWe-CoUq_3N1_Xr3kkiNW537D6z_7sXhMc5FXlX6lpQ5ufnIygVN6CdaW8kwbxjY9ZXc70EnpPRo6pR8555mLxa5OjwhrWRSx3x06WgtwBU" alt="Alex Reed" style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Synthesis Initiated</p>
                        <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>Alex Reed • 10:24 AM</p>
                        <div style={{ marginTop: "12px", backgroundColor: "var(--bg-elevated)", padding: "16px", borderLeft: "2px solid var(--border-strong)", fontSize: "13px", color: "var(--text-secondary)" }}>
                          "Initial generation utilizing parameter set Alpha."
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div style={{ position: "relative", paddingLeft: "40px", zIndex: 2 }}>
                    <div style={{ position: "absolute", left: "0", top: "0", width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "var(--bg-surface)", border: "1px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconCheck size={12} color="#22c55e" />
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBletywDc0QeKyWa-MHZQqZ1p6-1uBXbl9675d_mS7_wXWerYyHvnE9z02P9ziKCp4Ij85n3eVpfVKQG_vWjhh0cWsl7_icLpCwx9pOxe4T-sMu82yTe4LE64rWImyqGoNvX1dkY0eDXtkKfEygBDj3mcRoobciv79KYs6FLjpBaLEIpRbN7rbMeasI2Foz8Y-3n1nOAc0FBg5LEoM8BcpfBgq7q5rZnny8aGoxPfQMrktUAdo3jrid47miogP2CFseZsSlj3M39wM" alt="Elena Vance" style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Validation Check</p>
                        <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>Elena Vance • 11:45 AM</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 (Active) */}
                  <div style={{ position: "relative", paddingLeft: "40px", zIndex: 2 }}>
                    <div style={{ position: "absolute", left: "0", top: "0", width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "var(--bg-surface)", border: "1px solid var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(204,255,0,0.2)" }}>
                      <IconClock size={12} color="var(--accent-primary)" />
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-strong)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <IconAlertCircle size={16} color="var(--text-secondary)" />
                      </div>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent-primary)", margin: 0 }}>Pending Authorization</p>
                        <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>Node: Marcus Thorne</p>
                        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                          <button className="btn-primary" style={{ padding: "8px 16px", fontSize: "11px" }}>PING</button>
                          <button className="btn-outline" style={{ padding: "8px 16px", fontSize: "11px" }}>REROUTE</button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div style={{ padding: "32px", backgroundColor: "var(--bg-elevated)", borderTop: "1px solid var(--border-strong)", display: "flex", gap: "16px" }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                <IconDownloadDoc size={18} /> EXPORT
              </button>
              <button className="btn-outline" style={{ padding: "0 24px" }}>
                <IconShare size={18} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Slide right animation styles */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
