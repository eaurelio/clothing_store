import { knex, Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

export abstract class BaseDatabase {
    protected static connection: Knex = knex({
        client: 'pg',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT) || 5432,
        },
        pool: {
            min: 2,
            max: 10,
        },
    });

    protected static getConnection(): Knex {
        return BaseDatabase.connection;
    }

    public static async closeConnection(): Promise<void> {
        if (BaseDatabase.connection) {
            await BaseDatabase.connection.destroy();
            BaseDatabase.connection = undefined as unknown as Knex;
        }
    }
}

