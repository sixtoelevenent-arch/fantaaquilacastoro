import Link from "next/link";

export default function BackHome() {
  return (
    <Link
      href="/"
      style={{
        display: "inline-block",
        marginBottom: "20px",
        padding: "10px 16px",
        background: "#1f2937",
        color: "white",
        textDecoration: "none",
        borderRadius: "12px",
        fontWeight: "700",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      ← Home
    </Link>
  );
}