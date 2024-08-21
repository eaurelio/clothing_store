import crypto from 'crypto';

class TokenService {
  private readonly secret: string;
  private readonly expirationDays: number;

  constructor() {
    this.secret = process.env.JWT_KEY as string;
    if (!this.secret) {
      throw new Error('JWT_KEY not found in environment variables');
    }

    const expirationDaysEnv = process.env.TOKEN_EXPIRATION_DAYS;
    this.expirationDays = expirationDaysEnv ? parseInt(expirationDaysEnv, 10) : 7; // Default to 7 days if not specified
  }

  public generateToken(userId: string, role: string): string {
    try {
      const now = new Date();
      now.setDate(now.getDate() + this.expirationDays);
      const expiresAt = now.getTime();

      const payload = {
        userId,
        role,
        createdAt: Date.now(),
        expiresAt
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
}

export default TokenService;

