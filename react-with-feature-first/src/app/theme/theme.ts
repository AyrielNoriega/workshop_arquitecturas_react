import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2563eb" },
    secondary: { main: "#7c3aed" },
    background: { default: "#f5f6f8" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "Avenir",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
  },
});
