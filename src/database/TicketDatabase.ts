import { BaseDatabase } from "./connection/BaseDatabase";
import { TicketDB, TicketDBOutput } from "../models/Ticket";
import { TicketStatusDB, TicketTypeDB } from "../models/Ticket";

export class TicketDatabase extends BaseDatabase {
  public static TABLE_TICKETS = "tickets";
  public static TABLE_TICKET_STATUS = "ticket_status";
  public static TABLE_TICKET_TYPES = "ticket_types";

  public async findTickets(
    id?: string,
    userId?: string,
    typeId?: number,
    statusId?: number
  ): Promise<TicketDBOutput[]> {
    const conditions: string[] = [];
    const params: any[] = [];

    if (id) {
      conditions.push("tickets.id = ?");
      params.push(id);
    }

    if (userId) {
      conditions.push("tickets.user_id = ?");
      params.push(userId);
    }

    if (typeId) {
      conditions.push("tickets.type_id = ?");
      params.push(typeId);
    }

    if (statusId) {
      conditions.push("tickets.status_id = ?");
      params.push(statusId);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await BaseDatabase.connection.raw(
      `
      SELECT 
        tickets.id,
        tickets.user_id,
        tickets.type_id,
        ticket_types.type_name,
        tickets.description,
        tickets.status_id,
        ticket_status.status AS status_name,
        tickets.user_name,
        tickets.user_email,
        tickets.user_phone_number,
        tickets.created_at,
        tickets.updated_at,
        tickets.solution,
        tickets.analist_name,
        tickets.analist_email
      FROM ${TicketDatabase.TABLE_TICKETS} tickets
      LEFT JOIN ticket_types
        ON tickets.type_id = ticket_types.id
      LEFT JOIN ticket_status
        ON tickets.status_id = ticket_status.id
      ${whereClause}
    `,
      params
    );

    return result.rows;
  }

  public async findTicketById(id: string): Promise<TicketDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT 
        tickets.id,
        tickets.user_id,
        tickets.type_id,
        ticket_types.type_name,
        tickets.description,
        tickets.status_id,
        ticket_status.status AS status_name,
        tickets.user_name,
        tickets.user_email,
        tickets.user_phone_number,
        tickets.created_at,
        tickets.updated_at,
        tickets.solution,
        tickets.analist_name,
        tickets.analist_email
      FROM ${TicketDatabase.TABLE_TICKETS} tickets
      LEFT JOIN ticket_types
        ON tickets.type_id = ticket_types.id
      LEFT JOIN ticket_status
        ON tickets.status_id = ticket_status.id
      WHERE tickets.id = ?
    `,
      [id]
    );

    return result.rows[0];
  }

  public async insertTicket(newTicketDB: TicketDB): Promise<void> {
    const columns = Object.keys(newTicketDB).filter(
      (key) => key !== "created_at" && key !== "updated_at"
    );
    const placeholders = columns.map(() => "?").join(", ");
    const values = columns.map((key) => newTicketDB[key as keyof TicketDB]);

    const query = `
      INSERT INTO ${TicketDatabase.TABLE_TICKETS} (${columns.join(", ")})
      VALUES (${placeholders})
    `;

    await BaseDatabase.connection.raw(query, values);
  }

  public async updateTicket(input: any) {
    const { id, type_id, solution, status_id, analist_name, analist_email } =
      input;

    await BaseDatabase.connection.raw(
      `
      UPDATE tickets
      SET 
          type_id = COALESCE(?, type_id),
          solution = COALESCE(?, solution),
          status_id = COALESCE(?, status_id),
          analist_name = COALESCE(?, analist_name),
          analist_email = COALESCE(?, analist_email),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        type_id ?? null,
        solution ?? null,
        status_id ?? null,
        analist_name ?? null,
        analist_email ?? null,
        id,
      ]
    );
  }

  public async getAllStatus(): Promise<TicketStatusDB[]> {
    const result = await BaseDatabase.connection.raw(`
      SELECT *
      FROM ${TicketDatabase.TABLE_TICKET_STATUS}
    `);

    return result.rows;
  }

  public async getAllTypes(): Promise<TicketTypeDB[]> {
    const result = await BaseDatabase.connection.raw(`
      SELECT *
      FROM ${TicketDatabase.TABLE_TICKET_TYPES}
    `);

    return result.rows;
  }
}
