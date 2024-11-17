"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Import the plus icon
import Link from "next/link";
import Timecard from "@/components/Timecard";
import { GetAllResponse } from "../api/post/getAll/route";
import { api } from "@/utils/api";
import { useUserSession } from "@/hooks/useSession";

const Page = () => {
  const { firestoreId } = useUserSession(null);

  const [posts, setPosts] = useState<GetAllResponse>({
    allPosts: [],
    userIsPassenger: [],
    message: "",
  });

  const formatDateTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getAllPostsData = async () => {
    try {
      const posts = await api({
        method: "GET",
        url: `/api/post/getAll?ownerId=${firestoreId}`,
      });
      setPosts(posts);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllPostsData();
  }, [firestoreId]);

  // Filter Current Groups: The logged-in user is a passenger in the group
  const currentGroups = posts.allPosts.filter(
    (post) => post.owner.id === firestoreId,
  );

  // Filter Available Groups: The logged-in user is not part of the group (neither as a passenger nor the owner)
  const availableGroups = posts.allPosts.filter(
    (post) =>
      post.owner.id !== firestoreId && !post.usersInRide.includes(firestoreId),
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top Header with Gradient Background */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(to right, #1976d2, #FFEB3B)", // Blue to Yellow gradient
          color: "white", // White text
          fontFamily: "'Roboto', sans-serif", // Set a nice font from Google Fonts
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          {/* Title centered */}
          <Typography
            variant="h4"
            sx={{ ml: 4, textAlign: "center", fontWeight: "bold", flexGrow: 1 }}
          >
            R' Pool
          </Typography>

          {/* Profile Icon linked to the account page with padding around it */}
          <Link href="/account" passHref>
            <IconButton
              sx={{
                color: "white",
                padding: "8px",
                marginRight: "30px",
              }}
              aria-label="account"
            >
              <AccountCircleIcon />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>

      {/* Create Group Button (Center below header) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 4,
        }}
      >
        <Link href="/creategroup" passHref>
          <Button
            variant="contained"
            sx={{
              background: "light-blue", // Gradient background
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              alignItems: "center",
              transition: "all 0.3s ease",
            }}
          >
            <AddCircleIcon sx={{ marginRight: 1 }} /> {/* Add Plus Icon */}
            Create Group
          </Button>
        </Link>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "column",
          padding: 2,
          backgroundColor: "white",
        }}
      >
        {posts.allPosts.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              height: "1vh",
            }}
          >
            <Box sx={{ marginLeft: 85 }}>
              <CircularProgress />
            </Box>

            <Typography variant="h6" sx={{ marginLeft: 85 }}>
              Loading posts...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Current Groups Section */}
            <Box
              sx={{
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
                marginTop: 4,
                backgroundColor: "white",
                borderRadius: "8px",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", marginBottom: 2 }}
              >
                Current Groups
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap", // Allow wrapping of items onto the next row
                  justifyContent: "space-between", // Distribute space evenly between items
                  marginTop: 2,
                  gap: 3, // Space between each Timecard
                  width: "100%",
                  maxWidth: "1200px", // Maximum width for the container
                  margin: "0 auto", // Center the grid container
                }}
              >
                {currentGroups.map((post, index) => (
                  <Box
                    key={index}
                    sx={{
                      flexBasis: "calc(33.33% - 20px)", // Ensure each item takes 1/3 of the width minus the gap
                      boxSizing: "border-box", // Include padding and margin in the element's total width and height
                      "@media (max-width: 900px)": {
                        flexBasis: "calc(50% - 20px)", // For medium screens, 2 columns
                      },
                      "@media (max-width: 600px)": {
                        flexBasis: "100%", // For small screens, 1 column
                      },
                    }}
                  >
                    <Timecard
                      origin={post.originName}
                      destination={post.destinationName}
                      availableSeats={
                        post.totalSeats -
                        post.usersInRide.length +
                        " of " +
                        post.totalSeats.toString() +
                        " seats available"
                      }
                      date={formatDateTime(post.arrivalTime.seconds)}
                      price={
                        "$" + (post.totalCost / post.totalSeats).toFixed(2).toString()
                      }
                      id={post.id}
                    />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Available Groups Section */}
            <Box
              sx={{
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
                marginTop: 6,
                backgroundColor: "white",
                borderRadius: "8px",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", marginBottom: 2 }}
              >
                Available Groups
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap", // Allow wrapping of items onto the next row
                  justifyContent: "space-between", // Distribute space evenly between items
                  marginTop: 2,
                  gap: 3, // Space between each Timecard
                  width: "100%",
                  maxWidth: "1200px", // Maximum width for the container
                  margin: "0 auto", // Center the grid container
                }}
              >
                {availableGroups.map((post, index) => (
                  <Box
                    key={index}
                    sx={{
                      flexBasis: "calc(33.33% - 20px)", // Ensure each item takes 1/3 of the width minus the gap
                      boxSizing: "border-box", // Include padding and margin in the element's total width and height
                      "@media (max-width: 900px)": {
                        flexBasis: "calc(50% - 20px)", // For medium screens, 2 columns
                      },
                      "@media (max-width: 600px)": {
                        flexBasis: "100%", // For small screens, 1 column
                      },
                    }}
                  >
                    <Timecard
                      origin={post.originName}
                      destination={post.destinationName}
                      availableSeats={
                        post.totalSeats -
                        post.usersInRide.length +
                        " of " +
                        post.totalSeats.toString() +
                        " seats available"
                      }
                      date={formatDateTime(post.arrivalTime.seconds)}
                      price={
                        "$" +
                        (post.totalCost / post.totalSeats).toFixed(2).toString()
                      }
                      id={post.id}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Page;
