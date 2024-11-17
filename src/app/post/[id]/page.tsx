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
  Paper,
  ThemeProvider,
  createTheme,
  LinearProgress,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  LocationOn,
  AccessTime,
  Group,
  AttachMoney,
  Notes,
  Person,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { PopulatedPostingObject } from "@/app/api/types/post";
import { api } from "@/utils/api";
import { useUserSession } from "@/hooks/useSession";
import Link from "next/link";

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
  const { firestoreId } = useUserSession(null);
  const [isLoading, setIsLoading] = useState(false);

  const [ridePost, setRidePost] = useState<PopulatedPostingObject | undefined>(
    undefined,
  );

  const isUserInRide = ridePost?.usersInRide.some(
    (user) => user.id === firestoreId,
  );

  const isUserOwner = ridePost?.owner.id === firestoreId;

  const handleJoinOrLeaveRide = async () => {
    setIsLoading(true);
    await api({
      method: "POST",
      url: `/api/post/join_or_leave`,
      body: {
        postId: params.id,
        userId: firestoreId,
      },
    });
    fetchRidePost();
    setIsLoading(false);
  };

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

  useEffect(() => {
    fetchRidePost();
  }, []); // Create theme with custom colors

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
                            
              {isLoading ? (
                <CircularProgress size={24} />
              ) : !isUserOwner ? (
                <Button
                  variant="contained"
                  color={isUserInRide ? "error" : "success"}
                  onClick={handleJoinOrLeaveRide}
                >
                                    {isUserInRide ? "Leave Ride" : "Join Ride"}
                                  
                </Button>
              ) : null}
                          
            </Box>
                        
            <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
                
              <Grid container spacing={2}>
                    {/* Origin and Destination */}
                    
                <Grid
                  item
                  xs={8}
                  sx={{ display: "flex", justifyContent: "flex-start" }}
                >
                        
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                            
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
                                        {ridePost.destinationLocation.latitude}
                          °N,               
                          {ridePost.destinationLocation.longitude}°W
                                      
                        </Typography>
                                  
                      </Box>
                              
                    </LocationWrapper>
                          
                  </Box>
                      
                </Grid>
                    {/* Passengers List */}
                    
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "left",
                    marginLeft: "-100px",
                  }}
                >
                        
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                            
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                
                      <Person sx={{ mr: 1 }} />
                                <Typography variant="h6">Passengers</Typography>
                              
                    </Box>
                            
                    <Box sx={{ mt: 2 }}>
                                
                      {ridePost.usersInRide.map((user) => (
                        <Typography
                          key={user.email}
                          variant="body1"
                          sx={{ mb: 0.5 }}
                        >
                                        {user.name || "Anonymous"}
                                      
                        </Typography>
                      ))}
                              
                    </Box>
                          
                  </Box>
                      
                </Grid>
                  
              </Grid>
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
            
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                
        {isUserOwner && (
          <Button
            sx={{ width: "7%", fontSize: "1.2rem", height: "50px" }}
            variant="contained"
            LinkComponent={Link}
            color="primary"
            href={`/post/create?postId=${params.id}`}
          >
                        Edit           
          </Button>
        )}
              
      </Box>
          
    </ThemeProvider>
  );
};

export default RideDetails;
