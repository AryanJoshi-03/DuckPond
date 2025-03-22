import Image from "next/image";
import { NotificationCard } from "./NotificationCard";
import { NotificationSection } from "./NotificationSection";
import { Sidebar } from "./Sidebar";
import { SearchBar } from "./SearchBar";
import { ProfileMenu } from "./ProfileMenu";
export default function Home() {
  return (
    <div className="flex p-6 gap-6 pt-15">
      <div className="min-w-1/10 max-md:hidden">
        <Sidebar />

      </div>
      <div className="flex-1 max-w-8/10">
        <SearchBar />
        <NotificationSection />
      </div>
      <div className="min-w-1/10 ml-auto">
        <ProfileMenu />
      </div>
    </div>
  );
}
