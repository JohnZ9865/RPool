"use client";

import React, { useEffect, useState } from "react";
import { Box, AppBar, Toolbar, Typography, IconButton, CircularProgress } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Link from "next/link";
import Timecard from "@/components/Timecard";
import { GetAllResponse } from "../api/post/getAll/route";
import { api } from "@/utils/api";

const Page = () => {
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
        url: "/api/post/getAll",
      });
      setPosts(posts);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllPostsData();
  }, []);

  // Filter current groups (posts where user is the owner)
  const currentGroups = posts.allPosts.filter((post) => 
    posts.userIsPassenger.includes(post.id)
  );

  // Filter available groups (posts where user is not the owner)
  const availableGroups = posts.allPosts.filter((post) => 
    !posts.userIsPassenger.includes(post.id)
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top Header with Gradient Background */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(to right, #1976d2, #FFEB3B)", 
          color: "white", 
          fontFamily: "'Roboto', sans-serif", 
          maxWidth: "1200px",  // Narrower width for the header
          margin: "0 auto",  // Center the header
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Title centered */}
          <Typography
            variant="h4"
            sx={{ textAlign: "center", fontWeight: "bold", flexGrow: 1 }}
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
              height: "100vh"  // Make sure the Box takes up full height
            }}
          >
            <CircularProgress />
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Loading posts...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Current Groups Section */}
            <Box
              sx={{
                width: "100%",
                maxWidth: "1200px",  // Limit the width to prevent overflow
                margin: "0 auto",  // Center the section
                marginTop: 4,
                backgroundColor: "white",  // Light blue color for sections
                borderRadius: "8px",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                Current Groups
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Responsive grid
                  gap: 3, 
                  marginTop: 2,
                }}
              >
                {currentGroups.map((post, index) => (
                  <Box key={index}>
                    <Timecard
                      origin={post.originName}
                      destination={post.destinationName}
                      availableSeats={post.totalSeats.toString()}
                      date={formatDateTime(post.arrivalTime.seconds)}
                      time={post.totalSeats.toString()}
                      price={"$" + (post.totalCost / post.totalSeats).toString()}
                    />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Available Groups Section */}
            <Box
              sx={{
                width: "100%",
                maxWidth: "1200px",  // Limit the width to prevent overflow
                margin: "0 auto",  // Center the section
                marginTop: 6,
                backgroundColor: "white",  
                borderRadius: "8px", 
                padding: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                Available Groups
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Responsive grid
                  gap: 3, 
                  marginTop: 2,
                }}
              >
                {availableGroups.map((post, index) => (
                  <Box key={index}>
                    <Timecard
                      origin={post.originName}
                      destination={post.destinationName}
                      availableSeats={post.totalSeats.toString()}
                      date={formatDateTime(post.arrivalTime.seconds)}
                      time={post.totalSeats.toString()}
                      price={"$" + (post.totalCost / post.totalSeats).toString()}
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
