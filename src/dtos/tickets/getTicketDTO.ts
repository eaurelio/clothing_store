import z from 'zod';

export interface GetTicketInputDTO {
  ticketId: string;
}

export const GetTicketSchema = z.object({
  ticketId: z.string().uuid(),
}).transform(data => data as GetTicketInputDTO);

// ---------

export interface GetAllTicketsInputDTO {
  q?: string;
  onlyActive?: boolean;
}

export const GetAllTicketsSchema = z.object({
  q: z.string().optional(),
  onlyActive: z.boolean().optional()
}).transform(data => data as GetAllTicketsInputDTO);
