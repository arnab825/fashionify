import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className={`flex min-h-screen w-full bg-muted/40 text-foreground font-sans`}>
      {/* admin sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* admin header */}
        <AdminHeader setOpen={setOpenSidebar} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <main className="flex-1 flex-col flex p-6 md:p-8">
          <div className="w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
