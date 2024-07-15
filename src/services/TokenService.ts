import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

class TokenService {
  private readonly secret: string;

  constructor() {
    this.secret = process.env.JWT_KEY as string;
    if (!this.secret) {
      throw new Error('JWT_KEY not found in environment variables');
    }
  }

  public generateToken(userId: string, role: string): string {
    try {
      const payload = {
        userId,
        role,
        createdAt: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 horas de validade
      };

      const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
      const signature = crypto.createHmac('sha256', this.secret).update(base64Payload).digest('base64');

      return `${base64Payload}.${signature}`;
    } catch (error) {
      console.error('Error generating token:', error);
      throw new Error('Token generation failed');
    }
  }

  public verifyToken(token: string): { userId: string, role: string } | null {
    try {
      const [base64Payload, signature] = token.split('.');

      const newSignature = crypto.createHmac('sha256', this.secret)
        .update(base64Payload)
        .digest('base64');

      if (newSignature !== signature) {
        throw new Error('Invalid token signature');
      }

      const decodedPayload = Buffer.from(base64Payload, 'base64').toString('utf-8');
      const payload = JSON.parse(decodedPayload);

      if (Date.now() > payload.expiresAt) {
        throw new Error('Token has expired');
      }

      return { userId: payload.userId, role: payload.role };
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }

  public getUserIdFromToken(token: string): string | null {
    try {
      const payload = this.verifyToken(token);
      if (!payload) {
        throw new Error('Invalid token');
      }

      return payload.userId;
    } catch (error) {
      console.error('Error getting userId from token:', error);
      return null;
    }
  }

  public getRoleFromToken(token: string): string | null {
    try {
      const payload = this.verifyToken(token);
      if (!payload) {
        throw new Error('Invalid token');
      }

      return payload.role;
    } catch (error) {
      console.error('Error getting role from token:', error);
      return null;
    }
  }
}

export default TokenService;
