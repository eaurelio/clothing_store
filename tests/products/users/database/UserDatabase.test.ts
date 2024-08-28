import { UserDatabase } from '../../../src/database/UserDatabase';
import { BaseDatabase } from '../../../src/database/connection/BaseDatabase';
import { EntityType, USER_ROLES} from '../../../src/models/User';

class MockBaseDatabase extends BaseDatabase {
  static raw = jest.fn();
}

describe('UserDatabase', () => {
  let userDatabase: UserDatabase;

  beforeAll(() => {
    userDatabase = new UserDatabase();
    (BaseDatabase as unknown as typeof MockBaseDatabase).raw = MockBaseDatabase.raw;
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should find users with search query from database', async () => {
    const query = 'Edson';
    const onlyActive = true;
  
    // Dados esperados diretamente da camada de banco de dados
    const dbResult = [
      {
        id: 'd1c5b5e7-ab95-4f48-b8de-c89de4eea640',
        personal_id: '1317599578',
        entity_type: EntityType.PERSONAL,
        name: 'Edson Aurélio de Oliveira Araujo',
        gender: 'Male',
        email: 'edson.exe@outlook.com.br',
        password: '$2a$12$lbb3.nAhlXrnIemh1DlVE.ivQp4QYRsF9XPOhPKFIddfdaPCeBf6a',
        role: USER_ROLES.ADMIN,
        created_at: new Date('2024-08-21T23:13:02.653Z'),
        birthdate: new Date('2000-01-01T02:00:00.000Z'),
        address: '123 Tech Street',
        number: '500',
        neighborhood: 'Tech Hub',
        city: 'San Francisco',
        country: 'USA',
        active: true,
        last_login: new Date('2024-08-23T00:55:13.280Z')
      }
    ];
  
    MockBaseDatabase.raw.mockReturnValueOnce({ rows: dbResult });
  
    const result = await userDatabase.findUsers(query, onlyActive);
  
    expect(result).toEqual(dbResult);
  });
   
  test('should find user by id', async () => {
    const userId = '1aa7b223-8843-4efc-9007-c0eb5763f7ff';
    const user = {
      id: '1aa7b223-8843-4efc-9007-c0eb5763f7ff',
      personal_id: '1378901234',
      entity_type: EntityType.PERSONAL,
      name: 'Chloe Smith',
      gender: 2,
      email: 'chloe.smith@example.ca',
      password: '$2a$12$z3VHB/bUIj4iG8a5DtoB3.NQbnFF/2fOpFbkMfqF83lvRhW2IJf3m',
      role: USER_ROLES.CLIENT,
      created_at: new Date('2024-08-21T23:38:47.161Z'),
      birthdate: new Date('1996-04-18T03:00:00.000Z'),
      address: '101 Toronto Street',
      number: '3',
      neighborhood: 'Downtown',
      city: 'Toronto',
      country: 'Canada',
      active: true,
      last_login: new Date('2024-08-23T15:10:50.171Z')
    };

    MockBaseDatabase.raw.mockReturnValueOnce({ rows: [user] });

    const result = await userDatabase.findUserById(userId);

    expect(result).toEqual(user);
  });

  test('should return undefined if user by id is not found', async () => {
    const userId = 'non_existing_user_id';

    MockBaseDatabase.raw.mockReturnValueOnce({ rows: [] });

    const result = await userDatabase.findUserById(userId);

    expect(result).toBeUndefined();
  });

  test('should find user by email', async () => {
    const email = 'chloe.smith@example.ca';
    const user = {
      id: '1aa7b223-8843-4efc-9007-c0eb5763f7ff',
      personal_id: '1378901234',
      entity_type: EntityType.PERSONAL,
      name: 'Chloe Smith',
      gender: 2,
      email: 'chloe.smith@example.ca',
      password: '$2a$12$z3VHB/bUIj4iG8a5DtoB3.NQbnFF/2fOpFbkMfqF83lvRhW2IJf3m',
      role: USER_ROLES.CLIENT,
      created_at: new Date('2024-08-21T23:38:47.161Z'),
      birthdate: new Date('1996-04-18T03:00:00.000Z'),
      address: '101 Toronto Street',
      number: '3',
      neighborhood: 'Downtown',
      city: 'Toronto',
      country: 'Canada',
      active: true,
      last_login: new Date('2024-08-23T15:10:50.171Z')
    };

    MockBaseDatabase.raw.mockReturnValueOnce({ rows: [user] });

    const result = await userDatabase.findUserByEmail(email);

    expect(result).toEqual(user);
  });

  test('should find user by personal_id', async () => {
    const personalId = '1378901234';
    const user = {
      id: '1aa7b223-8843-4efc-9007-c0eb5763f7ff',
      personal_id: '1378901234',
      entity_type: EntityType.PERSONAL,
      name: 'Chloe Smith',
      gender: 2,
      email: 'chloe.smith@example.ca',
      password: '$2a$12$z3VHB/bUIj4iG8a5DtoB3.NQbnFF/2fOpFbkMfqF83lvRhW2IJf3m',
      role: USER_ROLES.CLIENT,
      created_at: new Date('2024-08-21T23:38:47.161Z'),
      birthdate: new Date('1996-04-18T03:00:00.000Z'),
      address: '101 Toronto Street',
      number: '3',
      neighborhood: 'Downtown',
      city: 'Toronto',
      country: 'Canada',
      active: true,
      last_login: new Date('2024-08-23T15:10:50.171Z')
    };

    MockBaseDatabase.raw.mockReturnValueOnce({ rows: [user] });

    const result = await userDatabase.findUserByPersonalId(personalId);

    expect(result).toEqual(user);
  });

});
