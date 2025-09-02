import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import Brand from "../components/Avater";
import { motion } from "framer-motion";

const { Content, Sider } = Layout;

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <Layout style={{ minHeight: "100vh", background: "transparent" }}>
      <Sider
        trigger={null} 
        collapsible
        collapsed={collapsed}
        width={220}
        style={{
          background: "linear-gradient(180deg, #1677ff, #1d4ed8)", 
        }}
      >
        <Brand collapsed={collapsed} />
        <AppSidebar />

        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: collapsed ? 8 : 170, 
            transition: "all 0.3s ease",
            zIndex: 10,
          }}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: 36, 
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: "#fff",
              boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition:
                "transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f1f5f9";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
                fontSize: 18,
                color: "#1677ff",
                fontWeight: 700,
              }}
            >
              ❮
            </span>
          </button>
        </div>
      </Sider>

      <Layout style={{ background: "transparent" }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ padding: 28 }}
        >
          <Content
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.98), #ffffff)",
              borderRadius: 22,
              boxShadow:
                "0 16px 40px rgba(16,24,40,0.06), 0 6px 16px rgba(2,6,23,0.04)",
              minHeight: "calc(100vh - 56px)",
              padding: 28,
            }}
          >
            <Outlet />
          </Content>
        </motion.div>
      </Layout>
    </Layout>
  );
}