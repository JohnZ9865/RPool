"use client";

import { useState } from "react";
import { api } from "@/utils/api";
import toast from "react-hot-toast";

const Home = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    api({
      method: "POST",
      url: "/api/user",
      body: { name, email },
    })
      .then(() => toast(`Submitted successfully!`))
      .catch(() => toast(`Internal Server Error`));
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <p className="mb-4 text-xl">Add Data to Firestore Database</p>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md rounded-md bg-white shadow-md"
      >
        <div className="mb-4 p-3">
          <label htmlFor="name" className="mb-2 block font-bold text-gray-700">
            Name:
          </label>
          <input
            type="text"
            id="name"
            className="rounded-md border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4 p-3">
          <label htmlFor="email" className="mb-2 block font-bold text-gray-700">
            Email:
          </label>
          <input
            type="text"
            id="email"
            className="rounded-md border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="mb-4 rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home;
