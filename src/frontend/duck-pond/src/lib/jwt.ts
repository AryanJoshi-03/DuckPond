import { jwtVerify } from 'jose';

const JWT_SECRET = "your_jwt_secret_key";
const JWT_ALGORITHM = "HS256";

export async function decodeJwt(token: string) {
  try {
    console.log('Attempting to decode token:', token);
    const secret = new TextEncoder().encode(JWT_SECRET);
    console.log('Secret encoded:', secret);
    
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [JWT_ALGORITHM],
      // Don't throw on expired tokens
      clockTolerance: 60 * 60 * 24 // 24 hours tolerance
    });
    
    console.log('Decoded payload:', payload);
    return payload;
  } catch (error: any) {
    console.error('Error decoding JWT:', error);
    // If the token is expired, we'll still return the payload
    if (error.name === 'JWTExpired') {
      try {
        // Split the token and decode the payload manually
        const [, payloadBase64] = token.split('.');
        const payload = JSON.parse(atob(payloadBase64));
        console.log('Decoded expired token payload:', payload);
        return payload;
      } catch (e) {
        console.error('Error decoding expired token:', e);
        return null;
      }
    }
    return null;
  }
}

export async function getTokenPayload() {
  try {
    let token: string | undefined;

    if (typeof window === 'undefined') {
      // Server-side: use cookies from the request
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
    } else {
      // Client-side: use document.cookie
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        acc[name] = decodeURIComponent(value);
        return acc;
      }, {} as Record<string, string>);
      token = cookies['token'];
    }

    if (!token) {
      console.log('No token found');
      return null;
    }

    return await decodeJwt(token);
  } catch (error) {
    console.error('Error getting token payload:', error);
    return null;
  }
} 