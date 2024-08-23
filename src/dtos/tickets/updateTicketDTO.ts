import z from 'zod';

export interface UpdateTicketInputDTO {
    ticketId: string;
    type_id?: number;
    solution?: string;
    status_id?: number;
    analist_name?: string;
    analist_email?: string;
}

export interface UpdateTicketOutputDTO {
    message: string;
    ticket: {
        id: string;
        user_id: string;
        type_id: number;
        description: string;
        solution?: string;
        status_id: number;
        user_name: string;
        user_email: string;
        user_phone_number: string;
        analist_name?: string;
        analist_email?: string;
        created_at: string;
        updated_at: string;
    };
}

export const UpdateTicketSchema = z.object({
    ticketId: z.string(),
    type_id: z.number().int().positive().optional(),
    solution: z.string().optional(),
    status_id: z.number().int().positive().optional(),
    analist_name: z.string().optional(),
    analist_email: z.string().email().optional()
}).transform(data => data as UpdateTicketInputDTO);
