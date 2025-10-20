import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-purple-400 via-pink-400 via-blue-400 via-cyan-400 to-indigo-400">
      {/* admin sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* admin header */}
        <AdminHeader setOpen={setOpenSidebar} />
        <main className="flex-1 flex-col flex p-4 md:p-6 bg-gradient-to-br from-white/95 via-purple-100/90 via-pink-100/80 via-blue-100/80 to-cyan-100/90 backdrop-blur-sm rounded-tl-3xl shadow-2xl border-2 border-gradient-to-r from-purple-300 via-pink-300 to-blue-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
