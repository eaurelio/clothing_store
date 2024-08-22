import z from 'zod';

export interface GetTicketInputDTO {
  ticketId: string;
}

export const GetTicketSchema = z.object({
  ticketId: z.string()
}).transform(data => data as GetTicketInputDTO);

export interface GetTicketOutputDTO {
  ticketId: string;
  userId: string;
  typeId: number;
  statusId: number;
  createdAt: string;
  updatedAt: string;
  description: string; // Exemplo de campo adicional
}

// ---------

export interface GetAllTicketsInputDTO {
    id?: string,
    userId?: string,
    typeId?: number,
    statusId?: number
}

export interface GetAllTicketsOutputDTO {
  tickets: Array<{
    ticketId: string;
    userId: string;
    typeId: number;
    statusId: number;
    createdAt: string;
    updatedAt: string;
    description: string; // Exemplo de campo adicional
  }>;
  total: number; // Total de tickets retornados
}

export const GetAllTicketsSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  typeId: z.string().optional(),
  statusId: z.string().optional(),
}).transform(data => data as GetAllTicketsInputDTO);
