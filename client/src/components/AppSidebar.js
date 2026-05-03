import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiGrid,
  FiPlusSquare,
  FiList,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useUser } from "../state/UserProvider";

const items = [
  { key: "/dashboard", icon: FiGrid, label: "Dashboard" },
  { key: "/new-transaction", icon: FiPlusSquare, label: "New Transaction" },
  { key: "/transactions", icon: FiList, label: "My Transactions" },
  { key: "/settings", icon: FiSettings, label: "Settings" },
];

export default function AppSidebar({ collapsed }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="px-3 py-6 flex flex-col gap-2">
      {items.map((item) => {
        const isActive = pathname === item.key;
        return (
          <Link
            key={item.key}
            to={item.key}
            className={`relative flex items-center gap-4 rounded-[20px] px-4 py-3 transition-all duration-300 ${
              isActive ? "text-emerald-600 dark:text-emerald-300" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
            } ${collapsed ? "justify-center px-0" : "justify-start"}`}
          >
            {isActive && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute inset-0 rounded-[20px] bg-emerald-100 dark:bg-emerald-400/10 border border-emerald-200 dark:border-emerald-300/20 shadow-sm dark:shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <item.icon className={`relative z-10 text-xl flex-shrink-0 transition-all duration-300 ${isActive ? "text-emerald-600 dark:text-emerald-300 dark:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" : ""}`} />
            {!collapsed && (
              <span className="relative z-10 text-[13px] font-bold tracking-wide whitespace-nowrap">
                {item.label}
              </span>
            )}
          </Link>
        );
      })}

      <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

      <button
        onClick={handleLogout}
        className={`relative flex items-center gap-4 rounded-[20px] border border-transparent px-4 py-3 transition-all duration-300 text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-300 hover:border-rose-200 dark:hover:border-rose-400/20 w-full focus-visible:outline-none ${collapsed ? "justify-center px-0" : "justify-start"}`}
      >
        <FiLogOut className="relative z-10 text-xl flex-shrink-0" />
        {!collapsed && (
          <span className="relative z-10 text-[13px] font-bold tracking-wide whitespace-nowrap">
            Log Out
          </span>
        )}
      </button>
    </div>
  );
}
