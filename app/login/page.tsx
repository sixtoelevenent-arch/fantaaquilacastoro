"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function login() {

  // ADMIN
  if (
    username === "admin" &&
    password === "Aquila2026!"
  ) {
    localStorage.setItem(
      "fantasy_admin",
      "true"
    );

    router.push("/admin");
    return;
  }

  const { data: user } = await supabase
    .from("fantasy_users")
    .select("*")
    .eq("username", username)
    .single();

  if (!user) {
    alert("Utente non trovato");
    return;
  }

  if (user.password !== password) {
    alert("Password errata");
    return;
  }

  localStorage.setItem(
    "fantasy_user",
    JSON.stringify(user)
  );

  if (user.must_change_password) {
    router.push("/change-password");
    return;
  }

  router.push("/formazioni");
}

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#020617",
        padding: "20px"
      }}
    >
      <div
  style={{
    width: "100%",
    maxWidth: 420,
    background: "#111827",
    padding: 28,
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.1)",
    textAlign: "center",
  }}
>
        <img
  src="/logo.png"
  alt="FantAquilaCastoro"
  style={{
    width: 90,
    height: 90,
    marginBottom: 16,
  }}
/>

<h1
  style={{
    margin: 0,
    fontSize: "1.8rem",
    fontWeight: 900,
  }}
>
  FantAquilaCastoro 2026
</h1>

<div
  style={{
    color: "#94a3b8",
    marginTop: 6,
    marginBottom: 24,
  }}
>
  Fantasy World Cup Edition
</div>
        <h1>Login</h1>

        <input
  placeholder="Username"
  value={username}
  onChange={(e) =>
    setUsername(e.target.value)
  }
  style={{
    width: "100%",
    padding: 14,
    marginBottom: 12,
    background: "#0f172a",
    border:
      "1px solid rgba(255,255,255,.15)",
    borderRadius: 12,
    color: "white",
    fontSize: "1rem",
    boxSizing: "border-box",
  }}
/>

        <input
  type={showPassword ? "text" : "password"}
  placeholder="Password"
  value={password}
  onChange={(e) =>
    setPassword(e.target.value)
  }
  style={{
    width: "100%",
    padding: 14,
    marginBottom: 12,
    background: "#0f172a",
    border:
      "1px solid rgba(255,255,255,.15)",
    borderRadius: 12,
    color: "white",
    fontSize: "1rem",
    boxSizing: "border-box",
  }}
/>

        <label
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
    color: "#cbd5e1",
    fontSize: "0.95rem",
  }}
>
  <input
    type="checkbox"
    checked={showPassword}
    onChange={(e) =>
      setShowPassword(e.target.checked)
    }
  />

  Mostra password
</label>

        <button
  onClick={login}
  style={{
    width: "100%",
    padding: 16,
    border: "none",
    borderRadius: 12,
    background:
      "linear-gradient(135deg,#16a34a,#22c55e)",
    color: "white",
    fontWeight: 900,
    fontSize: "1rem",
    cursor: "pointer",
  }}
>
  ACCEDI
</button>
        
      </div>
    </main>
  );
}