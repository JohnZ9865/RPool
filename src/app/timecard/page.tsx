"use client";

import { useState } from "react";
import { api } from "@/utils/api";
import toast from "react-hot-toast";

const Home = () => {
  const [name, setName] = useState("");

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      Our Time Card screen. Make this dynamic routing.
    </div>
  );
};

export default Home;
