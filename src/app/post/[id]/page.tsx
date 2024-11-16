"use client";

import { useState } from "react";
import { api } from "@/utils/api";
import toast from "react-hot-toast";

const Home = ({params}: {params: {id: string}}) => {
console.log(params)
  const [name, setName] = useState("");

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      {params.id}
    </div>
  );
};

export default Home;
