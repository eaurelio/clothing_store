import { TicketStatus, TicketType } from '../../models/Ticket';
import z from 'zod';

export interface CreateTicketInputDTO {
    userId: string;
    typeId: number;
    description: string;
    statusId: number;
    userName: string;
    userEmail: string;
    userPhoneNumber: string;
}

export interface CreateTicketOutputDTO {
    message: string;
    ticket: {
        id: string;
        user_id: string;
        type_id: number;
        description: string;
        status_id: number;
        user_name: string;
        user_email: string;
        user_phone_number: string;
        created_at: string;
        updated_at: string;
    };
}

export const CreateTicketSchema = z.object({
    userId: z.string().min(1),
    typeId: z.number().int(),
    description: z.string().min(5),
    statusId: z.number().int(),
    userName: z.string().min(1),
    userEmail: z.string().email(),
    userPhoneNumber: z.string().min(1)
}).transform(data => data as CreateTicketInputDTO);