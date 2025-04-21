"use client";

import { signOutUserAction } from "@/data/actions/auth-actions";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    // Clear the token cookie on the client side
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; sameSite=strict; secure';
    
    // Call the server action
    const result = await signOutUserAction();
    if (result.data === "ok" && result.redirect) {
      router.push(result.redirect);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
    >
      Sign Out
    </button>
  );
} 