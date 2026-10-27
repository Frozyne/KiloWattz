import { useState } from "react";
import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Cpu,
  BarChart3,
  Bell,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
} from "lucide-react";

const navItems = [
  { path: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { path: "/admin/devices", label: "Devices", icon: Cpu },
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/admin/alertlist", label: "Alerts", icon: Bell },
  { path: "/admin/sites", label: "Solar-sites", icon: Zap},
  { path: "admin/setting", label: "Setting", icon: Settings },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`h-screen shrink-0 bg-gray-500 text-white flex flex-col p-3 transition-all duration-300 ${
        open ? "w-60" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        {open && <span className="font-bold text-lg pl-2">KiloWattz</span>}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          className="p-2 rounded-lg hover:bg-gray-300 mx-auto"
        >
          {open ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            title={!open ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${
                open ? "" : "justify-center"
              } ${isActive ? "bg-gray-600" : "hover:bg-gray-300"}`
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