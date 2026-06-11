import { useMutation, useQueryClient } from "@tanstack/react-query";
import { container } from "../../../../core/di/container";
import { useAuth } from "../context/useAuth";

/**
 * Mutación de logout. Ejecuta el caso de uso (que borra la sesión persistida) y,
 * en éxito, limpia el estado de UI (AuthContext) y la caché de servidor (Query).
 */
export function useLogout() {
  const { clearSession } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => container.logoutUseCase.execute(),
    onSuccess: () => {
      clearSession();
      queryClient.clear();
    },
  });
}
