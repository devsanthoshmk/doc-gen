import { Link } from "react-router-dom";

const Navbar = () => {
  const navbarStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
    padding: "0 40px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  };

  const logoStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: 700,
    color: "#5d3fd3",
    textDecoration: "none",
    letterSpacing: "0.5px",
    fontFamily: "Playfair Display, serif",
  };

  const navLinksContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "32px",
    alignItems: "center",
  };

  const linkStyle: React.CSSProperties = {
    color: "#374151",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    transition: "color 0.3s ease",
    cursor: "pointer",
    fontFamily: "DM Sans, sans-serif",
  };

  const linkHoverStyle: React.CSSProperties = {
    color: "#5d3fd3",
  };

  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    Object.assign(e.currentTarget.style, linkHoverStyle);
  };

  const handleLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = "#333333";
  };

  return (
    <nav style={navbarStyle}>
      <Link to="/" style={logoStyle}>
        Mergex
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
