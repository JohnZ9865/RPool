// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

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
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

/**
 * Signs in the user with Google and stores their information in Firestore.
 */
export const signInWithGoogle = async () => {
  try {
    // Perform Google Sign-In
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Reference to the Firestore 'users' collection and user document
    const usersCollection = collection(db, "users");
    const userDoc = doc(usersCollection, user.uid);

    // Save user info in Firestore
    await setDoc(
      userDoc,
      {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
      },
      { merge: true } // Prevent overwriting if document exists
    );

    console.log("User signed in and saved to Firestore:", user);
  } catch (error) {
    console.error("Error during Google sign-in:", error.message);
  }
};
