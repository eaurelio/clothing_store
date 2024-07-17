// import { IdGenerator } from './../services/idGenerator';
import { PhoneDB } from "../models/Phones";
import { Phone, UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = "users"
  public static TABLE_PHONES = "phones"

  // USER DATA

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

  public async updateUser(idToEdit: string, updatedUserDB: UserDB) {
    await BaseDatabase
      .connection(UserDatabase.TABLE_USERS)
      .update(updatedUserDB)
      .where({ id: idToEdit })
  }

  // PHONE USER

  public async getPhones(user_id: string) {
    const phones =
    await BaseDatabase
      .connection(UserDatabase.TABLE_PHONES)
      .where({user_id})
    return phones;
  }

  public async findPhoneById(phone_id: string): Promise<PhoneDB | undefined> {
    const [phoneDB]: PhoneDB[] | undefined[] = await BaseDatabase
      .connection(UserDatabase.TABLE_PHONES)
      .where({ phone_id });

    return phoneDB;
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

  public async updatePhone(phone_id: string, phoneData: { number: string, type: string }): Promise<void> {
    await BaseDatabase
      .connection(UserDatabase.TABLE_PHONES)
      .update(phoneData)
      .where({ phone_id });
  }

  public async deletePhonesById(phone_id: string): Promise<void> {
    await BaseDatabase
      .connection(UserDatabase.TABLE_PHONES)
      .where({ phone_id })
      .delete();
  }
}
