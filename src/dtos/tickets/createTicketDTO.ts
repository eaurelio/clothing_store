import { TicketStatus, TicketType } from '../../models/Ticket';
import z from 'zod';

export interface CreateTicketInputDTO {
    user_id: string;
    type_id: number;
    description: string;
    status_id: number;
    name: string;
    email: string;
    phone_number: string;
}

export interface CreateTicketOutputDTO {
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

export const CreateTicketSchema = z.object({
    user_id: z.string().min(1),
    type_id: z.number().int().positive(),
    description: z.string().min(1),
    status_id: z.number().int().positive(),
    name: z.string().min(1),
    email: z.string().email(),
    phone_number: z.string().min(1)
}).transform(data => data as CreateTicketInputDTO);
