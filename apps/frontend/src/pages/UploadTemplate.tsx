import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface UploadedFile {
  id: string;
  name: string;
  category: string;
  status: "Processing..." | "Success" | "Corrupted File";
  uploadedTime: string;
  icon: string;
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
      icon: "picture_as_pdf",
    },
    {
      id: "2",
      name: "Employee_Onboarding_V3.docx",
      category: "HR",
      status: "Success",
      uploadedTime: "5 hours ago",
      icon: "description",
    },
    {
      id: "3",
      name: "Q4_Financial_Notes_Raw.txt",
      category: "Finance",
      status: "Corrupted File",
      uploadedTime: "Yesterday",
      icon: "article",
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

  const handleProcessTemplate = () => {
    if (!selectedFile) return;

    // Create a new mock file record in "Processing" state
    const newFileId = Math.random().toString(36).substring(7);
    const newFileRecord: UploadedFile = {
      id: newFileId,
      name: selectedFile.name,
      category: activeCategory,
      status: "Processing...",
      uploadedTime: "Just now",
      icon: selectedFile.name.endsWith(".pdf")
        ? "picture_as_pdf"
        : selectedFile.name.endsWith(".docx")
        ? "description"
        : "article",
    };

    setRecentUploads([newFileRecord, ...recentUploads]);
    setSelectedFile(null); // Reset dropzone

    // Mock completing processing after 3.5 seconds
    setTimeout(() => {
      setRecentUploads((prev) =>
        prev.map((f) => (f.id === newFileId ? { ...f, status: "Success" } : f))
      );
    }, 3500);
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 48px 4rem 48px" }}>
      {/* Back to library & title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" }}>
        <button
          onClick={() => navigate("/templates")}
          style={{
            background: "none",
            border: "none",
            color: "#5d3fd3",
            fontFamily: "DM Sans",
            fontWeight: "700",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            padding: 0,
            width: "max-content",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
            arrow_back
          </span>
          Back to Template Library
        </button>
        <div>
          <h2
            className="font-playfair"
            style={{ fontSize: "3rem", fontWeight: "700", color: "#1a1c1b", marginBottom: "0.5rem" }}
          >
            Upload Template
          </h2>
          <p style={{ color: "#44474d", fontSize: "18px", fontFamily: "DM Sans" }}>
            Create high-performance AI-ready templates by uploading your source documents. Supported
            formats: .pdf, .docx, .txt
          </p>
        </div>
      </div>

      {/* Balanced layout Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2rem",
          marginBottom: "4rem",
        }}
        className="lg:grid-cols-12"
      >
        {/* Left: Upload Drag-and-Drop Canvas */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className="transition-soft"
          style={{
            gridColumn: "span 8",
            border: `2px dashed ${dragActive ? "#5d3fd3" : "rgba(10, 25, 47, 0.1)"}`,
            backgroundColor: dragActive
              ? "rgba(93, 63, 211, 0.05)"
              : selectedFile
              ? "rgba(93, 63, 211, 0.01)"
              : "rgba(93, 63, 211, 0.02)",
            borderRadius: "12px",
            minHeight: "440px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            cursor: "pointer",
            boxShadow: dragActive ? "0 4px 20px rgba(93, 63, 211, 0.1)" : "none",
            position: "relative",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#e6deff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.18s ease",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "#5d3fd3" }}>
                cloud_upload
              </span>
            </div>
            <div style={{ textAlign: "center" }}>
              {selectedFile ? (
                <>
                  <h3
                    className="font-playfair"
                    style={{ fontSize: "24px", color: "#0A192F", marginBottom: "6px" }}
                  >
                    File selected successfully
                  </h3>
                  <p style={{ color: "#5d3fd3", fontWeight: "700", fontSize: "15px" }}>
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </p>
                </>
              ) : (
                <>
                  <h3
                    className="font-playfair"
                    style={{ fontSize: "24px", color: "#0A192F", marginBottom: "6px" }}
                  >
                    Drag &amp; drop your files here
                  </h3>
                  <p style={{ color: "#44474d", fontSize: "14px" }}>
                    or <span style={{ color: "#5d3fd3", fontWeight: "700", textDecoration: "underline" }}>browse from your computer</span>
                  </p>
                </>
              )}
            </div>
            <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
              <div
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#eeeeec",
                  borderRadius: "8px",
                  border: "1px solid rgba(10, 25, 47, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#ba1a1a" }}>
                  picture_as_pdf
                </span>
                <span style={{ fontSize: "12px", fontFamily: "JetBrains Mono" }}>PDF</span>
              </div>
              <div
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#eeeeec",
                  borderRadius: "8px",
                  border: "1px solid rgba(10, 25, 47, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#5d3fd3" }}>
                  description
                </span>
                <span style={{ fontSize: "12px", fontFamily: "JetBrains Mono" }}>DOCX</span>
              </div>
              <div
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#eeeeec",
                  borderRadius: "8px",
                  border: "1px solid rgba(10, 25, 47, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#75777e" }}>
                  article
                </span>
                <span style={{ fontSize: "12px", fontFamily: "JetBrains Mono" }}>TXT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Side Configuration Panel */}
        <div
          style={{
            gridColumn: "span 4",
            opacity: selectedFile ? 1 : 0.4,
            filter: selectedFile ? "none" : "grayscale(80%)",
            pointerEvents: selectedFile ? "auto" : "none",
            transition: "all 0.5s ease",
          }}
        >
          <div
            className="sheet-shadow"
            style={{
              backgroundColor: "#eeeeec",
              border: "1px solid rgba(10, 25, 47, 0.1)",
              borderRadius: "12px",
              padding: "32px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            <h4 className="font-headline-md" style={{ fontSize: "18px", color: "#0A192F" }}>
              Configuration
            </h4>

            {/* Category selection */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#44474d",
                }}
              >
                Template Category
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {["Legal", "HR", "Finance", "Other"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: "12px",
                      borderRadius: "4px",
                      border: `1px solid ${activeCategory === cat ? "#5d3fd3" : "rgba(10, 25, 47, 0.1)"}`,
                      backgroundColor: activeCategory === cat ? "rgba(93, 63, 211, 0.05)" : "#ffffff",
                      fontFamily: "DM Sans",
                      fontSize: "14px",
                      fontWeight: activeCategory === cat ? "700" : "400",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                    }}
                  >
                    <span>{cat}</span>
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "16px",
                        color: "#5d3fd3",
                        opacity: activeCategory === cat ? 1 : 0,
                      }}
                    >
                      check_circle
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy settings */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#44474d",
                }}
              >
                Accessibility
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { name: "Private", desc: "Only you can view and use", icon: "lock" },
                  { name: "Team", desc: "Shared with workspace members", icon: "group" },
                  { name: "Public", desc: "Available for all Pro users", icon: "public" },
                ].map((priv) => {
                  const isActive = activePrivacy === priv.name;
                  return (
                    <div
                      key={priv.name}
                      onClick={() => setActivePrivacy(priv.name)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px",
                        borderRadius: "8px",
                        border: `1px solid ${isActive ? "#5d3fd3" : "rgba(10, 25, 47, 0.05)"}`,
                        backgroundColor: isActive ? "rgba(93, 63, 211, 0.05)" : "#ffffff",
                        gap: "16px",
                        cursor: "pointer",
                        opacity: isActive ? 1 : 0.7,
                        transition: "all 0.18s ease",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ color: isActive ? "#5d3fd3" : "#44474d" }}
                      >
                        {priv.icon}
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#0A192F",
                          }}
                        >
                          {priv.name}
                        </span>
                        <span style={{ fontSize: "11px", color: "#44474d" }}>{priv.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Process action button */}
            <div style={{ marginTop: "auto" }}>
              <button
                onClick={handleProcessTemplate}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#5d3fd3",
                  color: "#ffffff",
                  fontWeight: "700",
                  borderRadius: "4px",
                  border: "none",
                  boxShadow: "0 4px 14px rgba(93, 63, 211, 0.3)",
                  cursor: "pointer",
                }}
              >
                Process Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Uploads Table */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 className="font-headline-md" style={{ fontSize: "24px", color: "#0A192F" }}>
            Recent Uploads
          </h3>
          <button
            onClick={() => navigate("/templates")}
            style={{
              background: "none",
              border: "none",
              color: "#5d3fd3",
              fontFamily: "DM Sans",
              fontWeight: "700",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
            }}
          >
            <span>View all history</span>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              arrow_forward
            </span>
          </button>
        </div>

        <div
          className="sheet-shadow"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(10, 25, 47, 0.1)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#eeeeec", borderBottom: "1px solid rgba(10, 25, 47, 0.05)" }}>
                <th style={{ padding: "16px 24px", fontSize: "14px", color: "#44474d", fontWeight: "500" }}>
                  File Name
                </th>
                <th style={{ padding: "16px 24px", fontSize: "14px", color: "#44474d", fontWeight: "500" }}>
                  Category
                </th>
                <th style={{ padding: "16px 24px", fontSize: "14px", color: "#44474d", fontWeight: "500" }}>
                  Status
                </th>
                <th style={{ padding: "16px 24px", fontSize: "14px", color: "#44474d", fontWeight: "500" }}>
                  Uploaded
                </th>
                <th style={{ padding: "16px 24px" }} />
              </tr>
            </thead>
            <tbody>
              {recentUploads.map((file) => (
                <tr
                  key={file.id}
                  style={{
                    borderBottom: "1px solid rgba(10, 25, 47, 0.05)",
                    transition: "background-color 0.18s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f7")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span
                        className="material-symbols-outlined"
                        style={{
                          color:
                            file.icon === "picture_as_pdf"
                              ? "#ba1a1a"
                              : file.icon === "description"
                              ? "#5d3fd3"
                              : "#75777e",
                        }}
                      >
                        {file.icon}
                      </span>
                      <span style={{ fontWeight: "500", color: "#0A192F" }}>{file.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div
                      style={{
                        padding: "2px 8px",
                        backgroundColor: "#e6deff",
                        color: "#4723be",
                        border: "1px solid rgba(93, 63, 211, 0.1)",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontFamily: "JetBrains Mono",
                        display: "inline-block",
                        textTransform: "uppercase",
                      }}
                    >
                      {file.category}
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {file.status === "Processing..." ? (
                        <>
                          <span
                            className="w-2 h-2 rounded-full success-pulse"
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: "#5d3fd3",
                            }}
                          />
                          <span style={{ fontSize: "14px", fontWeight: "500", color: "#5d3fd3" }}>
                            {file.status}
                          </span>
                        </>
                      ) : file.status === "Success" ? (
                        <>
                          <span
                            className="material-symbols-outlined"
                            style={{ color: "#22c55e", fontSize: "18px" }}
                          >
                            check_circle
                          </span>
                          <span style={{ fontSize: "14px", fontWeight: "500", color: "#22c55e" }}>
                            Success
                          </span>
                        </>
                      ) : (
                        <>
                          <span
                            className="material-symbols-outlined"
                            style={{ color: "#ba1a1a", fontSize: "18px" }}
                          >
                            error
                          </span>
                          <span style={{ fontSize: "14px", fontWeight: "500", color: "#ba1a1a" }}>
                            Corrupted File
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px", color: "#44474d", fontSize: "14px" }}>
                    {file.uploadedTime}
                  </td>
                  <td style={{ padding: "20px 24px", textAlign: "right" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#75777e" }}>
                      <span className="material-symbols-outlined">more_vert</span>
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
