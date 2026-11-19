import { useState } from "react";
import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Cpu,
  BarChart3,
  Bell,
  PanelLeftClose,
  User,
  Sun,
  type LucideIcon,
  UsersIcon,
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
    icon: UsersIcon,
    allowedRoles: ["Admin"],
  },
  {
    path: "/dashboard/devices",
    label: "Devices",
    icon: Cpu,
    allowedRoles: ["Admin"],
  },
  // {
  //   path: "/dashboard/reports",
  //   label: "Reports",
  //   icon: ClipboardList,
  //   allowedRoles: ["Admin"],
  // },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const user = useAuthStore((state) => state.user);

  const visibleNavItems = navItems.filter((item) => {
    if (!item.allowedRoles) return true;
    return user ? item.allowedRoles.includes(user.role) : false;
  });

  return (
    <aside
      className={`shrink-0 bg-secondary text-accent flex flex-col p-3 transition-all duration-300 ${
        open ? "w-48" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between mb-7 px-1 pt-1">
          <button
          onClick={() => setOpen(!open)}
          aria-label="Expand sidebar"
          className=" flex items-center gap-2.5 text-left cursor-pointer"       
          >
            <span className="p-1.5 rounded-xl text-amber-300 shrink-0">
            <Sun size={18} />
          </span>
          {open && (
            <span className="font-bold text-base tracking-wide text-green-50">
              KiloWattz
            </span>
          )}
          </button>
        { open &&
          <button
            onClick={() => setOpen(!open)}
            aria-label="Collapse sidebar"
            className="p-2 rounded-lg hover:bg-zinc-800/10 mx-auto"       
            >
            {open && <PanelLeftClose size={16} /> }
          </button>
        }
      </div>

      <nav className="flex flex-col gap-1">
        {visibleNavItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            title={!open ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition-colors ${
                open ? "" : "justify-center"
              } ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:bg-emerald-600 hover:text-slate-200"
              }`}
          >
            <Icon size={20} className="shrink-0" />
            {open && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
