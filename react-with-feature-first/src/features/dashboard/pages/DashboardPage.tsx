import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useAuth } from "../../auth";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <Stack spacing={2}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Dashboard
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            ¡Hola, {user?.firstName}! Sesión iniciada como{" "}
            <strong>{user?.email}</strong>.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
