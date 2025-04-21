"use client";
import React, { useState, useEffect } from "react";
import { NotificationSection } from "./NotificationSection";
import { Sidebar } from "./Sidebar";
import { SearchBar } from "./SearchBar";
import { ProfileMenu } from "./ProfileMenu";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const [view, setView] = useState<"inbox" | "sent" | "drafts">("inbox");
  const [mounted, setMounted] = useState(false);
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex p-6 gap-6 pt-15 min-h-screen bg-background text-foreground transition-colors duration-300 ease-in-out">
      <div className="min-w-1/10 max-md:hidden">
        <Sidebar currentView={view} setView={setView} />
      </div>

      <div className="flex-1 max-w-8/10">
        <SearchBar />
        <NotificationSection view={view} />
      </div>

      <div className="min-w-1/10 ml-auto">
        <ProfileMenu />
      </div>
    </div>
  );
}