import { useState } from "react";
import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Cpu,
  BarChart3,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  UserGroup,
  ClipboardList,
  Sun,
  type LucideIcon
} from "lucide-react";
import { useAuthStore, type UserRole } from "../../storage/useAuthStorage";

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  allowedRoles?: UserRole[]; // If omitted, all authenticated roles can see it
}

const navItems: NavItem[] = [
  {
    path: "/dashboard/overview",
    label: "Overview",
    icon: LayoutDashboard
  },
  { 
    path: "/dashboard/profile", 
    label: "Profile", 
    icon: User 
  },
  {
    path: "/dashboard/analytics",
    label: "Analytics",
    icon: BarChart3
  },
  {
    path: "/dashboard/alerts",
    label: "Alerts",
    icon: Bell,
  },
  {
    path: "/dashboard/users",
    label: "Users",
    icon: UserGroup,
    allowedRoles: ["Admin"],
  },
  {
    path: "/dashboard/devices",
    label: "Devices",
    icon: Cpu,
    allowedRoles: ["Admin"],
  },
  {
    path: "/dashboard/reports",
    label: "Reports",
    icon: ClipboardList,
    allowedRoles: ["Admin"],
  },

];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const user = useAuthStore((state) => state.user);

  // Filter navigation items based on the active user's role
  const visibleNavItems = navItems.filter((item) => {
    if (!item.allowedRoles) return true;
    return user ? item.allowedRoles.includes(user.role ) : false;
  });

  return (
    <aside
      className={`shrink-0 bg-slate-900 text-slate-100 flex flex-col p-3 transition-all duration-300 border-r border-slate-800 ${
        open ? "w-48" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2">
          <Sun className="text-emerald-400 shrink-0" size={24} />
          {open && <span className="font-bold text-sm tracking-wide">KiloWattz</span>}
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
        >
          {open ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        {visibleNavItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/dashboard"}
            title={!open ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition-colors ${
                open ? "" : "justify-center"
              } ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`
            }
          >
            <Icon size={20} className="shrink-0" />
            {open && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}