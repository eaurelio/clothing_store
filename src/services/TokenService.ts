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

  public generateToken(userId: string): string {
    try {
      const payload = {
        userId,
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

  public verifyToken(token: string): string | null {
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

      return decodedPayload;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }

  public getUserIdFromToken(token: string): string | null {
    try {
      const decodedPayload = this.verifyToken(token);
      if (!decodedPayload) {
        throw new Error('Invalid token');
      }

      const payload = JSON.parse(decodedPayload);
      return payload.userId;
    } catch (error) {
      console.error('Error getting userId from token:', error);
      return null;
    }
  }
}

export default TokenService;
