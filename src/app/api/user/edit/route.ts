import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { USER_COLLECTION, YearEnum } from "../../types/user";

interface expectedInput {
  id: string;
  name: string;
  email: string;
  major: string;
  year: YearEnum;
  profilePictureUrl: string;
}

export const POST = async (req: NextRequest) => {
  const res = NextResponse;

  try {
    const input: Partial<expectedInput> = await req.json();

    if (input.id) {
      const postRef = doc(db, USER_COLLECTION, input.id);
      await updateDoc(postRef, input);
    }

    return res.json({ message: "OK" }, { status: 200 });
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};
