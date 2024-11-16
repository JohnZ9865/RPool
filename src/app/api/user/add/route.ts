import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/firebase";
import { collection, addDoc, getDoc, doc, setDoc } from "firebase/firestore";
import { USER_COLLECTION, UserDocumentObject, YearEnum } from "../../types/user";

interface expectedInput {
  name: string;
  email: string;
  major: string;
  year: YearEnum;
  profilePictureUrl: string;
}

export const POST = async (req: NextRequest) => {
  const res = NextResponse;

  try {
  const { name, email } = await req.json();

    const documentBody = {
      name,
      email,
      major: "",
      year: YearEnum.FRESHMAN,
      profilePictureUrl: "",
    };
    const docRef = await addDoc(collection(db, USER_COLLECTION), documentBody);

    await setDoc(docRef, {
      id: docRef.id,
      ...documentBody,
    });

    return res.json({ message: "OK" }, { status: 200 });
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};
