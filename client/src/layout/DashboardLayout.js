import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import Brand from "../components/Avater";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../state/UserProvider";
import { useTheme } from "../state/ThemeProvider";
import { FiSun, FiMoon } from "react-icons/fi";

const { Content, Sider } = Layout;

function DashboardSkeleton() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f4f7f6] dark:bg-gradient-to-br dark:from-[#0B1A13] dark:via-[#050D0A] dark:to-black px-4 py-6 text-slate-800 dark:text-white sm:px-6 lg:px-8 lg:py-8 transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0 hidden dark:block bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_26%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 animate-pulse mt-10">
        <div className="h-32 w-full rounded-[40px] border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-[20px] md:h-40 shadow-sm dark:shadow-none"></div>
        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="h-[350px] rounded-[36px] border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-[20px] md:h-[400px] shadow-sm dark:shadow-none"></div>
          <div className="grid gap-5">
            <div className="h-[180px] rounded-[36px] border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-[20px] shadow-sm dark:shadow-none"></div>
            <div className="h-[180px] rounded-[36px] border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-[20px] shadow-sm dark:shadow-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { loading: authLoading, user } = useUser();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const { theme, toggleTheme } = useTheme();

  React.useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 600);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (authLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: theme === 'dark' ? "linear-gradient(135deg, #0B1A13 0%, #050D0A 55%, #000000 100%)" : "#f4f7f6",
        transition: "background 0.3s ease",
      }}
    >
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        style={{
          background: theme === 'dark' ? "rgba(6, 13, 10, 0.78)" : "#ffffff",
          backdropFilter: "blur(20px)",
          borderRight: theme === 'dark' ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)",
          boxShadow: theme === 'dark' ? "16px 0 50px rgba(0,0,0,0.25)" : "16px 0 50px rgba(0,0,0,0.05)",
          position: "relative",
          zIndex: 50,
          transition: "all 0.3s ease",
        }}
      >
        <Brand collapsed={collapsed} user={user} />
        <AppSidebar collapsed={collapsed} />
        
        {/* Toggle Theme Button inside Sider */}
        <div style={{ position: "absolute", bottom: 80, left: 0, width: "100%", display: "flex", justifyContent: "center", zIndex: 10 }}>
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${theme === 'dark' ? 'bg-white/10 text-emerald-100 hover:bg-white/20 border border-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
          >
            {theme === 'dark' ? <><FiSun /> Light</> : <><FiMoon /> Dark</>}
          </button>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            transition: "all 0.3s ease",
            zIndex: 10,
          }}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 ${theme === 'dark' ? 'border-white/10 bg-white/5 text-emerald-100 hover:bg-white/10 focus-visible:ring-emerald-300/70' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-300/70'}`}
          >
            <span
              style={{
                display: "inline-block",
                transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              ❮
            </span>
          </button>
        </div>
      </Sider>

      <Layout style={{ background: "transparent", position: "relative", overflowX: "hidden" }}>
        <Content
          style={{
            background: "transparent",
            borderRadius: 0,
            boxShadow: "none",
            minHeight: "100vh",
            padding: 0,
            position: "relative"
          }}
        >
          <AnimatePresence mode="wait">
            {isNavigating ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(8px)" }}
                transition={{ duration: 0.3 }}
                style={{ width: "100%", height: "100%" }}
              >
                <DashboardSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{ width: "100%", height: "100%" }}
              >
                <Outlet />
              </motion.div>
            )}
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  );
}
