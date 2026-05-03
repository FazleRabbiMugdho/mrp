import React from "react";
import logo from "../assets/MRP logo.png";

export default function Brand({ collapsed, user }) {
  return (
    <div className={`flex flex-col items-center transition-all duration-300 ${collapsed ? "pt-6 pb-4" : "pt-8 pb-4"}`}>
      <div className={`relative overflow-hidden rounded-[24px] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-[20px] shadow-sm dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all duration-300 ${collapsed ? "h-12 w-12" : "h-20 w-20"}`}>
        <img
          src={logo}
          alt="MRP Logo"
          className="h-full w-full object-contain p-2 drop-shadow-md dark:drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        />
      </div>

      {!collapsed && (
        <div className="mt-4 flex flex-col items-center text-center px-4 w-full">
          <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-400/80">
            {user?.role || "Member"}
          </p>
          <h3 className="mt-1 text-base font-bold text-slate-800 dark:text-white tracking-wide truncate w-full">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400 truncate w-full">
            @{user?.username}
          </p>
        </div>
      )}
    </div>
  );
}
