// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import {
  type User,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged as _onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  query,
  getDocs,
  where,
} from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Instantiate services
export const firebaseAuth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

/**
 * Signs in the user with Google and stores their information in Firestore.
 */
export function onAuthStateChanged(callback: (authUser: User | null) => void) {
  return _onAuthStateChanged(firebaseAuth, callback);
}

export async function findUserIdByEmail(
  targetEmail: string,
): Promise<string | null> {
  try {
    // Reference to the "users" collection
    const usersCollection = collection(db, "users");

    // Create a query to find the document with the matching email
    const q = query(usersCollection, where("email", "==", targetEmail));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Check if a document was found
    if (!querySnapshot.empty) {
      // Assuming only one document will match the query
      const doc = querySnapshot.docs[0];
      return doc.id; // Return the document's ID
    }

    // If no document is found, return null
    return null;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw new Error("Failed to find user by email");
  }
}

export const doesEmailExist = async (targetEmail: string): Promise<boolean> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", targetEmail));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty; // Return true if at least one document matches
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false; // Handle gracefully
  }
};

//pop up version:
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(firebaseAuth, provider);
    if (!result || !result.user) {
      throw new Error("Google sign in failed");
    }
    const targetEmail = result.user.email;
    const existness = await doesEmailExist(targetEmail);
    console.log("sign in with google firebase.ts", existness, "end existness");

    if (existness) {
      //directs to home
      window.location.href = "/home";
    } else {
      //redirect to /signup page.
      window.location.href = "/signup";
    }

    return result.user.uid;
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

// non pop up version:
// export async function signInWithGoogle() {
//   const provider = new GoogleAuthProvider();

//   try {

//     // Initiates the Google sign-in with redirect
//     await signInWithRedirect(firebaseAuth, provider);
//     console.log("fucking login already for fucks sake");
//     const result = await getRedirectResult(firebaseAuth);

//     if (result && result.user) {
//       const uid = result.user.uid; // Get the UID
//       console.log("User signed in successfully:", uid);

//       // Redirect to "/home"
//       return uid;
//     } else {
//       console.log("No user signed in or no result found.");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error during Google sign-in process", error);
//     return null;
//   }

// }

export async function signOutWithGoogle() {
  try {
    await firebaseAuth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}
