"use client";
import React, { useState } from "react";
import { NotificationSection } from "./NotificationSection";
import { Sidebar } from "./Sidebar";
import { SearchBar } from "./SearchBar";
import { ProfileMenu } from "./ProfileMenu";

export default function Home() {
  const [view, setView] = useState<"inbox" | "sent" | "drafts">("inbox");

  return (
    <div className="flex p-6 gap-6 pt-15">
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