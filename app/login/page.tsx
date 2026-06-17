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
      }}
    >
      <div
        style={{
          width: 350,
          background: "#111827",
          padding: 24,
          borderRadius: 12,
        }}
      >
        <h1>Login</h1>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
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
            padding: 12,
            marginBottom: 12,
          }}
        />

        <label
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
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
            padding: 12,
            cursor: "pointer",
          }}
        >
          Accedi
        </button>
      </div>
    </main>
  );
}