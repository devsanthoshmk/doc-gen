import { useState } from "react";

interface HistoryRecord {
  id: string;
  docName: string;
  templateName: string;
  creatorName: string;
  creatorAvatar: string;
  uploadedTime: string;
  status: "Review" | "Approved" | "Sent";
  statusColor: string;
  statusBg: string;
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
    statusColor: "#5d3fd3",
    statusBg: "#e6deff",
  },
  {
    id: "2",
    docName: "Employment_Contract_082",
    templateName: "Standard Hire",
    creatorName: "Sarah Kim",
    creatorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZbG5_CMCycvOnttsycjjGWMpg7772TkYGsocIGI81jc8fyrcXpxlO57G3a2-p_2M1Hgz6Pegb0cjvUWxHVbke5UG5FaYOXoxJERmKT0bM2FqqLuSNZyKUk56K61jF791cRbAeMMOkJe2yz5fA7ASz2p8yrtqGA5WiCAmWq_nOW2JMkm91AuPC5kBY1swuFQyIKwdlk7oj0fpwWxy71IB983LfWWyaeuS647tvjubqPe9Fr2ZFglqxPVSY9w7aoaheH-IiWMxsMiQ",
    uploadedTime: "Yesterday",
    status: "Approved",
    statusColor: "#15803d",
    statusBg: "#dcfce7",
  },
  {
    id: "3",
    docName: "Lease_Agreement_404_B",
    templateName: "Real Estate Pro",
    creatorName: "Jamie L.",
    creatorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAse8GH7NLKwam7RvAk_f1eO9mPxWNpbq7LL9lWmYhrlfFkjpZlGOgYWJepnYqa2V5lCTDM_DjImUBj5zZW2RUl4161NwYsi-E2OPmcleUsL1W7w7ge1IHqzyazw0mbiJzOXWj8SvpKmpNdb7_L7f65PTdUh0CPM2Csqtlt8HjhKuG0l2HtXQbbnPzp45C_P5keE2_QJSAJqk7-qIzGVByQERCpEPxMj_kCCOpXxT5xXvPBa7nMBsvFdCFitDC44DrsyDKAXTxffHQ",
    uploadedTime: "Aug 12, 2023",
    status: "Sent",
    statusColor: "#1e40af",
    statusBg: "#dbeafe",
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

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 48px 4rem 48px", position: "relative" }}>
      
      {/* Centered Page Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h2
          className="font-playfair"
          style={{ fontSize: "3rem", color: "#5d3fd3", fontWeight: "700", marginBottom: "1rem" }}
        >
          Document History
        </h2>
        <p
          style={{
            fontFamily: "DM Sans",
            fontSize: "16px",
            color: "#44474d",
            maxWidth: "640px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          Audit log of all generated documents and approvals. Access previously created documents and
          track their progress through the approval pipeline.
        </p>
        <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
          <button
            onClick={handleExportCSV}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              backgroundColor: "transparent",
              border: "1px solid #5d3fd3",
              color: "#5d3fd3",
              fontFamily: "DM Sans",
              fontWeight: "700",
              fontSize: "14px",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#5d3fd3";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#5d3fd3";
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
              download
            </span>
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="sheet-shadow"
        style={{
          backgroundColor: "#ffffff",
          padding: "16px",
          borderRadius: "12px",
          marginBottom: "2rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "center",
          border: "1px solid rgba(197, 198, 205, 0.3)",
        }}
      >
        <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
          <span
            className="material-symbols-outlined"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#44474d",
              fontSize: "18px",
            }}
          >
            search
          </span>
          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 16px 10px 40px",
              backgroundColor: "#f9f9f7",
              border: "none",
              borderRadius: "4px",
              outline: "none",
              fontSize: "13px",
              fontFamily: "JetBrains Mono",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            style={{
              backgroundColor: "#f9f9f7",
              border: "none",
              borderRadius: "4px",
              padding: "10px 32px 10px 16px",
              fontSize: "14px",
              color: "#1a1c1b",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Custom Range</option>
          </select>
          
          <div style={{ display: "flex", alignItems: "center", marginLeft: "12px" }}>
            <div style={{ display: "flex", marginRight: "12px" }}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEr5TvlY9krNgp86L-Y0o8viyagJZRVW0kUQc_n_I_9-GJR4RZSd1IQREkRmiVw1Rj9sjkb8nfmkrU74BXh5KFXNzcMuaPke664qSeAfw_DGRM6wHPZAj1jmerZ3_e7wGdAp6olExOpLMjbkQc7RhCbG6c9rENaoO1fQW1E9opU7X4kX5B8dUjK1cgBzXLq7sgTg8PbpVDiiA4yZbGD2AGqWcptyPCZivxSbry0wqiniM11zP-gE32r-Suof5buMiNgQ4MOAfrKp0"
                alt="Team member"
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #ffffff", marginRight: "-8px", objectFit: "cover" }}
              />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAthNASDOxibtXPx_z-JaGvyYVsLeiLPYrsHF2_a2YQbkvGbwjSsiem1mW1ZW5wMP3PCfvltFQHISKnd3PDPJmtYe1eO6kjaGFvB5eVnd2lVqKm7_-xerCF_f-XNIPu6EG-PA-FrkoUHr8Qtyxdy27gZAdFSBVV1gGQuMkjqwAI-8GIYDtpL7W4bRKQD0iNVVyGnbzEbRiAN1ohinQ-p-9ntcOSGp9K7YkrdeAxVRGUBR9nysKff5N-9pmrHB_Jz_wChaMzdR7ch20"
                alt="Team member"
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #ffffff", objectFit: "cover" }}
              />
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#eeeeec",
                  border: "2px solid #ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#5d3fd3",
                  marginLeft: "-8px",
                }}
              >
                +4
              </div>
            </div>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                backgroundColor: "#f4f4f2",
                border: "none",
                borderRadius: "4px",
                color: "#1a1c1b",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                filter_list
              </span>
              <span>Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* History Records Table */}
      <div
        className="sheet-shadow"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid rgba(197, 198, 205, 0.3)",
          marginBottom: "4rem",
        }}
      >
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f2", borderBottom: "1px solid rgba(197, 198, 205, 0.3)" }}>
              <th style={{ padding: "16px 24px", fontSize: "14px", color: "#44474d", fontWeight: "500" }}>Doc Name</th>
              <th style={{ padding: "16px 24px", fontSize: "14px", color: "#44474d", fontWeight: "500" }}>Template</th>
              <th style={{ padding: "16px 24px", fontSize: "14px", color: "#44474d", fontWeight: "500" }}>Creator</th>
              <th style={{ padding: "16px 24px", fontSize: "14px", color: "#44474d", fontWeight: "500" }}>Date</th>
              <th style={{ padding: "16px 24px", fontSize: "14px", color: "#44474d", fontWeight: "500" }}>Status</th>
              <th style={{ padding: "16px 24px" }} />
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((rec) => {
              const isSelected = selectedDoc?.id === rec.id;
              return (
                <tr
                  key={rec.id}
                  onClick={() => handleRowClick(rec)}
                  style={{
                    backgroundColor: isSelected ? "rgba(93, 63, 211, 0.05)" : "transparent",
                    borderLeft: isSelected ? "4px solid #5d3fd3" : "none",
                    borderBottom: "1px solid rgba(197, 198, 205, 0.1)",
                    cursor: "pointer",
                    transition: "background-color 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = "#f9f9f7";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span className="material-symbols-outlined" style={{ color: "#5d3fd3" }}>
                        description
                      </span>
                      <span style={{ fontWeight: "700", color: "#1a1c1b" }}>{rec.docName}</span>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        backgroundColor: "#f4f4f2",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontFamily: "JetBrains Mono",
                        color: "#44474d",
                        border: "1px solid rgba(197, 198, 205, 0.1)",
                      }}
                    >
                      {rec.templateName}
                    </span>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <img
                        src={rec.creatorAvatar}
                        alt={rec.creatorName}
                        style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <span style={{ fontSize: "14px", color: "#1a1c1b" }}>{rec.creatorName}</span>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px", color: "#44474d", fontSize: "14px" }}>
                    {rec.uploadedTime}
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "4px 10px",
                        borderRadius: "9999px",
                        backgroundColor: rec.statusBg,
                        color: rec.statusColor,
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      <span
                        style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: rec.statusColor }}
                      />
                      {rec.status}
                    </span>
                  </td>
                  <td style={{ padding: "20px 24px", textAlign: "right" }}>
                    <button style={{ background: "none", border: "none", color: "#44474d" }}>
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div
          style={{
            padding: "16px",
            backgroundColor: "#f4f4f2",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "14px", color: "#44474d" }}>
            Showing {filteredRecords.length} of 128 documents
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              disabled
              style={{
                padding: "4px",
                border: "none",
                backgroundColor: "transparent",
                color: "#1a1c1b",
                opacity: 0.3,
                cursor: "not-allowed",
              }}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button style={{ padding: "4px", border: "none", backgroundColor: "transparent", color: "#1a1c1b", cursor: "pointer" }}>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
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
              backgroundColor: "rgba(0, 0, 0, 0.4)",
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
              width: "400px",
              backgroundColor: "#ffffff",
              borderLeft: "1px solid rgba(197, 198, 205, 0.3)",
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 0 24px rgba(0, 0, 0, 0.15)",
              animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: "24px",
                borderBottom: "1px solid rgba(197, 198, 205, 0.3)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#ffffff",
              }}
            >
              <h3 className="font-playfair text-xl" style={{ margin: 0, fontWeight: "700" }}>
                Document Details
              </h3>
              <button
                onClick={() => setSelectedDoc(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "50%",
                  display: "flex",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f4f4f2")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Drawer Body Scroll */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px" }} className="scrollbar-hide">
              
              {/* Document snapshot thumbnail container */}
              <div style={{ marginBottom: "40px" }}>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "#75777e",
                    marginBottom: "16px",
                  }}
                >
                  Preview Snapshot
                </p>
                <div
                  style={{
                    aspectRatio: "3/4",
                    backgroundColor: "#f4f4f2",
                    border: "1px solid rgba(197, 198, 205, 0.2)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <iframe
                    src="/dummy-agreement.html"
                    title="Document Preview"
                    style={{
                      width: "285.7%",
                      height: "285.7%",
                      transform: "scale(0.35)",
                      transformOrigin: "top left",
                      border: "none",
                      overflow: "hidden",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>

              {/* Approval timeline */}
              <div>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "#75777e",
                    marginBottom: "32px",
                  }}
                >
                  Approval Timeline
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "40px", position: "relative" }}>
                  {/* Vertical connect line */}
                  <div
                    style={{
                      position: "absolute",
                      left: "16px",
                      top: "8px",
                      bottom: "8px",
                      width: "2px",
                      backgroundColor: "rgba(197, 198, 205, 0.2)",
                      zIndex: 1,
                    }}
                  />

                  {/* Step 1 */}
                  <div style={{ position: "relative", paddingLeft: "48px", zIndex: 2 }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "6px",
                        top: "6px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: "#22c55e",
                        border: "4px solid #ffffff",
                        boxShadow: "0 0 0 1px #22c55e",
                      }}
                    />
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcCsD9cUa1323N7yk3Z2Se57vo_sOfnnbAIsPjA0_JaVNobliZP-6YUNNo_EmGf9t7bXKqjKc67fYCzm1IlEVl9iAVLDl6UTpU7-1GXU6jxHLFzF_QpDAs10vEpO6W3J2gPqPY5yB29u0uO66YrfGfVkFwwRgup6fGCWe-CoUq_3N1_Xr3kkiNW537D6z_7sXhMc5FXlX6lpQ5ufnIygVN6CdaW8kwbxjY9ZXc70EnpPRo6pR8555mLxa5OjwhrWRSx3x06WgtwBU"
                        alt="Alex Reed"
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: "700", color: "#1a1c1b", margin: 0 }}>Document Drafted</p>
                        <p style={{ fontSize: "12px", color: "#44474d", margin: "2px 0 0 0" }}>Alex Reed • 10:24 AM</p>
                        <div
                          style={{
                            marginTop: "8px",
                            backgroundColor: "#f4f4f2",
                            padding: "12px",
                            borderRadius: "4px",
                            border: "1px solid rgba(197, 198, 205, 0.1)",
                            fontSize: "12px",
                            fontStyle: "italic",
                            color: "#44474d",
                          }}
                        >
                          "Initial draft using MSA-2024 Template."
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div style={{ position: "relative", paddingLeft: "48px", zIndex: 2 }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "6px",
                        top: "6px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: "#22c55e",
                        border: "4px solid #ffffff",
                        boxShadow: "0 0 0 1px #22c55e",
                      }}
                    />
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBletywDc0QeKyWa-MHZQqZ1p6-1uBXbl9675d_mS7_wXWerYyHvnE9z02P9ziKCp4Ij85n3eVpfVKQG_vWjhh0cWsl7_icLpCwx9pOxe4T-sMu82yTe4LE64rWImyqGoNvX1dkY0eDXtkKfEygBDj3mcRoobciv79KYs6FLjpBaLEIpRbN7rbMeasI2Foz8Y-3n1nOAc0FBg5LEoM8BcpfBgq7q5rZnny8aGoxPfQMrktUAdo3jrid47miogP2CFseZsSlj3M39wM"
                        alt="Elena Vance"
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: "700", color: "#1a1c1b", margin: 0 }}>Legal Review Complete</p>
                        <p style={{ fontSize: "12px", color: "#44474d", margin: "2px 0 0 0" }}>Elena Vance • 11:45 AM</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 (Active) */}
                  <div style={{ position: "relative", paddingLeft: "48px", zIndex: 2 }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "6px",
                        top: "6px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: "#5d3fd3",
                        border: "4px solid #ffffff",
                        boxShadow: "0 0 0 1px #5d3fd3",
                      }}
                    />
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "#eeeeec",
                          border: "1px solid rgba(197, 198, 205, 0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#44474d" }}>
                          person_search
                        </span>
                      </div>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: "700", color: "#5d3fd3", margin: 0 }}>
                          Awaiting Executive Approval
                        </p>
                        <p style={{ fontSize: "12px", color: "#44474d", margin: "2px 0 0 0" }}>
                          Assigned to: Marcus Thorne
                        </p>
                        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                          <button
                            onClick={() => alert("Reminder notification sent to Marcus Thorne!")}
                            style={{
                              backgroundColor: "#5d3fd3",
                              color: "#ffffff",
                              padding: "6px 16px",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "700",
                              cursor: "pointer",
                            }}
                          >
                            Remind
                          </button>
                          <button
                            onClick={() => alert("Reassigning approval flow...")}
                            style={{
                              backgroundColor: "transparent",
                              border: "1px solid rgba(197, 198, 205, 0.3)",
                              padding: "6px 16px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "700",
                              cursor: "pointer",
                              color: "#1a1c1b",
                            }}
                          >
                            Reassign
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div
              style={{
                padding: "24px",
                backgroundColor: "#f4f4f2",
                borderTop: "1px solid rgba(197, 198, 205, 0.3)",
                display: "flex",
                gap: "12px",
              }}
            >
              <button
                onClick={() => alert("Downloading document bundle...")}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#5d3fd3",
                  color: "#ffffff",
                  fontWeight: "700",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(93, 63, 211, 0.15)",
                }}
              >
                Download Bundle
              </button>
              <button
                onClick={() => alert("Sharing document reference link...")}
                style={{
                  padding: "12px",
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(197, 198, 205, 0.3)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="material-symbols-outlined" style={{ color: "#44474d" }}>
                  share
                </span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Slide right animation styles */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
