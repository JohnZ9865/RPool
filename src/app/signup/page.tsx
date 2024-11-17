"use client";

import { useState } from "react";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import { useUserSession } from "@/hooks/useSession";

const Page = () => {
  const [name, setName] = useState("");
  const { firestoreId } = useUserSession(null);

  // console.log('HEIENRIEN WRK', firestoreId);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      Our Sign Up screen.
    </div>
  );
};

export default Page;
