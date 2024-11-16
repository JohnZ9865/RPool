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
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  Group,
  AttachMoney,
  Notes
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { POST_COLLECTION } from "@/app/api/types/post";

// Create custom styled components
const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const LocationWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

// Define types for the ride data
interface RideData {
  title: string;
  originLocation: {
    latitude: number;
    longitude: number;
  };
  destinationLocation: {
    latitude: number;
    longitude: number;
  };
  departureTime: {
    seconds: number;
  };
  arrivalTime: {
    seconds: number;
  };
  totalCost: number;
  totalSeats: number;
  notes: string;
}



const RideDetails = ({rideId}) => {
  const rideData: RideData = {
    title: "SF to LA",
    originLocation: {
      latitude: 37.7749,
      longitude: -122.4194
    },
    destinationLocation: {
      latitude: 34.0522,
      longitude: -118.2437
    },
    departureTime: {
      seconds: 1710954000
    },
    arrivalTime: {
      seconds: 1710975600
    },
    totalCost: 45,
    totalSeats: 4,
    notes: "Direct route, 2 stops for breaks"
  };


  // Create theme with custom colors
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  const formatDateTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 800, margin: 'auto', p: 2 }}>
        <Card elevation={3}>
          <CardContent>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {rideData.title}
              </Typography>
              <Chip
                icon={<Group />}
                label={`${rideData.totalSeats} seats total`}
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
                    Departure
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    San Francisco
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {rideData.originLocation.latitude}°N, {rideData.originLocation.longitude}°W
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
                    Los Angeles
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {rideData.destinationLocation.latitude}°N, {rideData.destinationLocation.longitude}°W
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
                      {formatDateTime(rideData.departureTime.seconds)}
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
                      {formatDateTime(rideData.arrivalTime.seconds)}
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
                  ${rideData.totalCost}
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
                  {rideData.notes}
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
