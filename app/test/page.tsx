"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    alert("TEST EFFECT");
    setLoading(false);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: 20,
      }}
    >
      {loading ? "LOADING" : "OK"}
    </div>
  );
}