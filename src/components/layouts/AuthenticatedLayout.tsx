import { Menu, X, User2, LogOut } from "lucide-react";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { SidebarLinks } from "../../constants/sidebar";

interface Props {
  children: ReactNode;
}

const AuthenticatedLayout = ({ children }: Props) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const currentRouteDetails = useMemo(
    () => SidebarLinks.find((route) => location.pathname === route.path),
    [location.pathname]
  );

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <aside
        className={`
          fixed z-40 inset-y-0 left-0 transform lg:relative lg:translate-x-0 transition-transform duration-300
          w-64 bg-gradient-to-br from-slate-800 to-slate-950 text-white flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-white/20">
          <h2 className="text-xl lg:text-2xl font-bold">🏗️ Construction</h2>
          <X className="w-5 h-5 lg:hidden text-white" onClick={() => setSidebarOpen(false)} />
        </div>

        <nav className="flex flex-col space-y-1 text-sm p-4">
          {SidebarLinks.map(({ label, path, icon }) => (
            <button
              key={path}
              onClick={() => {
                navigate(path);
                setSidebarOpen(false);
              }}
              className={`text-left px-3 py-2 font-bold rounded-md transition backdrop-blur-sm shadow-xl ${isActive(path)
                ? "bg-slate-500/50 text-white font-semibold"
                : "text-gray-300 bg-white/10 border border-white/20"
                }`}
            >
              <span className="mr-2">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto text-xs text-gray-400 pt-6 border-t border-slate-700 p-4 text-center">
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Menu className="w-6 h-6 lg:hidden text-gray-700" onClick={() => setSidebarOpen(true)} />
            <h1 className="text-xl lg:text-2xl font-bold text-gray-700">
              {currentRouteDetails?.heading}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-gray-600">
              <User2 className="w-5 h-5" />
              <span className="text-sm ml-2">{user?.name}</span>
            </div>
            <Button size="sm" variant="outlined" color="error" onClick={handleLogout}>
              <span className="mr-2 hidden lg:inline-block">Logout</span>
              <LogOut className="w-3 h-3" />
            </Button>
          </div>
        </header>

        {/* Page Body */}
        <div className="overflow-auto flex-1">{children}</div>
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
