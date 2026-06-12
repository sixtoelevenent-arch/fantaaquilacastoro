import Link from "next/link";

export default function BackHome() {
  return (
    <Link
      href="/"
      style={{
        display: "inline-block",
        marginBottom: "20px",
        padding: "10px 16px",
        background: "#2563eb",
        color: "white",
        textDecoration: "none",
        borderRadius: "8px",
        fontWeight: "bold",
      }}
    >
      ← Home
    </Link>
  );
}