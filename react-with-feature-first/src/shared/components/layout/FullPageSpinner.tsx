import { Box, CircularProgress } from "@mui/material";

export function FullPageSpinner() {
  return (
    <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
      <CircularProgress />
    </Box>
  );
}
