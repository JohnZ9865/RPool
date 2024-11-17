import { useEffect, useState } from "react";
import { onAuthStateChanged } from "@/utils/firebase";
import { findUserIdByEmail } from "@/utils/firebase";

export function useUserSession(initSession: string | null) {
  const [userUid, setUserUid] = useState<string | null>(initSession);
  const [firestoreId, setFirestoreId] = useState<string | null>(null);

  // Listen for changes to the user session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (authUser) => {
      console.log("what the fuck", authUser);
      if (authUser) {
        setUserUid(authUser.uid);

        // Fetch the Firestore document ID based on the user's email
        if (authUser.email) {
          try {
            const documentId = await findUserIdByEmail(authUser.email);
            setFirestoreId(documentId); // Update the Firestore ID in state
          } catch (error) {
            console.error("Error fetching Firestore document ID:", error);
            setFirestoreId(null);
          }
        }
      } else {
        setUserUid(null);
        setFirestoreId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return { userUid, firestoreId }; //if userUid is null, not logged in.
}
