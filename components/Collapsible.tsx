"use client";

import { useState } from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export default function Collapsible({
  title,
  children,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ marginTop: 16 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "10px 14px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.05)",
          color: "white",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        {title} {open ? "▲" : "▼"}
      </button>

      {open && (
        <div
          style={{
            marginTop: 10,
            padding: 0,
            borderRadius: 12,
            background: "rgba(255,255,255,0.04)",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}