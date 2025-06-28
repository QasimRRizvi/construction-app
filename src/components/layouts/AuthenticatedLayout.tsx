import { User2 } from "lucide-react";
import { useCallback, useMemo, type ReactNode } from "react";
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);
  const currentRouteDetails = useMemo(() => SidebarLinks.find(route => location.pathname === route.path), [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-slate-800 to-slate-950 bg-slate-900 text-white flex flex-col">
        <h2 className="text-2xl font-bold border-b border-gray-100 mb-2 p-4">🏗️ Construction</h2>
        <nav className="flex flex-col space-y-1 text-sm p-4">
          {SidebarLinks.map(({ label, path, icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`text-left px-3 py-2 font-bold rounded-md transition backdrop-blur-sm shadow-xl ${isActive(path)
                ? "bg-slate-500/50 text-white font-semibold"
                : "text-gray-300 bg-white/10 border border-white/20 "
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-700">{currentRouteDetails?.heading}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-gray-600">
              <User2 className="w-5 h-5" />
              <span className="text-sm ml-2">{user?.name}</span>
            </div>
            <Button size="sm" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        {/* Page Body */}
        <div className=" overflow-auto flex-1">{children}</div>
      </main>
    </div>
  );
};

export default AuthenticatedLayout;