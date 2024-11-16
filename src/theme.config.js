import { createTheme } from "@mui/material/styles";

const customColors = {
  primary: {},

  background: {
    blue: "#3e94c9", // Blue
    yellow: "#e3c129", // Yellow
  },
  text: {
    primary: "#212121",
  },
};

const theme = createTheme({
  palette: {
    primary: customColors.primary,
    secondary: customColors.secondary,
    background: customColors.background,
    text: customColors.text,
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default theme;
