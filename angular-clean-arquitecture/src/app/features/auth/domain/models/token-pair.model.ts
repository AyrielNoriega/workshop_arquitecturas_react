/** Par de tokens devuelto por login y refresh. El refresh NO devuelve el usuario. */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
