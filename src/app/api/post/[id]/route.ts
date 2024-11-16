import { db } from "@/utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import {
  PopulatedPostingObject,
  POST_COLLECTION,
  RidePostingObject,
} from "../../types/post";
import { UserDocumentObject } from "../../types/user";
import { ExpectedInputAddPostInput } from "../add/route";

const getIDFromURL = (url: string) => {
  const urlParts = url.split("/");
  return urlParts[urlParts.length - 1];
};

export const GET = async (req: NextRequest) => {
  // const {id} = req.
  const res = NextResponse;

  try {
    const postId = getIDFromURL(req.url);

    const postData = (
      await getDoc(doc(db, POST_COLLECTION, postId))
    ).data() as RidePostingObject;

    // Check if usersInRide exists and is an array
    const usersInRide = postData.usersInRide
      ? await Promise.all(
          postData.usersInRide.map(async (user) => {
            const userDoc = await getDoc(user);
            // Check if document exists
            if (!userDoc.exists()) {
              console.error(
                `User document not found for reference: ${user.path}`,
              );
              return null;
            }
            return userDoc.data() as UserDocumentObject;
          }),
        ).then((users) => users.filter((user) => user !== null))
      : [];

    // Check if owner reference exists
    if (!postData.owner) {
      console.error("Post owner reference is missing:", postData);
      return res.json(
        { message: "Post owner reference is missing" },
        { status: 400 },
      );
    }

    const ownerDoc = await getDoc(postData.owner);
    if (!ownerDoc.exists()) {
      console.error(
        `Owner document not found for reference: ${postData.owner.path}`,
      );
      return res.json({ message: "Owner document not found" }, { status: 400 });
    }

    const ownerData = ownerDoc.data() as UserDocumentObject;

    const populatedPost: PopulatedPostingObject = {
      ...postData,
      owner: ownerData,
      usersInRide,
    };

    return res.json({ message: "OK", postDoc: populatedPost }, { status: 200 });
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
    const input: Partial<ExpectedInputAddPostInput> = await req.json();

    const postRef = doc(db, POST_COLLECTION, postId);
    await updateDoc(postRef, input);

    return res.json({ message: "Post updated" }, { status: 200 });
  } catch (err) {
    return res.json(
      { postMessage: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};
