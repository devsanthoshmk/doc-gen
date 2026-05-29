import { Link } from "react-router-dom";

const Navbar = () => {
  const navbarStyle: React.CSSProperties = {
    background: "var(--glass-bg)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--border-subtle)",
    padding: "0 40px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  };

  const logoStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: 800,
    color: "var(--text-primary)",
    textDecoration: "none",
    letterSpacing: "-0.04em",
    fontFamily: "Syne, sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const navLinksContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "40px",
    alignItems: "center",
  };

  const linkStyle: React.CSSProperties = {
    color: "var(--text-secondary)",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    transition: "all 0.3s ease",
    cursor: "pointer",
    fontFamily: "Outfit, sans-serif",
  };

  const linkHoverStyle: React.CSSProperties = {
    color: "var(--accent-primary)",
  };

  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    Object.assign(e.currentTarget.style, linkHoverStyle);
  };

  const handleLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = "var(--text-secondary)";
  };

  return (
    <nav style={navbarStyle}>
      <Link to="/" style={logoStyle}>
        <div style={{ width: "12px", height: "12px", background: "var(--accent-primary)" }}></div>
        MERGEX
      </Link>
      <div style={navLinksContainerStyle}>
        <Link
          to="/"
          style={linkStyle}
          onMouseEnter={handleLinkHover}
          onMouseLeave={handleLinkLeave}
        >
          Home
        </Link>
        <Link
          to="/history"
          style={linkStyle}
          onMouseEnter={handleLinkHover}
          onMouseLeave={handleLinkLeave}
        >
          Documents
        </Link>
        <Link
          to="/templates/editor"
          style={linkStyle}
          onMouseEnter={handleLinkHover}
          onMouseLeave={handleLinkLeave}
        >
          Editor
        </Link>
        <Link
          to="/templates"
          style={linkStyle}
          onMouseEnter={handleLinkHover}
          onMouseLeave={handleLinkLeave}
        >
          Library
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
