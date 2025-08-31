import React from "react";
import { Menu, message } from "antd";
import {
  DashboardOutlined,
  TranslationOutlined,
  TeamOutlined,
  CreditCardOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/sidebar.css";

const items = [
  { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/new-transaction", icon: <TranslationOutlined />, label: "New Transaction", disabled: false },
  { key: "/my-translators", icon: <TeamOutlined />, label: "My Translators", disabled: true },
  { key: "/billing", icon: <CreditCardOutlined />, label: "Billing & Payment", disabled: true },
  { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
  { key: "logout", icon: <LogoutOutlined />, label: "Log Out", disabled: false },
];

export default function AppSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    message.success("Logged out successfully");
    navigate("/login", { replace: true });
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleMenuClick = (key) => {
    if (key === "logout") {
      handleLogout();
    } else {
      const item = items.find((i) => i.key === key);
      if (item && !item.disabled) navigate(key);
    }
  };

  return (
    <div style={{ paddingTop: 8 }}>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        style={{
          background: "transparent",
          borderInlineEnd: "none",
          padding: "12px 6px",
          fontSize: 15,
          fontWeight: 500,
          position: "relative",
        }}
        onClick={(e) => handleMenuClick(e.key)}
      >
        {items.map((item) => (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            disabled={item.disabled}
            style={{ position: "relative", overflow: "hidden" }}
          >
            {pathname === item.key && (
              <motion.div
                layoutId="activeBackground"
                className="active-bg"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
              />
            )}
            <span className="menu-label">{item.label}</span>
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
}