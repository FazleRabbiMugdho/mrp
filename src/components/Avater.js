import React from "react";
import profilePic from "../assets/profile.jpg"; 

export default function Brand({ collapsed }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: collapsed ? 14 : 22,
        paddingBottom: collapsed ? 10 : 6,
      }}
    >
      <div
        style={{
          width: collapsed ? 56 : 86,
          height: collapsed ? 56 : 86,
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          border: "2px solid rgba(255,255,255,0.4)",
          transition: "all 0.3s ease",
        }}
      >
        <img
          src={profilePic}
          alt="Profile"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {!collapsed && (
        <>
          <h3
            style={{
              color: "#fff",
              margin: "12px 0 2px",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            Welcome, IvKale
          </h3>
          <div
            style={{
              color: "#a5b4fc",
              fontWeight: 600,
              letterSpacing: 0.6,
              fontSize: 13,
            }}
          >
            mrp
          </div>
        </>
      )}
    </div>
  );
}
