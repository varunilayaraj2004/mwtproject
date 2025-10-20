import { AlignJustify, LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { Avatar, AvatarFallback } from "../ui/avatar";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-lg">
      <Button
        onClick={() => setOpen(true)}
        className="lg:hidden sm:block bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-indigo-200">
            <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold">
              {user?.userName?.[0]?.toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">{user?.userName || 'Admin'}</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>

        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-xl px-6 py-2 text-sm font-medium bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
