import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#0B0D10] text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className="min-h-screen lg:ml-64">
        <Header onMenuClick={openSidebar} />

        <div className="p-4 sm:p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
