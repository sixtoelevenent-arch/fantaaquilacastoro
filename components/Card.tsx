type CardProps = {
  title?: string;
  children: React.ReactNode;
  onClick?: () => void;
  highlight?: boolean;
};

export default function Card({
  title,
  children,
  onClick,
  highlight,
}: CardProps) {

  return (
    <div
     onClick={onClick}
     style={{
  cursor: onClick ? "pointer" : "default",

  display: "flex",
flexDirection: "column",
height: "100%",

  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(10px)",

  border: highlight
    ? "2px solid #facc15"
    : "1px solid rgba(255,255,255,0.15)",

  borderRadius: "20px",

  padding: "8px",

  marginBottom: "12px",

  transition: "all 0.2s ease",

  boxShadow: highlight
    ? "0 0 25px rgba(250,204,21,0.35)"
    : "0 10px 30px rgba(0,0,0,0.35)",
}}
    >
      {title && (
        <h2
          style={{
            marginTop: 0,
            marginBottom: "18px",
            fontSize: "1.4rem",
            color: "#f8fafc",
          }}
        >
          {title}
        </h2>
      )}

      <div
        style={{
          color: "#e2e8f0",
          lineHeight: 1.8,
        }}
      >
        {children}
      </div>
    </div>
  );
}