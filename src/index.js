import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import App from "./app/App";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#1677ff",
        borderRadius: 14,
        colorBgLayout: "#eef3f9",
        colorText: "#1f2937",
        fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      },
      algorithm: theme.defaultAlgorithm,
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ConfigProvider>
);
