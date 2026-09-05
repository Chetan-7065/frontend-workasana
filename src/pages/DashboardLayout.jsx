import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Your fixed sidebar component

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar /> 

      <main className="main-content" style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
      <style>{`
        @media (max-width: 767.98px) {
          .main-content {
            padding-top: 80px !important; 
          }
        }
      `}</style>
        <Outlet /> 
      </main>

    </div>
  );
};