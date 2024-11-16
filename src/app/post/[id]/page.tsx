"use client";

import { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Paper,
  ThemeProvider,
  createTheme,
  LinearProgress,
} from "@mui/material";
import {
  LocationOn,
  AccessTime,
  Group,
  AttachMoney,
  Notes,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { PopulatedPostingObject, POST_COLLECTION } from "@/app/api/types/post";
import { api } from "@/utils/api";

// Create custom styled components
const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const LocationWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const RideDetails = ({ params }: { params: { id: string } }) => {
  console.log(params);
  const [ridePost, setRidePost] = useState<PopulatedPostingObject | undefined>(
    undefined,
  );

  const fetchRidePost = async () => {
    try {
      const ridePost = await api({
        method: "GET",
        url: `/api/post/${params.id}`,
      });
      setRidePost(ridePost.postDoc);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(ridePost);

  useEffect(() => {
    fetchRidePost();
  }, []);

  // Create theme with custom colors
  const theme = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
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

  if (!ridePost) {
    return <LinearProgress />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 800, margin: "auto", p: 2 }}>
        <Card elevation={3}>
          <CardContent>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom>
                {ridePost.title}
              </Typography>
              <Chip
                icon={<Group />}
                label={`${ridePost.totalSeats} seats total`}
                color="primary"
                variant="outlined"
              />
            </Box>

            {/* Locations */}
            <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
              <LocationWrapper>
                <LocationOn color="success" />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Origin
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {ridePost.originName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {ridePost.originLocation.latitude}°N,{" "}
                    {ridePost.originLocation.longitude}°W
                  </Typography>
                </Box>
              </LocationWrapper>

              <LocationWrapper>
                <LocationOn color="error" />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Destination
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {ridePost.destinationName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {ridePost.destinationLocation.latitude}°N,{" "}
                    {ridePost.destinationLocation.longitude}°W
                  </Typography>
                </Box>
              </LocationWrapper>
            </Paper>

            {/* Time and Cost */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <IconWrapper>
                  <AccessTime color="action" />
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Departure
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDateTime(ridePost.departureTime.seconds)}
                    </Typography>
                  </Box>
                </IconWrapper>
              </Grid>
              <Grid item xs={12} md={6}>
                <IconWrapper>
                  <AccessTime color="action" />
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Arrival
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDateTime(ridePost.arrivalTime.seconds)}
                    </Typography>
                  </Box>
                </IconWrapper>
              </Grid>
            </Grid>

            {/* Cost */}
            <IconWrapper>
              <AttachMoney color="action" />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Cost
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  ${ridePost.totalCost}
                </Typography>
              </Box>
            </IconWrapper>

            {/* Notes */}
            <IconWrapper>
              <Notes color="action" />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Notes
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {ridePost.notes}
                </Typography>
              </Box>
            </IconWrapper>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default RideDetails;

// const Home = ({ params }: { params: { id: string } }) => {
//   console.log(params);
//   const [name, setName] = useState("");
//
//   return (
//     <div className="flex h-screen w-full flex-col items-center justify-center">
//       {params.id}
//     </div>
//   );
// };
//
// export default Home;
