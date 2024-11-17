"use client";

import React, { useState, useRef, useEffect } from "react";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
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
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  LocationOn,
  AccessTime,
  Notes,
  Save,
  Cancel,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Library } from "@googlemaps/js-api-loader";
import dayjs from "dayjs";
import { api } from "@/utils/api";
import { ExpectedInputAddPostInput } from "../api/post/add/route";
import { useUserSession } from "@/hooks/useSession";
import { ServiceSummary } from "../api/types/uber";
import {
  EstimationExpectedInput,
  EstimationExpectedOutput,
} from "../api/estimation/route";
import { useRouter } from "next/navigation";

const libraries: Library[] = ["places"];

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

interface ForState {
  title?: string;
  totalSeats?: number;
  originLocation?: {
    latitude: number;
    longitude: number;
    name: string;
  };
  destinationLocation?: {
    latitude: number;
    longitude: number;
    name: string;
  };
  departureTime?: Date;
  arrivalTime?: Date;
  notes?: string;
}

const initialData: ForState = {
  title: "",
  departureTime: dayjs().toDate(),
  arrivalTime: dayjs().add(1, "hour").toDate(),
  notes: "",
};
const EditRideDetails = () => {
  // Initial data
  const { firestoreId } = useUserSession(null);
  const [formState, setFormState] = useState<ForState>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [costEstimate, setCostEstimate] = useState<ServiceSummary[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const router = useRouter();

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

  const getCostEstimate = async () => {
    if (!formState.originLocation || !formState.destinationLocation) {
      return;
    }
    try {
      const estimationInput: EstimationExpectedInput = {
        originLocation: {
          latitude: formState.originLocation.latitude,
          longitude: formState.originLocation.longitude,
        },
        destinationLocation: {
          latitude: formState.destinationLocation.latitude,
          longitude: formState.destinationLocation.longitude,
        },
      };
      const response = await api({
        method: "POST",
        url: "/api/estimation",
        body: estimationInput,
      });
      setCostEstimate(response.serviceSummaries);
    } catch (error) {
      console.error("Error getting cost estimate", error);
    }
  };

  useEffect(() => {
    // check if the longitude of the latitude have changed
    if (formState.originLocation && formState.destinationLocation) {
      getCostEstimate();
    }
  }, [formState.originLocation, formState.destinationLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const costSelected = costEstimate.find(
        (serviceSummary) => serviceSummary.name === selectedService,
      );
      const dateToSend: ExpectedInputAddPostInput = {
        ownerId: firestoreId,
        title: formState.title,
        originLocation: formState.originLocation,
        originName: formState.originLocation.name,
        destinationLocation: formState.destinationLocation,
        destinationName: formState.destinationLocation.name,
        departureTime: formState.departureTime.toISOString(),
        arrivalTime: formState.arrivalTime.toISOString(),
        totalCost: costSelected?.pricing.totalFare || 0,
        totalSeats: formState.totalSeats,
        notes: formState.notes,
      };
      await api({
        method: "POST",
        url: "/api/post/add",
        body: dateToSend,
      });
      setShowSuccess(true);
      router.push("/home");
    } catch (error) {
      setShowError(true);
    }
    setIsSaving(false);
  };

  const handleSelectPlace = (
    type: "origin" | "destination",
    place: google.maps.places.PlaceResult | null,
  ) => {
    if (place && place.geometry) {
      const location = place.geometry.location;
      const id = type === "origin" ? "originLocation" : "destinationLocation";
      setFormState((prev) => ({
        ...prev,
        [id]: {
          latitude: location.lat(),
          longitude: location.lng(),
          name: place.name,
        },
      }));
    }
  };

  const formatDateTimeForInput = (date: Date) => {
    return date.toISOString().slice(0, 16); // Format: "YYYY-MM-DDThh:mm"
  };

  const handleChangeDateTime = (type: "departure" | "arrival", value: Date) => {
    const id = type === "departure" ? "departureTime" : "arrivalTime";
    setFormState((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const originRef = useRef<google.maps.places.SearchBox | null>(null);
  const destinationRef = useRef<google.maps.places.SearchBox | null>(null);

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
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
                    value={formState.title}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Total Seats"
                    type="number"
                    value={formState.totalSeats}
                    onChange={(e) =>
                      setFormState((prev) => ({
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
                      <StandaloneSearchBox
                        onLoad={(ref) => (originRef.current = ref)}
                        onPlacesChanged={() => {
                          const places = originRef.current?.getPlaces();
                          if (places && places.length > 0) {
                            handleSelectPlace("origin", places[0]);
                          }
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Search for a place"
                          variant="outlined"
                        />
                      </StandaloneSearchBox>
                    </Box>
                  </LocationWrapper>

                  <LocationWrapper>
                    <LocationOn color="error" sx={{ mt: 2 }} />
                    <Box sx={{ width: "100%" }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Destination Location
                      </Typography>
                      <StandaloneSearchBox
                        onLoad={(ref) => (destinationRef.current = ref)}
                        onPlacesChanged={() => {
                          const places = destinationRef.current?.getPlaces();
                          if (places && places.length > 0) {
                            handleSelectPlace("destination", places[0]);
                          }
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Search for a place"
                          variant="outlined"
                        />
                      </StandaloneSearchBox>
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
                        value={formatDateTimeForInput(formState.departureTime)}
                        onChange={(e) => {
                          handleChangeDateTime(
                            "departure",
                            new Date(e.target.value),
                          );
                        }}
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
                        value={formatDateTimeForInput(formState.arrivalTime)}
                        onChange={(e) =>
                          handleChangeDateTime(
                            "arrival",
                            new Date(e.target.value),
                          )
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </IconWrapper>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Available Ride Options
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                    }}
                  >
                    {costEstimate?.map((serviceSummary) => (
                      <Card
                        sx={{
                          flex: 1,
                          minWidth: { xs: "100%", sm: "150px" },
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out",
                          transform:
                            selectedService === serviceSummary.name
                              ? "scale(1.02)"
                              : "scale(1)",
                          border:
                            selectedService === serviceSummary.name
                              ? "2px solid #1976d2"
                              : "1px solid #e0e0e0",
                          "&:hover": {
                            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                            transform: "scale(1.02)",
                          },
                        }}
                        key={serviceSummary.name}
                        onClick={() => setSelectedService(serviceSummary.name)}
                        elevation={
                          selectedService === serviceSummary.name ? 4 : 1
                        }
                      >
                        <CardContent
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            p: 3,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              mb: 2,
                              color:
                                selectedService === serviceSummary.name
                                  ? "primary.main"
                                  : "text.primary",
                              fontWeight: 600,
                            }}
                          >
                            {serviceSummary.name}
                          </Typography>

                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: "bold",
                              color:
                                selectedService === serviceSummary.name
                                  ? "primary.main"
                                  : "text.primary",
                            }}
                          >
                            ${serviceSummary.pricing.totalFare}
                          </Typography>

                          {selectedService === serviceSummary.name && (
                            <Box
                              sx={{
                                mt: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "primary.main",
                              }}
                            >
                              <Typography variant="body2">
                                ✓ Selected
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>

                {/* Notes */}
                <IconWrapper>
                  <Notes color="action" />
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={4}
                    value={formState.notes}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
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
                    onClick={() => setFormState(initialData)}
                    href="/home"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isSaving}
                    startIcon={<Save />}
                  >
                    {isSaving ? <CircularProgress /> : "Save Changes"}
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
    </LoadScript>
  );
};

export default EditRideDetails;
