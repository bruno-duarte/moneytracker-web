/**
 * Componente Sidebar - Navegação lateral do sistema
 */
import { Link, useLocation } from "react-router-dom";
import { Home, Users, FolderOpen, CreditCard, BarChart3 } from "lucide-react";
import { ROUTES } from "@/utils/constants";

const menuItems = [
  { icon: Home, label: "Dashboard", path: ROUTES.DASHBOARD },
  { icon: Users, label: "Pessoas", path: ROUTES.PEOPLE },
  { icon: FolderOpen, label: "Categorias", path: ROUTES.CATEGORIES },
  { icon: CreditCard, label: "Transações", path: ROUTES.TRANSACTIONS },
  { icon: BarChart3, label: "Relatórios", path: ROUTES.REPORTS },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">MoneyTracker</h1>
      </div>

      <nav className="px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
