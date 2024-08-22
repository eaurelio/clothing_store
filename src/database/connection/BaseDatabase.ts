// SQLITE CONNECTION

// import { knex } from "knex"
// import dotenv from 'dotenv'

// dotenv.config()

// export abstract class BaseDatabase {
//     protected static connection = knex({
//         client: "sqlite3",
//         connection: {
//             filename: process.env.DB_FILE_PATH as string,
//         },
//         useNullAsDefault: true,
//         pool: { 
//             min: 0,
//             max: 1,
//             afterCreate: (conn: any, cb: any) => {
//                 conn.run("PRAGMA foreign_keys = ON", cb)
//             }
//         }
//     })
// }

// Postgre conection

import { knex } from "knex";
import dotenv from 'dotenv';

dotenv.config();

export abstract class BaseDatabase {
    protected static connection = knex({
        client: "pg",
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT) || 5432,
        },
        pool: {
            min: 2,
            max: 10
        }
    });
}
