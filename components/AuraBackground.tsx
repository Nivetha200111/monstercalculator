export default function AuraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* drifting aura blobs */}
      <div
        className="aura-blob -top-40 left-1/2 h-[560px] w-[820px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(82,215,255,0.22), rgba(82,215,255,0.05) 55%, transparent 75%)",
        }}
      />
      <div
        className="aura-blob aura-blob-alt top-[30%] -left-64 h-[520px] w-[520px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(184,167,255,0.16), transparent 70%)",
        }}
      />
      <div
        className="aura-blob top-[55%] -right-72 h-[600px] w-[600px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(169,246,255,0.13), transparent 70%)",
          animationDelay: "-8s",
        }}
      />
      <div
        className="aura-blob aura-blob-alt bottom-[-15%] left-[20%] h-[480px] w-[720px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(120,255,214,0.08), transparent 70%)",
          animationDelay: "-14s",
        }}
      />
      {/* structural layers */}
      <div className="grid-overlay absolute inset-0" />
      <div className="noise-overlay absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 110%, rgba(5,7,10,0.95) 30%, transparent 70%)",
        }}
      />
    </div>
  );
}
