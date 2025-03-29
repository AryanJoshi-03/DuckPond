"use client";
import * as React from "react";
import { NavigationMenu } from "./NavigationMenu";
import Image from "next/image";
import ComposeButton from "./ComposeButton";
import ComposeModal from "./ComposeModal";

export const Sidebar: React.FC = () => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <aside className="flex flex-col gap-4 max-md:w-full justify-center items-center">
          <Image
          src="/DP_Logo_White.png" // Path relative to the public directory
          alt="Duck Pond Logo"
          width={100} // Set appropriate width
          height={100} // Set appropriate height
        />
        <ComposeButton onClick={() => setShowModal(true)} />
        <button className="h-10 text-sm font-medium text-white cursor-pointer bg-slate-500 rounded-[100px] w-[137px]">
          Configure Apps
        </button>
        <NavigationMenu />
      </aside>
      {/* Conditionally render modal */}
      {showModal && <ComposeModal onClose={() => setShowModal(false)} />}
    </>
  );
};
