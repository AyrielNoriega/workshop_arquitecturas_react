import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/useAuth";
import { authService } from "../services/auth.service";

export function useLogout() {
  const { clearSession } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearSession();
      queryClient.clear();
    },
  });
}
