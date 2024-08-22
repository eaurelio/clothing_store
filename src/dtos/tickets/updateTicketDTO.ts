import z from 'zod';

export interface UpdateTicketInputDTO {
    ticketId: string;
    type_id?: number;
    description?: string;
    status_id?: number;
    name?: string;
    email?: string;
    phone_number?: string;
}

export interface UpdateTicketOutputDTO {
  message: string;
  ticket: {
      id: string;
      user_id: string;
      type_id: number;
      description: string;
      status_id: number;
      name: string;
      email: string;
      phone_number: string;
      created_at: string;
      updated_at: string;
  };
}


export const UpdateTicketSchema = z.object({
    ticketId: z.string().uuid(),
    type_id: z.number().int().positive().optional(),
    description: z.string().optional(),
    status_id: z.number().int().positive().optional(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone_number: z.string().optional()
}).transform(data => data as UpdateTicketInputDTO);
