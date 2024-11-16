"use client";

import { useState } from "react";

import { useUserSession } from "@/hooks/useSession";
import { signInWithGoogle, signOutWithGoogle } from "@/utils/firebase";
import { createSession, removeSession } from "@/actions/auth-actions";

const Page = ({ session }: { session: string | null }) => {
  console.log("arrived at login");
  const userSessionId = useUserSession(session);

  const handleSignIn = async () => {
    // if (userSessionId != null) return ;

    const userUid = await signInWithGoogle();
    if (userUid) {
      await createSession(userUid);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <button onClick={handleSignIn}>Sign In</button>
      Brotha: {userSessionId}
    </div>
  );
};

export default Page;
