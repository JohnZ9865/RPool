import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { USER_COLLECTION, UserDocumentObject } from "../../types/user";

interface getUserInput {
  id: string;
}

interface getUserResponse {
  message: string;
  userDoc: UserDocumentObject;
}

const getUserIdFromUrl = (url: string) => {
  const urlParts = url.split("/");
  return urlParts[urlParts.length - 1];
};

export const GET = async (req: NextRequest) => {
  // const {id} = req.
  const res = NextResponse;

  try {
    const userId = getUserIdFromUrl(req.url);
    
    const userDoc = await getDoc(doc(db, USER_COLLECTION, userId));

    return res.json({ message: "OK", userDoc: userDoc.data() }, { status: 200 });
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};
