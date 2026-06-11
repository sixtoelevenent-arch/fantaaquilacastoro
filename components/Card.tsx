type CardProps = {
  title?: string;
  children: React.ReactNode;
};

export default function Card({ title, children }: CardProps) {
  return (
    <div
      style={{
        background: "#1e293b",
        borderRadius: "18px",
        padding: "20px",
        marginBottom: "20px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
      }}
    >
      {title && (
        <h2
          style={{
            marginTop: 0,
            marginBottom: "15px",
            color: "white",
          }}
        >
          {title}
        </h2>
      )}

      <div
        style={{
          color: "#e2e8f0",
        }}
      >
        {children}
      </div>
    </div>
  );
}