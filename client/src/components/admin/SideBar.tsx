import { useState } from "react";
import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Cpu,
  BarChart3,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  Sun,
} from "lucide-react";

export default function Sidebar() {

    const [open, setOpen] = useState(true);
  const navItems = [
  { path: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { path: "/admin/devices", label: "Devices", icon: Cpu },
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/admin/alertlist", label: "Alerts", icon: Bell },
  { path: "/admin/sites", label: "Solar-sites", icon: Zap},
  ]
  return (
    <aside
      className={`shrink-0 bg-primary text-green-100 flex flex-col p-3 transition-all duration-300 ${
        open ? "w-40" : "w-15"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <Sun className="flex items-center"/>
        {open && <span className="font-bold text-sm pl-2">KiloWattz</span>}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          className="p-2 rounded-lg hover:bg-green-400 mx-auto"
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
              } ${isActive ? "bg-green-400" : "hover:bg-zinc-900/70"}`
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