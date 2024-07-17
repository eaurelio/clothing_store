// import { IdGenerator } from './../services/idGenerator';
import { Phone, UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = "users"
  public static TABLE_PHONES = "phones"

  public async findUsers(q: string | undefined) {
    let usersDB

    if (q) {
      const result: UserDB[] = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .where("name", "LIKE", `%${q}%`)

      usersDB = result
    } else {
      const result: UserDB[] = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)

      usersDB = result
    }

    return usersDB
  }

  public async findUserById(id: string) {
    const [userDB]: UserDB[] | undefined[] = await BaseDatabase
      .connection(UserDatabase.TABLE_USERS)
      .where({ id })

    return userDB
  }

  public async findUserByEmail(email: string) {
    const [userDB]: UserDB[] | undefined[]  = await BaseDatabase
    .connection(UserDatabase.TABLE_USERS)
    .where({ email })

    return userDB;

  }

  public async insertUser(newUserDB: UserDB) {
    await BaseDatabase
      .connection(UserDatabase.TABLE_USERS)
      .insert(newUserDB)
  }

  public async getPhones(user_id: string) {
    const phones =
    await BaseDatabase
      .connection(UserDatabase.TABLE_PHONES)
      .where({user_id})
    return phones;
  }

  public async insertPhone(phone_id: string, user_id: string, phone: Phone): Promise<void> {
    await BaseDatabase
      .connection(UserDatabase.TABLE_PHONES)
      .insert({
        phone_id,
        user_id,
        number: phone.number,
        type: phone.type
      });
  }

  // public async updatePhoneById(phone_id: string): Promise<void> {
  //   await BaseDatabase
  //     .connection(UserDatabase.TABLE_PHONES)
  //     .update(number, type);
  //     .where({ phone_id })
  // }

  public async deletePhonesById(phone_id: string): Promise<void> {
    await BaseDatabase
      .connection(UserDatabase.TABLE_PHONES)
      .where({ phone_id })
      .delete();
  }

  public async updateUser(idToEdit: string, updatedUserDB: UserDB) {
    await BaseDatabase
      .connection(UserDatabase.TABLE_USERS)
      .update(updatedUserDB)
      .where({ id: idToEdit })
  }
}
