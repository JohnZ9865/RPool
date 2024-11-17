import React from "react";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Face5Icon from "@mui/icons-material/Face5";
import Button from "@mui/material/Button";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

interface TimecardProps {
  origin: string;
  destination: string;
  availableSeats: string;
  date: string;
  time: string;
  price: string;
}

const Timecard: React.FC<TimecardProps> = ({
  origin,
  destination,
  availableSeats,
  date,
  time,
  price,
}) => {
  return (
    <div>
      <Box
        sx={{
          width: 300,
          height: 250,
          borderRadius: 8,
          bgcolor: "gold",
          border: "2px solid black",
          "&:hover": {
            bgcolor: "main",
            border: "2px solid black",
          },
        }}
      >
        <div
          style={{
            padding: "25px",
            color: "black",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          {origin + " --> " + destination}
        </div>
        <div>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "-25px",
            }}
          >
            <CalendarTodayIcon
              sx={{ padding: "20px", fontSize: 25, color: "black" }}
            />
            {date}
          </Box>
        </div>
        <div>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "-25px",
            }}
          >
            <AccessTimeIcon
              sx={{ padding: "20px", fontSize: 25, color: "black" }}
            />
            {time}
          </Box>
        </div>
        <div>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "-25px",
            }}
          >
            <Face5Icon sx={{ padding: "20px", fontSize: 25, color: "black" }} />
            {availableSeats}
          </Box>
          <Box sx={{ display: "inline-flex", alignItems: "center" }}>
            <Button
              variant="contained"
              sx={{ marginTop: "-20px", marginLeft: "20px" }}
            >
              View More
            </Button>
            <div
              style={{
                marginLeft: "40px",
                marginTop: "-20px",
                fontSize: 20,
                color: "black",
              }}
            >
              {price + "/seat"}
            </div>
          </Box>
        </div>
      </Box>
    </div>
  );
};

export default Timecard;
