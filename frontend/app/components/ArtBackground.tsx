import React from "react";

// Use the provided SVG as the static background
const ArtBackground: React.FC = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      width: "100vw",
      height: "100vh",
      background: "#fff",
      zIndex: 0,
      pointerEvents: "none",
      overflow: "hidden",
    }}
    aria-hidden
  >
    <video
      src="/static/Backgroundv3.mp4"
      autoPlay
      loop
      muted
      playsInline
      style={{
        width: "100vw",
        height: "100vh",
        objectFit: "cover",
        position: "absolute",
        inset: 0,
        zIndex: 0,
      }}
    />
  </div>
);

export default ArtBackground;
