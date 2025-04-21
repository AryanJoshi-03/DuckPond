"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 ease-in-out">
      {children}
    </div>
  );
} 