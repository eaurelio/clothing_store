import z from 'zod';

export interface GetTicketInputDTO {
  ticketId: string;
}

export interface GetTicketOutputDTO {
  ticketId: string;
  userId: string;
  typeId: number;
  statusId: number;
  solution?: string;
  analist_name?: string;
  analist_email?: string;
  createdAt: string;
  updatedAt: string;
  description: string;
}

export const GetTicketSchema = z.object({
  ticketId: z.string()
}).transform(data => data as GetTicketInputDTO)

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
    description: string;
    solution?: string; 
    analistName?: string;
    analistEmail?: string;
  }>;
  total: number;
}


export const GetAllTicketsSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  typeId: z.number().optional(),
  statusId: z.number().optional(),
}).transform(data => data as GetAllTicketsInputDTO);
