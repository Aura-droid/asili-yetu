"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

export default function Spotlight() {
  const { theme } = useTheme();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (theme !== "jungle") return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [theme]);

  if (theme !== "jungle") return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] transition-opacity duration-500"
      style={{
        background: `radial-gradient(900px circle at ${position.x}px ${position.y}px, rgba(74, 222, 128, 0.12), transparent 40%)`,
      }}
    />
  );
}
