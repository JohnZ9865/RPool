'use client';

import React, { useEffect, useState } from "react";
import { Box, AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Link from "next/link";
import Timecard from "@/components/Timecard";
import { GetAllResponse } from "../api/post/getAll/route";
import { api } from "@/utils/api";

const origin = "UCR";
const destination = "Ontario";
const availableSeats = "3/5 seats available";
const date = "12/20/2024";
const time = "5:00 PM PST";
const price = "$30";

const Page = () => {
  const [posts, setPosts] = useState<GetAllResponse>({
    allPosts: [],
    userIsPassenger: [],
    message: "",
  });

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
  }

  useEffect(() => {
    getAllPostsData();
  }, []);

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
          sx={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          {/* Title centered with larger font size */}
          <Typography
            variant="h4"
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            R' Pool
          </Typography>

          {/* Profile Icon linking to account page */}
          <Link href="/account" passHref>
            <IconButton sx={{ color: "white", ml: 2 }} aria-label="account">
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
          alignItems: "center",
        }}
      >
        {}
        <Timecard
          origin={origin}
          destination={destination}
          availableSeats={availableSeats}
          date={date}
          time={time}
          price={price}
        />
      </Box>
    </Box>
  );
};

export default Page;
