import { NextRequest, NextResponse } from "next/server";
import { ExpectedInputAddPostInput } from "../add/route";
import { POST_COLLECTION } from "@/app/api/types/post";
import { db } from "@/utils/firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  DocumentReference,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export const POST = async (req: NextRequest) => {
  const res = NextResponse;

  try {
    const input: {
      postId: string;
      userId: string;
    } = await JSON.parse(await req.text());

    const postRef = doc(db, POST_COLLECTION, input.postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      throw new Error("Post not found");
    }

    const currentUsers = postDoc.data().usersInRide || [];
    const userRef = doc(db, "users", input.userId); // Assuming you have a users collection

    // Check if user is already in the ride
    const isUserInRide = currentUsers.some(
      (ref: DocumentReference) => ref.path === userRef.path,
    );

    await updateDoc(postRef, {
      usersInRide: isUserInRide
        ? arrayRemove(userRef) // Remove if user is already in ride
        : arrayUnion(userRef), // Add if user is not in ride
    });

    return res.json({ message: "Post updated" }, { status: 200 });
  } catch (err) {
    return res.json(
      { postMessage: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};
