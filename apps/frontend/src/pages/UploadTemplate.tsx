import { useState, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft, IconCloudUpload, IconFileTypePdf, IconFileTypeDocx, IconFileTypeTxt, IconCheck, IconLock, IconUsers, IconWorld, IconArrowRight, IconDotsVertical, IconAlertCircle } from "@tabler/icons-react";
import { api, fileToBase64, type ApiError } from "../api/client";

interface UploadedFile {
  id: string;
  name: string;
  category: string;
  status: "Processing..." | "Success" | "Corrupted File";
  uploadedTime: string;
  icon: ReactNode;
}

export default function UploadTemplate() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeCategory, setActiveCategory] = useState("Legal");
  const [activePrivacy, setActivePrivacy] = useState("Private");
  const [recentUploads, setRecentUploads] = useState<UploadedFile[]>([
    {
      id: "1",
      name: "NDA_Enterprise_Draft_2024.pdf",
      category: "Legal",
      status: "Success",
      uploadedTime: "2 hours ago",
      icon: <IconFileTypePdf size={20} color="var(--accent-primary)" />,
    },
    {
      id: "2",
      name: "Employee_Onboarding_V3.docx",
      category: "HR",
      status: "Success",
      uploadedTime: "5 hours ago",
      icon: <IconFileTypeDocx size={20} color="var(--accent-primary)" />,
    },
    {
      id: "3",
      name: "Q4_Financial_Notes_Raw.txt",
      category: "Finance",
      status: "Corrupted File",
      uploadedTime: "Yesterday",
      icon: <IconFileTypeTxt size={20} color="#ef4444" />,
    },
  ]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleProcessTemplate = async () => {
    if (!selectedFile || processing) return;
    if (!selectedFile.name.toLowerCase().endsWith(".docx")) {
      setError("Only .docx templates are supported for AI schema extraction.");
      return;
    }

    setError(null);
    setProcessing(true);

    const newFileId = Math.random().toString(36).substring(7);
    const fileName = selectedFile.name;
    const newFileRecord: UploadedFile = {
      id: newFileId,
      name: fileName,
      category: activeCategory,
      status: "Processing...",
      uploadedTime: "Just now",
      icon: <IconFileTypeDocx size={20} color="var(--accent-primary)" />,
    };
    setRecentUploads((prev) => [newFileRecord, ...prev]);

    try {
      const base64 = await fileToBase64(selectedFile);
      const res = await api.uploadTemplate({
        filename: fileName,
        category: activeCategory,
        access: activePrivacy,
        base64,
      });
      setRecentUploads((prev) =>
        prev.map((f) => (f.id === newFileId ? { ...f, status: "Success" } : f))
      );
      setSelectedFile(null);
      // Hand off to the editor to review/edit AI-drafted descriptions.
      navigate(`/templates/editor?templateId=${res.templateId}`, {
        state: {
          templateId: res.templateId,
          variables: res.variables,
          name: fileName.replace(/\.docx$/i, ""),
        },
      });
    } catch (err) {
      const msg = (err as ApiError).message ?? "Upload failed";
      setError(msg);
      setRecentUploads((prev) =>
        prev.map((f) =>
          f.id === newFileId ? { ...f, status: "Corrupted File" } : f
        )
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="animate-fade-up" style={{ maxWidth: "1400px", margin: "0 auto", padding: "60px 40px" }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "60px" }}>
        <button
          onClick={() => navigate("/templates")}
          style={{
            background: "none",
            border: "none",
            color: "var(--accent-primary)",
            fontFamily: "Outfit, sans-serif",
            fontWeight: 700,
            fontSize: "12px",
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            padding: 0,
            textTransform: "uppercase"
          }}
        >
          <IconArrowLeft size={16} /> RETURN TO REPOSITORY
        </button>
        <div>
          <h1 style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", fontFamily: "Syne, sans-serif", color: "var(--text-primary)", marginBottom: "16px" }}>
            Upload Schema
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "600px", lineHeight: 1.6 }}>
            Initialize structural frameworks by uploading source documents. 
            Supported format for schema extraction: DOCX.
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "32px", marginBottom: "80px" }}>
        {/* Left: Drag-and-Drop */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          style={{
            border: `1px dashed ${dragActive ? "var(--accent-primary)" : "var(--border-strong)"}`,
            backgroundColor: dragActive
              ? "rgba(204, 255, 0, 0.05)"
              : "var(--bg-surface)",
            borderRadius: "12px",
            minHeight: "480px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: dragActive ? "0 0 40px rgba(204, 255, 0, 0.1)" : "none",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
            <div style={{ 
              width: "80px", 
              height: "80px", 
              background: "var(--bg-elevated)", 
              border: "1px solid var(--border-subtle)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: dragActive ? "var(--accent-primary)" : "var(--text-primary)",
              transition: "color 0.3s ease",
              boxShadow: dragActive ? "0 0 20px rgba(204, 255, 0, 0.2)" : "none"
            }}>
              <IconCloudUpload size={40} stroke={1.5} />
            </div>
            
            <div style={{ textAlign: "center" }}>
              {selectedFile ? (
                <>
                  <h3 style={{ fontSize: "24px", fontFamily: "Syne, sans-serif", color: "var(--accent-primary)", marginBottom: "8px" }}>
                    File Selected
                  </h3>
                  <p style={{ color: "var(--text-primary)", fontWeight: 500, fontSize: "16px", fontFamily: "Outfit, sans-serif" }}>
                    {selectedFile.name}
                  </p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "4px" }}>
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </p>
                </>
              ) : (
                <>
                  <h3 style={{ fontSize: "24px", fontFamily: "Syne, sans-serif", color: "var(--text-primary)", marginBottom: "8px" }}>
                    Drag & Drop Files
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                    or <span style={{ color: "var(--accent-primary)", cursor: "pointer", borderBottom: "1px solid var(--accent-primary)" }}>browse file system</span>
                  </p>
                </>
              )}
            </div>
            
            <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
              {[
                { icon: <IconFileTypePdf size={16} />, label: "PDF" },
                { icon: <IconFileTypeDocx size={16} />, label: "DOCX" },
                { icon: <IconFileTypeTxt size={16} />, label: "TXT" }
              ].map(t => (
                <div key={t.label} style={{
                  padding: "8px 16px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--text-secondary)"
                }}>
                  {t.icon}
                  <span style={{ fontSize: "11px", letterSpacing: "1px" }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Config Panel */}
        <div style={{
          opacity: selectedFile ? 1 : 0.4,
          filter: selectedFile ? "none" : "grayscale(100%)",
          pointerEvents: selectedFile ? "auto" : "none",
          transition: "all 0.5s ease",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          padding: "40px",
          borderRadius: "12px"
        }}>
          <div>
            <div style={{ color: "var(--accent-primary)", fontSize: "10px", fontWeight: 700, letterSpacing: "2px", marginBottom: "8px", textTransform: "uppercase" }}>
              Parameters
            </div>
            <h3 style={{ fontSize: "24px", fontFamily: "Syne, sans-serif" }}>Configuration</h3>
          </div>

          {/* Category */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)" }}>
              Schema Domain
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {["Legal", "HR", "Finance", "Other"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "16px",
                    background: activeCategory === cat ? "var(--bg-elevated)" : "transparent",
                    border: `1px solid ${activeCategory === cat ? "var(--accent-primary)" : "var(--border-strong)"}`,
                    color: activeCategory === cat ? "var(--accent-primary)" : "var(--text-primary)",
                    fontSize: "14px",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <span>{cat}</span>
                  {activeCategory === cat && <IconCheck size={16} />}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)" }}>
              Access Level
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { name: "Private", desc: "Restricted to creator", icon: <IconLock size={18} /> },
                { name: "Team", desc: "Shared within workspace", icon: <IconUsers size={18} /> },
                { name: "Public", desc: "Global repository access", icon: <IconWorld size={18} /> },
              ].map((priv) => {
                const isActive = activePrivacy === priv.name;
                return (
                  <div
                    key={priv.name}
                    onClick={() => setActivePrivacy(priv.name)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "16px",
                      background: isActive ? "var(--bg-elevated)" : "transparent",
                      border: `1px solid ${isActive ? "var(--accent-primary)" : "var(--border-strong)"}`,
                      gap: "16px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      color: isActive ? "var(--accent-primary)" : "var(--text-secondary)"
                    }}
                  >
                    {priv.icon}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 500, color: isActive ? "var(--accent-primary)" : "var(--text-primary)" }}>
                        {priv.name}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{priv.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={handleProcessTemplate} disabled={processing} className="btn-primary" style={{ marginTop: "auto", justifyContent: "center", padding: "16px", opacity: processing ? 0.6 : 1 }}>
            {processing ? "EXTRACTING SCHEMA..." : "INITIALIZE SCHEMA"}
          </button>
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ef4444", fontSize: "13px", marginTop: "4px" }}>
              <IconAlertCircle size={16} /> {error}
            </div>
          )}
        </div>
      </div>

      {/* Recent Uploads Table */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ color: "var(--accent-primary)", fontSize: "10px", fontWeight: 700, letterSpacing: "2px", marginBottom: "8px", textTransform: "uppercase" }}>
              History
            </div>
            <h3 style={{ fontSize: "24px", fontFamily: "Syne, sans-serif" }}>Recent Ingestions</h3>
          </div>
          <button
            onClick={() => navigate("/templates")}
            className="btn-outline"
            style={{ padding: "8px 16px", fontSize: "12px" }}
          >
            VIEW ALL <IconArrowRight size={14} />
          </button>
        </div>

        <div style={{ 
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "8px",
          overflow: "hidden"
        }}>
          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-strong)" }}>
                <th style={{ padding: "16px 24px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Identifier</th>
                <th style={{ padding: "16px 24px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Domain</th>
                <th style={{ padding: "16px 24px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", color: "var(--text-secondary)", textTransform: "uppercase" }}>State</th>
                <th style={{ padding: "16px 24px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", color: "var(--text-secondary)", textTransform: "uppercase" }}>Timestamp</th>
                <th style={{ padding: "16px 24px" }} />
              </tr>
            </thead>
            <tbody>
              {recentUploads.map((file) => (
                <tr key={file.id} style={{ borderBottom: "1px solid var(--border-strong)", transition: "background 0.2s ease" }} className="hover-highlight">
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      {file.icon}
                      <span style={{ fontSize: "14px", color: "var(--text-primary)" }}>{file.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <span style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-secondary)", border: "1px solid var(--border-strong)", padding: "4px 8px" }}>
                      {file.category}
                    </span>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {file.status === "Processing..." ? (
                        <>
                          <div className="skeleton" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-primary)" }} />
                          <span style={{ fontSize: "12px", color: "var(--accent-primary)" }}>PROCESSING</span>
                        </>
                      ) : file.status === "Success" ? (
                        <>
                          <IconCheck size={16} color="#22c55e" />
                          <span style={{ fontSize: "12px", color: "#22c55e" }}>SUCCESS</span>
                        </>
                      ) : (
                        <>
                          <IconAlertCircle size={16} color="#ef4444" />
                          <span style={{ fontSize: "12px", color: "#ef4444" }}>CORRUPTED</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px", fontSize: "12px", color: "var(--text-secondary)", fontFamily: "Outfit, sans-serif" }}>
                    {file.uploadedTime}
                  </td>
                  <td style={{ padding: "20px 24px", textAlign: "right" }}>
                    <button style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                      <IconDotsVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
