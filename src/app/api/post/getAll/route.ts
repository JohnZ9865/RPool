import { NextRequest, NextResponse } from "next/server";
import { PopulatedPostingObject, POST_COLLECTION, RidePostingObject } from "../../types/post";
import { db } from "@/utils/firebase";
import { collection, DocumentReference, getDoc, getDocs } from "firebase/firestore";
import { UserDocumentObject } from "../../types/user";

export interface GetAllResponse {
  message: string;
  userIsPassenger: PopulatedPostingObject[];
  allPosts: PopulatedPostingObject[];
}

export const GET = async (req: NextRequest) => {
  const res = NextResponse;

  try {
    // get the owner id from the query params
    const ownerId = req.nextUrl.searchParams.get("ownerId");

    // formatted post
    const userIsPassenger: PopulatedPostingObject[] = [];
    const allPosts: PopulatedPostingObject[] = [];
  
    // get all of the posts in the collection
    const posts: RidePostingObject[] = [];
    (await getDocs(collection(db, POST_COLLECTION))).forEach(post => {
      posts.push(post.data() as RidePostingObject);
    });

    // loop through all of the posts and populate the userIsPassenger and allPosts arrays
    for (const post of posts) {
      // Check if usersInRide exists and is an array
      const usersInRide = post.usersInRide ? await Promise.all(
        post.usersInRide.map(async user => {
          const userDoc = await getDoc(user);
          // Check if document exists
          if (!userDoc.exists()) {
            console.error(`User document not found for reference: ${user.path}`);
            return null;
          }
          return userDoc.data() as UserDocumentObject;
        })
      ).then(users => users.filter(user => user !== null)) : [];

      // Check if owner reference exists
      if (!post.owner) {
        console.error('Post owner reference is missing:', post);
        continue;
      }

      const ownerDoc = await getDoc(post.owner);
      if (!ownerDoc.exists()) {
        console.error(`Owner document not found for reference: ${post.owner.path}`);
        continue;
      }

      const ownerData = ownerDoc.data() as UserDocumentObject;
      
      if (usersInRide.some(user => user?.id === ownerId)) {
        userIsPassenger.push({ ...post, owner: ownerData, usersInRide });
      }
      allPosts.push({ ...post, owner: ownerData, usersInRide });
    }

    return res.json(
      { message: "OK", userIsPassenger, allPosts },
      { status: 200 },
    );
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};