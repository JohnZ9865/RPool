"use client";

import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Avatar,
  LinearProgress,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { useUserSession } from "@/hooks/useSession";
import { api } from "@/utils/api";
import { UserDocumentObject, YearEnum } from "../api/types/user";

const ProfilePage = () => {
  const { firestoreId } = useUserSession(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formState, setFormState] = useState<UserDocumentObject>({
    id: firestoreId,
    name: "",
    email: "",
    major: "",
    year: YearEnum.FRESHMAN,
    profilePictureUrl: "",
  });

  const saveChanges = async () => {
    setIsSaving(true);
    await fetch("/api/user/edit", {
      method: "POST",
      body: JSON.stringify(formState),
    });
    setIsSaving(false);
  };

  const getUserData = async () => {
    try {
      const res = await api({
        method: "GET",
        url: `/api/user/${firestoreId}`,
      });
      setFormState(res.userDoc);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (firestoreId) {
      getUserData();
      setIsLoading(false);
    }
  }, [firestoreId]);

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        p: 4,
      }}
    >
      {/* Back Button at the top left */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
        }}
      >
        <Link href="/home">
          <IconButton color="primary">
            <ArrowBackIcon />
          </IconButton>
        </Link>
      </Box>

      {/* Profile Picture */}
      <Avatar
        sx={{
          width: 100,
          height: 100,
          mb: 3,
        }}
        src={formState.profilePictureUrl}
        alt="User Profile"
      />

      {/* Editable Form */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {/* Name Field */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            required
            label="Name"
            value={formState.name}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                borderColor: "black", // Black border for the input field
              },
              "& .MuiInputLabel-root": {
                color: "black", // Black label color
              },
              "& .MuiOutlinedInput-input": {
                color: "black", // Black text inside the input field
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "black", // Always black border for the outline
              },
              "& .MuiInputBase-input::placeholder": {
                color: "black", // Always black placeholder text
              },
            }}
          />
        </Box>

        {/* Email Field */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Email"
            required
            value={formState.email}
            onChange={(e) =>
              setFormState({ ...formState, email: e.target.value })
            }
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                borderColor: "black", // Black border for the input field
              },
              "& .MuiInputLabel-root": {
                color: "black", // Black label color
              },
              "& .MuiOutlinedInput-input": {
                color: "black", // Black text inside the input field
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "black", // Always black border for the outline
              },
              "& .MuiInputBase-input::placeholder": {
                color: "black", // Always black placeholder text
              },
            }}
          />
        </Box>

        {/* Major Field */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Major"
            value={formState.major}
            onChange={(e) =>
              setFormState({ ...formState, major: e.target.value })
            }
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                borderColor: "black",
              },
              "& .MuiInputLabel-root": {
                color: "black", // Black label color
              },
              "& .MuiOutlinedInput-input": {
                color: "black",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "black",
              },
            }}
          />
        </Box>

        {/* Year Field */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Autocomplete
            options={Object.values(YearEnum)}
            value={formState.year}
            onChange={(e, value) =>
              setFormState({ ...formState, year: value as YearEnum })
            }
            renderInput={(params) => <TextField {...params} label="Year" />}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                borderColor: "black",
              },
              "& .MuiInputLabel-root": {
                color: "black",
              },
              "& .MuiOutlinedInput-input": {
                color: "black",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "black",
              },
            }}
          />
        </Box>
      </Box>

      {/* Save Changes Button */}
      <Box
        sx={{
          mt: 4,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          disabled={isSaving}
          sx={{
            width: "200px",
            backgroundColor: "#3e94c9",
            color: "black",
            borderRadius: "8px",
            padding: "10px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "blue",
            },
          }}
          onClick={saveChanges}
        >
          {isSaving ? <CircularProgress /> : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProfilePage;
