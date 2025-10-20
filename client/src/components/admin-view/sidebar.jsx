import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex cursor-pointer text-xl items-center gap-3 rounded-xl px-4 py-3 text-white hover:text-yellow-300 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 border border-white/20"
        >
          <div className="text-yellow-300 group-hover:text-white">
            {menuItem.icon}
          </div>
          <span className="font-medium">{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-gradient-to-b from-slate-50 to-indigo-50 border-r-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b border-slate-200 pb-6">
              <SheetTitle className="flex gap-3 mt-5 mb-5">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <ChartNoAxesCombined size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Admin Panel
                  </h1>
                  <p className="text-sm text-slate-500">Management Dashboard</p>
                </div>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-72 flex-col bg-gradient-to-b from-purple-600 via-pink-600 via-blue-600 via-cyan-600 to-indigo-600 p-8 lg:flex shadow-2xl border-r-4 border-purple-700">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-3 mb-8 pb-6 border-b-2 border-white/30"
        >
          <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg">
            <ChartNoAxesCombined size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-sm text-white/80">Management Dashboard</p>
          </div>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
