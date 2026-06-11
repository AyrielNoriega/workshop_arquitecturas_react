import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLogout } from "../hooks/useLogout";

export function LogoutButton() {
  const logout = useLogout();

  return (
    <Button
      color="inherit"
      startIcon={<LogoutIcon />}
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
    >
      Salir
    </Button>
  );
}
