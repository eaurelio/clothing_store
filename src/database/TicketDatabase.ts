import { BaseDatabase } from "./connection/BaseDatabase";
import { TicketDB } from "../models/Ticket";
import { TicketStatusDB, TicketTypeDB } from "../models/Ticket";

export class TicketDatabase extends BaseDatabase {
  public static TABLE_TICKETS = "tickets";
  public static TABLE_TICKET_STATUS = "ticket_status";
  public static TABLE_TICKET_TYPES = "ticket_types";

  // TICKET DATA

  public async findTickets(
    id?: string,
    userId?: string,
    typeId?: number,
    statusId?: number
  ): Promise<TicketDB[]> {
    let conditions: string[] = [];
    let params: any[] = [];

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
        ticket_types.type_name AS type_name,
        tickets.description,
        tickets.status_id,
        ticket_status.status AS status_name,
        tickets.name,
        tickets.email,
        tickets.phone_number,
        tickets.created_at,
        tickets.updated_at
      FROM ${TicketDatabase.TABLE_TICKETS} tickets
      LEFT JOIN ${TicketDatabase.TABLE_TICKET_TYPES} ticket_types
        ON tickets.type_id = ticket_types.id
      LEFT JOIN ${TicketDatabase.TABLE_TICKET_STATUS} ticket_status
        ON tickets.status_id = ticket_status.id
      ${whereClause}
    `,
      params
    );

    return result.rows;
  }

  // --------------------------------------------------------------------

  public async findTicketById(id: string): Promise<TicketDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT 
        tickets.id,
        tickets.user_id,
        tickets.type_id,
        ticket_types.type_name AS type_name,
        tickets.description,
        tickets.status_id,
        ticket_status.status AS status_name,
        tickets.name,
        tickets.email,
        tickets.phone_number,
        tickets.created_at,
        tickets.updated_at
      FROM ${TicketDatabase.TABLE_TICKETS} tickets
      LEFT JOIN ${TicketDatabase.TABLE_TICKET_TYPES} ticket_types
        ON tickets.type_id = ticket_types.id
      LEFT JOIN ${TicketDatabase.TABLE_TICKET_STATUS} ticket_status
        ON tickets.status_id = ticket_status.id
      WHERE tickets.id = ?
    `,
      [id]
    );

    return result.rows[0];
  }

  // --------------------------------------------------------------------

  // --------------------------------------------------------------------

  public async insertTicket(newTicketDB: TicketDB): Promise<void> {
    const columns = Object.keys(newTicketDB).filter(
      (key) => key !== 'created_at' && key !== 'updated_at'
    );
    const placeholders = columns.map(() => "?").join(", ");
    const values = columns.map((key) => newTicketDB[key as keyof TicketDB]);

    const query = `
      INSERT INTO ${TicketDatabase.TABLE_TICKETS} (${columns.join(", ")})
      VALUES (${placeholders})
    `;

    await BaseDatabase.connection.raw(query, values);
  }

  // --------------------------------------------------------------------

  public async updateTicket(
    idToEdit: string,
    updatedTicketDB: Partial<TicketDB>
  ): Promise<void> {
    const columns = Object.keys(updatedTicketDB).filter(
      (key) => key !== 'created_at'
    );
    const values = columns.map((key) => updatedTicketDB[key as keyof TicketDB]);

    const setClause = columns.map((col) => `${col} = ?`).join(", ");

    const query = `
      UPDATE ${TicketDatabase.TABLE_TICKETS}
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await BaseDatabase.connection.raw(query, [...values, idToEdit]);
  }

  // --------------------------------------------------------------------

  public async updateTicketStatus(
    id: string,
    statusId: number
  ): Promise<void> {
    await BaseDatabase.connection.raw(
      `
      UPDATE ${TicketDatabase.TABLE_TICKETS}
      SET status_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [statusId, id]
    );
  }

  // --------------------------------------------------------------------

  public async updateTicketType(
    id: string,
    typeId: number
  ): Promise<void> {
    await BaseDatabase.connection.raw(
      `
      UPDATE ${TicketDatabase.TABLE_TICKETS}
      SET type_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [typeId, id]
    );
  }

  // --------------------------------------------------------------------
  // STATUS DATA
  // --------------------------------------------------------------------

  public async getAllStatuses(): Promise<TicketStatusDB[]> {
    const result = await BaseDatabase.connection.raw(`
      SELECT *
      FROM ${TicketDatabase.TABLE_TICKET_STATUS}
    `);

    return result.rows;
  }

  // --------------------------------------------------------------------

  public async findStatusById(id: number): Promise<TicketStatusDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${TicketDatabase.TABLE_TICKET_STATUS}
      WHERE id = ?
    `,
      [id]
    );

    return result.rows[0];
  }

  // --------------------------------------------------------------------

  public async findStatusByName(name: string): Promise<TicketStatusDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${TicketDatabase.TABLE_TICKET_STATUS}
      WHERE status = ?
    `,
      [name]
    );

    return result.rows[0];
  }

  // --------------------------------------------------------------------

  public async insertStatus(newStatus: TicketStatusDB): Promise<void> {
    await BaseDatabase.connection.raw(
      `
      INSERT INTO ${TicketDatabase.TABLE_TICKET_STATUS} (status)
      VALUES (?)
    `,
      [newStatus.status]
    );
  }

  // --------------------------------------------------------------------
  // TYPE DATA
  // --------------------------------------------------------------------

  public async getAllTypes(): Promise<TicketTypeDB[]> {
    const result = await BaseDatabase.connection.raw(`
      SELECT *
      FROM ${TicketDatabase.TABLE_TICKET_TYPES}
    `);

    return result.rows;
  }

  // --------------------------------------------------------------------

  public async findTypeById(id: number): Promise<TicketTypeDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${TicketDatabase.TABLE_TICKET_TYPES}
      WHERE id = ?
    `,
      [id]
    );

    return result.rows[0];
  }

  // --------------------------------------------------------------------

  public async findTypeByName(name: string): Promise<TicketTypeDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${TicketDatabase.TABLE_TICKET_TYPES}
      WHERE type_name = ?
    `,
      [name]
    );

    return result.rows[0];
  }

  // --------------------------------------------------------------------

  public async insertType(newType: TicketTypeDB): Promise<void> {
    await BaseDatabase.connection.raw(
      `
      INSERT INTO ${TicketDatabase.TABLE_TICKET_TYPES} (type_name)
      VALUES (?)
    `,
      [newType.type_name]
    );
  }
}

