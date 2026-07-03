import { LoginResponseDto } from '../dtos/login-response.dto';
import { toAuthSession, toTokenPair, toUser } from './auth.mapper';

const loginResponse: LoginResponseDto = {
  id: 1,
  username: 'emilys',
  email: 'emily.johnson@x.dummyjson.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  gender: 'female',
  image: 'https://dummyjson.com/icon/emilys/128',
  accessToken: 'access-123',
  refreshToken: 'refresh-456',
};

describe('auth.mapper', () => {
  it('toUser extrae solo los campos del dominio', () => {
    const user = toUser(loginResponse);
    expect(user).toEqual({
      id: 1,
      username: 'emilys',
      email: 'emily.johnson@x.dummyjson.com',
      firstName: 'Emily',
      lastName: 'Johnson',
      gender: 'female',
      image: 'https://dummyjson.com/icon/emilys/128',
    });
    // El modelo de dominio no arrastra los tokens del DTO plano.
    expect('accessToken' in user).toBe(false);
  });

  it('toTokenPair mapea los tokens', () => {
    expect(toTokenPair(loginResponse)).toEqual({
      accessToken: 'access-123',
      refreshToken: 'refresh-456',
    });
  });

  it('toAuthSession compone tokens + usuario', () => {
    const session = toAuthSession(loginResponse);
    expect(session.accessToken).toBe('access-123');
    expect(session.refreshToken).toBe('refresh-456');
    expect(session.user.username).toBe('emilys');
  });
});
