import type { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const layoutStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  };

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    padding: "2rem",
  };

  return (
    <div style={layoutStyle}>
      <Navbar />
      <main style={mainContentStyle}>{children}</main>
    </div>
  );
};

export default Layout;
