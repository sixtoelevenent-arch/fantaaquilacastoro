"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const raw =
      localStorage.getItem("fantasy_user");

    if (!raw) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(raw));
  }, [router]);

  async function savePassword() {
    if (!user) return;

    if (password1.length < 4) {
      alert(
        "La password deve contenere almeno 4 caratteri"
      );
      return;
    }

    if (password1 !== password2) {
      alert("Le password non coincidono");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("fantasy_users")
      .update({
        password: password1,
        must_change_password: false,
      })
      .eq("id", user.id);

    if (error) {
      alert("Errore durante il salvataggio");
      setSaving(false);
      return;
    }

    const updatedUser = {
      ...user,
      password: password1,
      must_change_password: false,
    };

    localStorage.setItem(
      "fantasy_user",
      JSON.stringify(updatedUser)
    );

    alert("Password aggiornata");

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
          width: 380,
          background: "#111827",
          padding: 24,
          borderRadius: 12,
        }}
      >
        <h1>Cambia Password</h1>

        <p>
          Devi scegliere una nuova password
          prima di continuare.
        </p>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Nuova password"
          value={password1}
          onChange={(e) =>
            setPassword1(e.target.value)
          }
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
          }}
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Ripeti password"
          value={password2}
          onChange={(e) =>
            setPassword2(e.target.value)
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
          onClick={savePassword}
          disabled={saving}
          style={{
            width: "100%",
            padding: 12,
            cursor: "pointer",
          }}
        >
          {saving
            ? "Salvataggio..."
            : "Salva Password"}
        </button>
      </div>
    </main>
  );
}