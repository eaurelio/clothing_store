export interface TicketDB {
    id: string;
    user_id: string;
    type_id: number;
    description: string;
    status_id: number;
    solution?: string;
    analist_name?: string;
    analist_email?: string;
    user_name: string;
    user_email: string;
    user_phone_number: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface TicketDBOutput {
    id: string;
    user_id: string;
    type_id: number;
    type_name: string;
    description: string;
    status_id: number;
    status_name: string;
    solution?: string;
    analist_name?: string;
    analist_email?: string;
    name: string;
    email: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
  }

export enum TicketStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  RESOLVED = "Resolved",
  CANCELLED = "Cancelled"
}

export interface TicketStatusDB {
  id: number;
  status: string;
}

export enum TicketType {
  RESET_PASSWORD = 'reset_password',
  ORDER_ISSUE = 'order_issue',
  PRODUCT_PROBLEM = 'product_problem',
  ACCOUNT_ISSUE = 'account_issue',
  REFUND_REQUEST = 'refund_request',
  GENERAL_INQUIRY = 'general_inquiry'
}

export interface TicketTypeDB {
  id: number;
  type_name: string;
}

export class Ticket {
  constructor(
      private id: string,
      private userId: string,
      private typeId: number,
      private description: string,
      private statusId: number,
      private name: string,
      private email: string,
      private phoneNumber: string,
      private createdAt: string,
      private updatedAt: string
  ) {}

  getId(): string {
      return this.id;
  }

  setId(id: string): void {
      this.id = id;
  }

  getUserId(): string {
      return this.userId;
  }

  setUserId(userId: string): void {
      this.userId = userId;
  }

  getTypeId(): number {
      return this.typeId;
  }

  setTypeId(typeId: number): void {
      this.typeId = typeId;
  }

  getDescription(): string {
      return this.description;
  }

  setDescription(description: string): void {
      this.description = description;
  }

  getStatusId(): number {
      return this.statusId;
  }

  setStatusId(statusId: number): void {
      this.statusId = statusId;
  }

  getName(): string {
      return this.name;
  }

  setName(name: string): void {
      this.name = name;
  }

  getEmail(): string {
      return this.email;
  }

  setEmail(email: string): void {
      this.email = email;
  }

  getPhoneNumber(): string {
      return this.phoneNumber;
  }

  setPhoneNumber(phoneNumber: string): void {
      this.phoneNumber = phoneNumber;
  }

  getCreatedAt(): string {
      return this.createdAt;
  }

  setCreatedAt(createdAt: string): void {
      this.createdAt = createdAt;
  }

  getUpdatedAt(): string {
      return this.updatedAt;
  }

  setUpdatedAt(updatedAt: string): void {
      this.updatedAt = updatedAt;
  }
}
