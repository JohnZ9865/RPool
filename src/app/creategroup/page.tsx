"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Paper,
  ThemeProvider,
  createTheme,
  TextField,
  Button,
  InputAdornment,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  LocationOn,
  AccessTime,
  AttachMoney,
  Notes,
  Save,
  Cancel,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Create custom styled components
const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const LocationWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
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

const EditRideDetails = () => {
  // Initial data
  const initialRideData: RideData = {
    title: "SF to LA",
    originLocation: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    destinationLocation: {
      latitude: 34.0522,
      longitude: -118.2437,
    },
    departureTime: {
      seconds: 1710954000,
    },
    arrivalTime: {
      seconds: 1710975600,
    },
    totalCost: 45,
    totalSeats: 4,
    notes: "Direct route, 2 stops for breaks",
  };

  const [rideData, setRideData] = useState<RideData>(initialRideData);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would typically make an API call to update the ride
      // await updateRide(rideData);
      setShowSuccess(true);
    } catch (error) {
      setShowError(true);
    }
  };

  const handleLocationChange = (
    type: "origin" | "destination",
    coord: "latitude" | "longitude",
    value: string,
  ) => {
    const numValue = parseFloat(value) || 0;
    setRideData((prev) => ({
      ...prev,
      [`${type}Location`]: {
        ...prev[`${type}Location`],
        [coord]: numValue,
      },
    }));
  };

  const formatDateTimeForInput = (seconds: number) => {
    const date = new Date(seconds * 1000);
    return date.toISOString().slice(0, 16); // Format: "YYYY-MM-DDThh:mm"
  };

  const handleDateTimeChange = (
    type: "departure" | "arrival",
    value: string,
  ) => {
    const date = new Date(value);
    setRideData((prev) => ({
      ...prev,
      [`${type}Time`]: {
        seconds: Math.floor(date.getTime() / 1000),
      },
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 800, margin: "auto", p: 2 }}>
        <form onSubmit={handleSubmit}>
          <Card elevation={3}>
            <CardContent>
              {/* Header */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Ride Title"
                  value={rideData.title}
                  onChange={(e) =>
                    setRideData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Total Seats"
                  type="number"
                  value={rideData.totalSeats}
                  onChange={(e) =>
                    setRideData((prev) => ({
                      ...prev,
                      totalSeats: parseInt(e.target.value) || 0,
                    }))
                  }
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                />
              </Box>

              {/* Locations */}
              <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
                <LocationWrapper>
                  <LocationOn color="success" sx={{ mt: 2 }} />
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Departure Location
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Latitude"
                          type="number"
                          value={rideData.originLocation.latitude}
                          onChange={(e) =>
                            handleLocationChange(
                              "origin",
                              "latitude",
                              e.target.value,
                            )
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">°N</InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Longitude"
                          type="number"
                          value={rideData.originLocation.longitude}
                          onChange={(e) =>
                            handleLocationChange(
                              "origin",
                              "longitude",
                              e.target.value,
                            )
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">°W</InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </LocationWrapper>

                <LocationWrapper>
                  <LocationOn color="error" sx={{ mt: 2 }} />
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Destination Location
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Latitude"
                          type="number"
                          value={rideData.destinationLocation.latitude}
                          onChange={(e) =>
                            handleLocationChange(
                              "destination",
                              "latitude",
                              e.target.value,
                            )
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">°N</InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Longitude"
                          type="number"
                          value={rideData.destinationLocation.longitude}
                          onChange={(e) =>
                            handleLocationChange(
                              "destination",
                              "longitude",
                              e.target.value,
                            )
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">°W</InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </LocationWrapper>
              </Paper>

              {/* Time */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <IconWrapper>
                    <AccessTime color="action" />
                    <TextField
                      fullWidth
                      label="Departure Time"
                      type="datetime-local"
                      value={formatDateTimeForInput(
                        rideData.departureTime.seconds,
                      )}
                      onChange={(e) =>
                        handleDateTimeChange("departure", e.target.value)
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </IconWrapper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <IconWrapper>
                    <AccessTime color="action" />
                    <TextField
                      fullWidth
                      label="Arrival Time"
                      type="datetime-local"
                      value={formatDateTimeForInput(
                        rideData.arrivalTime.seconds,
                      )}
                      onChange={(e) =>
                        handleDateTimeChange("arrival", e.target.value)
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </IconWrapper>
                </Grid>
              </Grid>

              {/* Cost */}
              <IconWrapper>
                <AttachMoney color="action" />
                <TextField
                  fullWidth
                  label="Total Cost"
                  type="number"
                  value={rideData.totalCost}
                  onChange={(e) =>
                    setRideData((prev) => ({
                      ...prev,
                      totalCost: parseInt(e.target.value) || 0,
                    }))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                    inputProps: { min: 0 },
                  }}
                />
              </IconWrapper>

              {/* Notes */}
              <IconWrapper>
                <Notes color="action" />
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={4}
                  value={rideData.notes}
                  onChange={(e) =>
                    setRideData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                />
              </IconWrapper>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 3,
                }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<Cancel />}
                  onClick={() => setRideData(initialRideData)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                >
                  Save Changes
                </Button>
              </Box>
            </CardContent>
          </Card>
        </form>

        {/* Success/Error Notifications */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
        >
          <Alert severity="success" onClose={() => setShowSuccess(false)}>
            Ride details updated successfully!
          </Alert>
        </Snackbar>

        <Snackbar
          open={showError}
          autoHideDuration={6000}
          onClose={() => setShowError(false)}
        >
          <Alert severity="error" onClose={() => setShowError(false)}>
            Error updating ride details. Please try again.
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default EditRideDetails;
