export interface PhoneDB {
  phone_id: string;
  user_id: string;
  number: string;
  type: string;
}

export interface PhoneDBOutput {
  phone_id: string;
  user_id: string;
  number: string;
  type: string;
}

export class Phone {
  constructor(
      private phoneId: string,
      private userId: string,
      private number: string,
      private type: string
  ) {}

  getPhoneId(): string {
      return this.phoneId;
  }

  setPhoneId(phoneId: string): void {
      this.phoneId = phoneId;
  }

  getUserId(): string {
      return this.userId;
  }

  setUserId(userId: string): void {
      this.userId = userId;
  }

  getNumber(): string {
      return this.number;
  }

  setNumber(number: string): void {
      this.number = number;
  }

  getType(): string {
      return this.type;
  }

  setType(type: string): void {
      this.type = type;
  }
}
