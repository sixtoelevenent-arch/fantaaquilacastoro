type CardProps = {
  title?: string;
  children: React.ReactNode;
};

export default function Card({ title, children }: CardProps) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "20px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
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