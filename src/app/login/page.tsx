"use client";

import { useState } from "react";
import { useUserSession } from "@/hooks/useSession";
import { signInWithGoogle, signOutWithGoogle } from "@/utils/firebase";
import { createSession, removeSession } from "@/actions/auth-actions";
import { TextField, Box, Button, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Page = ({ session }: { session: string | null }) => {
  console.log("arrived at login");
  const userSessionId = useUserSession(session);

  const handleSignIn = async () => {
    if (userSessionId != null) return;

    const userUid = await signInWithGoogle();
    if (userUid) {
      await createSession(userUid);
    }
  };

  const [valuePass, setPassValue] = useState("");
  const handlePassChange = (event) => setPassValue(event.target.value);

  const [valueEmail, setEmailValue] = useState("");
  const handleEmailChange = (event) => setEmailValue(event.target.value);

  return (
    <Box
      sx={{
        minHeight: "100vh", // Full screen height
        background: "linear-gradient(to right, #3e94c9, #ffeb3b)", // Blue to yellow gradient
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center", // Centering content
        p: 4,
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          fontSize: "3rem",
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
          mb: 4, // Spacing below header
        }}
      >
        Pool safe, pool smart. Travel with R' Pool.
      </Box>

      {/* Google Sign-in Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center", // Center the button
          width: "100%", // Ensures the button is centered
        }}
      >
        <Button
          onClick={handleSignIn}
          variant="outlined"
          color="primary"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            borderColor: "black",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            padding: "10px 24px",
            textTransform: "none",
            fontWeight: "500",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <GoogleIcon sx={{ mr: 2 }} /> {/* Google logo */}
          <Typography variant="body1" color="textPrimary">
            Sign in with Google
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default Page;
