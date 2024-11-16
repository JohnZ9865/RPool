import { db } from "@/utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { POST_COLLECTION, RidePostingObject } from "../../types/post";

const getIDFromURL = (url: string) => {
  const urlParts = url.split("/");
  return urlParts[urlParts.length - 1];
};

export const GET = async (req: NextRequest) => {
  // const {id} = req.
  const res = NextResponse;

  try {
    const postId = getIDFromURL(req.url);

    const postData = await getDoc(doc(db, POST_COLLECTION, postId));



    return res.json(
      { message: "OK", postDoc: postData.data() },
      { status: 200 },
    );
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const res = NextResponse;

  try {
    const postId = getIDFromURL(req.url);
    const input: Partial<RidePostingObject> = await req.json();

    const postRef = doc(db, POST_COLLECTION, postId);
    await updateDoc(postRef, input);

    return res.json({ message: "Post updated" }, { status: 200 });
  } catch (err) {
    return res.json(
      { postMessage: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
}




