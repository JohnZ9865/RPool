import { NextResponse } from "next/server";
import { db } from "@/utils/firebase";
import { collection, addDoc } from "firebase/firestore";

export const POST = async (req) => {
  const res = NextResponse;

  const { name, email } = await req.json();

  try {
    await addDoc(collection(db, "accounts"), {
      name: name,
      email: email,
    });

    return res.json({ message: "OK" }, { status: 200 });
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};
