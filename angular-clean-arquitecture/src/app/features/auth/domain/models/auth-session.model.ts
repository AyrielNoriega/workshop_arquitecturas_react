import { TokenPair } from './token-pair.model';
import { User } from './user.model';

export interface AuthSession extends TokenPair {
  user: User;
}
