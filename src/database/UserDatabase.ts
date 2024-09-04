import { BaseDatabase } from "./connection/BaseDatabase";
import { PhoneDB } from "../models/Phones";
import { UserDB, UsersDBOutput } from "../models/User";

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = "users";
  public static TABLE_PHONES = "phones";

  public async findUsers(
    q?: string,
    onlyActive: boolean = true,
    personalId?: string,
    genderId?: number,
    email?: string,
    role?: string
  ): Promise<UsersDBOutput[]> {
    const query = `
      SELECT 
          users.id,
          users.personal_id,
          users.entity_type,
          users.name,
          genders.gender_id,
          genders.name AS gender,
          users.email,
          users.password,
          users.role,
          users.created_at,
          users.birthdate,
          users.address,
          users.number,
          users.neighborhood,
          users.city,
          users.country,
          users.active,
          users.last_login
      FROM ${UserDatabase.TABLE_USERS} users
      LEFT JOIN genders ON users.gender = genders.gender_id
    `;

    const conditions: string[] = [];
    const params: any[] = [];

    if (q) {
      conditions.push("users.name ILIKE ?");
      params.push(`%${q}%`);
    }

    if (personalId) {
      conditions.push("users.personal_id = ?");
      params.push(personalId);
    }

    if (genderId) {
      conditions.push("users.gender = ?");
      params.push(genderId);
    }

    if (email) {
      conditions.push("users.email = ?");
      params.push(email);
    }

    if (role) {
      conditions.push("users.role = ?");
      params.push(role);
    }

    conditions.push("users.active = ?");
    params.push(onlyActive);

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await BaseDatabase.connection.raw(
      `${query} ${whereClause}`,
      params
    );

    return result.rows;
  }

  public async findUserById(id: string): Promise<UserDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${UserDatabase.TABLE_USERS}
      WHERE id = ?
    `,
      [id]
    );

    return result.rows[0];
  }

  public async findUserByEmail(email: string): Promise<UserDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${UserDatabase.TABLE_USERS}
      WHERE email = ?
    `,
      [email]
    );

    return result.rows[0];
  }

  public async findUserByPersonalId(
    personal_id: string
  ): Promise<UserDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
        SELECT *
        FROM ${UserDatabase.TABLE_USERS}
        WHERE personal_id = ?
        `,
      [personal_id]
    );

    return result.rows[0];
  }

  public async insertUser(newUserDB: UserDB): Promise<void> {
    const keys = Object.keys(newUserDB);
    const values = keys.map((key) => newUserDB[key as keyof UserDB]);

    const columns = keys.join(", ");
    const placeholders = keys.map(() => "?").join(", ");

    await BaseDatabase.connection.raw(
      `
      INSERT INTO ${UserDatabase.TABLE_USERS} (${columns})
      VALUES (${placeholders})
    `,
      values
    );
  }

  public async updateUser(
    idToEdit: string,
    updatedUserDB: UserDB
  ): Promise<void> {
    const updates = Object.entries(updatedUserDB)
      .map(([key]) => `${key} = ?`)
      .join(", ");

    const query = `
      UPDATE ${UserDatabase.TABLE_USERS}
      SET ${updates}
      WHERE id = ?
    `;
    const values = [...Object.values(updatedUserDB), idToEdit];

    await BaseDatabase.connection.raw(query, values);
  }

  public async updateLastLogin(id: string, updatedAt: string): Promise<void> {
    await BaseDatabase.connection.raw(
      `
      UPDATE ${UserDatabase.TABLE_USERS}
      SET last_login = ?
      WHERE id = ?
    `,
      [updatedAt, id]
    );
  }

  public async updatePassword(id: string, newPassword: string): Promise<void> {
    await BaseDatabase.connection.raw(
      `
      UPDATE ${UserDatabase.TABLE_USERS}
      SET password = ?
      WHERE id = ?
    `,
      [newPassword, id]
    );
  }

  public async updateUserActiveStatus(
    id: string,
    isActive: boolean
  ): Promise<void> {
    await BaseDatabase.connection.raw(
      `
      UPDATE ${UserDatabase.TABLE_USERS}
      SET active = ?
      WHERE id = ?
    `,
      [isActive ? 1 : 0, id]
    );
  }

  public async getPhones(user_id: string): Promise<PhoneDB[]> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${UserDatabase.TABLE_PHONES}
      WHERE user_id = ?
    `,
      [user_id]
    );

    return result.rows;
  }

  public async findPhoneById(phone_id: string): Promise<PhoneDB | undefined> {
    const result = await BaseDatabase.connection.raw(
      `
      SELECT *
      FROM ${UserDatabase.TABLE_PHONES}
      WHERE phone_id = ?
    `,
      [phone_id]
    );

    return result.rows[0] as PhoneDB | undefined;
  }

  public async insertPhone(phoneData: PhoneDB): Promise<void> {
    const columns = Object.keys(phoneData);
    const placeholders = columns.map(() => "?").join(", ");
    const values = Object.values(phoneData);

    const query = `
      INSERT INTO ${UserDatabase.TABLE_PHONES} (${columns.join(", ")})
      VALUES (${placeholders})
    `;

    await BaseDatabase.connection.raw(query, values);
  }

  public async updatePhone(
    phoneId: string,
    phoneData: Partial<PhoneDB>
  ): Promise<void> {
    const columns = Object.keys(phoneData);
    const values = Object.values(phoneData);

    const setClause = columns.map((col) => `${col} = ?`).join(", ");

    const query = `
      UPDATE ${UserDatabase.TABLE_PHONES}
      SET ${setClause}
      WHERE phone_id = ?
    `;

    await BaseDatabase.connection.raw(query, [...values, phoneId]);
  }

  public async deletePhoneById(phone_id: string): Promise<void> {
    await BaseDatabase.connection.raw(
      `
      DELETE FROM ${UserDatabase.TABLE_PHONES}
      WHERE phone_id = ?
    `,
      [phone_id]
    );
  }
}
