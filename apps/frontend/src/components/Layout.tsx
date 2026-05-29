import type { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ flex: 1, padding: "4rem 2rem", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
