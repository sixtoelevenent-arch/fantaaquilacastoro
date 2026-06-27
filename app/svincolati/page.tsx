"use client";

import { useEffect, useMemo, useState } from "react";

import BackHome from "@/components/BackHome";
import Card from "@/components/Card";

import { supabase } from "@/lib/supabase";

type FreeAgent = {
  id: number;
  player_name: string;
  display_name?: string | null;
  nazionale: string;
  ruolo: string;
  quotazione: number;
  disponibile: boolean;
};

type DisplayName = {
  fantapiu3_name: string;
  display_name: string;
};

export default function SvincolatiPage() {
  const [loading, setLoading] = useState(true);

  const [players, setPlayers] = useState<FreeAgent[]>([]);
  const [displayMap, setDisplayMap] =
  useState<Record<string, string>>({});

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tutti");
  const [nationFilter, setNationFilter] = useState("Tutte");
const [sortField, setSortField] = useState<
  "giocatore" | "nazionale" | "ruolo" | "quotazione"
>("giocatore");

const [sortDirection, setSortDirection] = useState<
  "asc" | "desc"
>("asc");

  useEffect(() => {
  loadData();
}, []);

function handleSort(
  field:
    | "giocatore"
    | "nazionale"
    | "ruolo"
    | "quotazione"
) {
  if (sortField === field) {
    setSortDirection((prev) =>
      prev === "asc" ? "desc" : "asc"
    );
  } else {
    setSortField(field);
    setSortDirection("asc");
  }
}

  async function loadData() {
  setLoading(true);

  const { data } = await supabase
  .from("free_agents")
  .select("*")
  .eq("disponibile", true)
  .order("player_name");

  const { data: mappings } = await supabase
    .from("player_display_names")
    .select("*");
  
  const map: Record<string, string> = {};

  (mappings as DisplayName[] | null)?.forEach(
    (m) => {
      map[m.fantapiu3_name] = m.display_name;
    }
  );

  setDisplayMap(map);

  setPlayers((data || []) as FreeAgent[]);

  setLoading(false);
}

  const roles = [
    "Tutti",
    "P",
    "D",
    "C",
    "A",
  ];

  const nations = [
    "Tutte",
    ...Array.from(
      new Set(
        players.map((p) => p.nazionale)
      )
    ).sort(),
  ];

  const filteredPlayers = useMemo(() => {
    let rows = [...players];

    rows = rows.filter((p) => {
  const displayName =
    displayMap[p.player_name] ||
    p.player_name;

  return displayName
    .toLowerCase()
    .includes(search.toLowerCase());
});

    if (roleFilter !== "Tutti") {
      rows = rows.filter(
        (p) => p.ruolo === roleFilter
      );
    }

    if (nationFilter !== "Tutte") {
      rows = rows.filter(
        (p) => p.nazionale === nationFilter
      );
    }

rows.sort((a, b) => {
  let valueA: string | number = "";
  let valueB: string | number = "";

  switch (sortField) {
    case "giocatore":
      valueA =
        displayMap[a.player_name] ||
        a.player_name;

      valueB =
        displayMap[b.player_name] ||
        b.player_name;
      break;

    case "nazionale":
      valueA = a.nazionale;
      valueB = b.nazionale;
      break;

    case "ruolo":
  const order = {
    P: 1,
    D: 2,
    C: 3,
    A: 4,
  };

  valueA =
    order[a.ruolo as keyof typeof order];

  valueB =
    order[b.ruolo as keyof typeof order];

  break;

    case "quotazione":
      valueA = a.quotazione;
      valueB = b.quotazione;
      break;
  }

  if (
    typeof valueA === "number" &&
    typeof valueB === "number"
  ) {
    return sortDirection === "asc"
      ? valueA - valueB
      : valueB - valueA;
  }

  return sortDirection === "asc"
    ? String(valueA).localeCompare(
        String(valueB),
        "it"
      )
    : String(valueB).localeCompare(
        String(valueA),
        "it"
      );
});

return rows;  }, [
  players,
  displayMap,
  search,
  roleFilter,
  nationFilter,
  sortField,
  sortDirection,
]);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(to bottom,#1f2937,#0f172a)",
          color: "white",
          padding: 20,
        }}
      >
        Caricamento...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#1f2937,#0f172a)",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <BackHome />

        <h1
          style={{
            textAlign: "center",
            fontSize: "clamp(2rem,6vw,3.5rem)",
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          📑 Listone Svincolati
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            marginBottom: 20,
          }}
        >
          Elenco ufficiale dei calciatori disponibili sul mercato.
        </p>

        <Card title="📋 Svincolati">
          <div
  style={{
    textAlign: "center",
    color: "#facc15",
    fontWeight: 800,
    fontSize: "1.15rem",
    marginBottom: 16,
  }}
>
  📑 Svincolati disponibili: {players.length}
</div>

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Cerca giocatore..."
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "none",
              marginBottom: 12,
            }}
          />

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 15,
            }}
          >
            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
              style={{
                padding: 8,
                borderRadius: 8,
              }}
            >
              {roles.map((r) => (
                <option
                  key={r}
                  value={r}
                >
                  {r}
                </option>
              ))}
            </select>

            <select
              value={nationFilter}
              onChange={(e) =>
                setNationFilter(e.target.value)
              }
              style={{
                padding: 8,
                borderRadius: 8,
              }}
            >
              {nations.map((n) => (
                <option
                  key={n}
                  value={n}
                >
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th
  style={thClickable}
  onClick={() =>
    handleSort("giocatore")
  }
>
  Giocatore
  {sortField === "giocatore" &&
    (sortDirection === "asc"
      ? " ▲"
      : " ▼")}
</th>

<th
  style={thClickable}
  onClick={() =>
    handleSort("nazionale")
  }
>
  Nazionale
  {sortField === "nazionale" &&
    (sortDirection === "asc"
      ? " ▲"
      : " ▼")}
</th>

<th
  style={thClickable}
  onClick={() =>
    handleSort("ruolo")
  }
>
  Ruolo
  {sortField === "ruolo" &&
    (sortDirection === "asc"
      ? " ▲"
      : " ▼")}
</th>

<th
  style={thClickable}
  onClick={() =>
    handleSort("quotazione")
  }
>
  Q.
  {sortField === "quotazione" &&
    (sortDirection === "asc"
      ? " ▲"
      : " ▼")}
</th>
                </tr>
              </thead>

              <tbody>
                {filteredPlayers.map((p) => (
                  <tr key={p.id}>
                    <td style={tdStyle}>
                      {displayMap[p.player_name] ||
  p.player_name}
                    </td>

                    <td style={tdStyle}>
                      {p.nazionale}
                    </td>

                    <td style={tdStyle}>
                      {p.ruolo}
                    </td>

                    <td style={tdStyle}>
                      {p.quotazione}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div
          style={{
            marginTop: 50,
            paddingTop: 20,
            borderTop:
              "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: 14,
          }}
        >
          FantAquilaCastoro 2026 • Road to New York 🗽
        </div>
      </div>
    </main>
  );
}

const thStyle: React.CSSProperties = {
  padding: "10px",
  borderBottom:
    "1px solid rgba(255,255,255,0.15)",
  color: "#facc15",
  textAlign: "left",
};

const thClickable: React.CSSProperties = {
  ...thStyle,
  cursor: "pointer",
  userSelect: "none",
};

const tdStyle: React.CSSProperties = {
  padding: "10px",
  borderBottom:
    "1px solid rgba(255,255,255,0.08)",
};