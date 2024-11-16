"use client";

import { useState } from "react";
import { Box, TextField, Button, IconButton, Avatar, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


const ProfilePage = () => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingMajor, setIsEditingMajor] = useState(false);
  const [isEditingYear, setIsEditingYear] = useState(false);

  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [major, setMajor] = useState("Computer Science");
  const [year, setYear] = useState("Senior");

  const handleEditClick = (field) => {
    if (field === "name") setIsEditingName(!isEditingName);
    if (field === "email") setIsEditingEmail(!isEditingEmail);
    if (field === "major") setIsEditingMajor(!isEditingMajor);
    if (field === "year") setIsEditingYear(!isEditingYear);
  };

  const handleBackClick = () => {
    console.log("Back clicked");
  };

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
        <IconButton onClick={handleBackClick} color="primary">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* Profile Picture */}
      <Avatar
        sx={{
          width: 100,
          height: 100,
          mb: 3, 
        }}
        src="https://via.placeholder.com/100" 
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
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            fullWidth
            disabled={!isEditingName}
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
          <IconButton onClick={() => handleEditClick("name")} sx={{ ml: 1 }}>
            <EditIcon />
          </IconButton>
        </Box>

        {/* Email Field */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            fullWidth
            disabled={!isEditingEmail}
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
          <IconButton onClick={() => handleEditClick("email")} sx={{ ml: 1 }}>
            <EditIcon />
          </IconButton>
        </Box>

        {/* Major Field */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Major"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            variant="outlined"
            fullWidth
            disabled={!isEditingMajor}
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
          <IconButton onClick={() => handleEditClick("major")} sx={{ ml: 1 }}>
            <EditIcon />
          </IconButton>
        </Box>

        {/* Year Field */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            variant="outlined"
            fullWidth
            disabled={!isEditingYear}
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
          <IconButton onClick={() => handleEditClick("year")} sx={{ ml: 1 }}>
            <EditIcon />
          </IconButton>
        </Box>
      </Box>

      {}
      {isEditingName || isEditingEmail || isEditingMajor || isEditingYear ? (
        <Box sx={{ mt: 4, width: "100%", display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
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
            onClick={() => {
              setIsEditingName(false);
              setIsEditingEmail(false);
              setIsEditingMajor(false);
              setIsEditingYear(false);
            }}
          >
            Save Changes
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

export default ProfilePage;


