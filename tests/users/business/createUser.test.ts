import { UserBusiness } from '../../../src/business/UserBusiness';
import { UserDatabase } from '../../../src/database/UserDatabase';
import TokenService from '../../../src/services/TokenService';
import { HashManager } from '../../../src/services/HashManager';
import { IdGenerator } from '../../../src/services/idGenerator';
import { ConflictError, ForbiddenError } from '../../../src/errors/Errors';
import { ErrorHandler } from '../../../src/errors/ErrorHandler';
import { USER_ROLES } from '../../../src/models/User'; // Importar USER_ROLES se necessário

const mockUserDatabase = {
  findUserByEmail: jest.fn(),
  findUserByPersonalId: jest.fn(),
  insertUser: jest.fn(),
  insertPhone: jest.fn(),
};

const mockTokenService = {
  verifyToken: jest.fn(),
  generateToken: jest.fn(),
};

const mockHashManager = {
  hash: jest.fn(),
};

const mockIdGenerator = {
  generate: jest.fn(),
};

const mockErrorHandler = {
  generate: jest.fn(),
};

const userBusiness = new UserBusiness(
  mockUserDatabase as unknown as UserDatabase,
  mockIdGenerator as unknown as IdGenerator,
  mockTokenService as unknown as TokenService,
  mockHashManager as unknown as HashManager,
  mockErrorHandler as unknown as ErrorHandler,
);

describe('UserBusiness - createUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully create a user', async () => {
    const input = {
      token: undefined,
      personal_id: '1378901234',
      entity_type: 'PERSONAL',
      name: 'Chloe Smith',
      email: 'chloe.smith@example.ca',
      password: 'CanadaPass',
      birthdate: '1996-04-18',
      role: USER_ROLES.CLIENT,
      address: '101 Toronto Street',
      number: '456',
      neighborhood: 'Downtown',
      city: 'Toronto',
      country: 'Canada',
      gender: 'FEMALE',
      phones: [],
    };

    mockUserDatabase.findUserByEmail.mockResolvedValue(null);
    mockUserDatabase.findUserByPersonalId.mockResolvedValue(null);
    mockHashManager.hash.mockResolvedValue('hashed_password');
    mockIdGenerator.generate.mockResolvedValue('new_id');
    mockTokenService.generateToken.mockReturnValue('new_token');

    const result = await userBusiness.createUser(input);

    expect(result).toEqual({
      message: 'User created successfully',
      user: {
        id: 'new_id',
        name: 'Chloe Smith',
        email: 'chloe.smith@example.ca',
        createdAt: expect.any(String),
        token: 'new_token',
      },
    });
    expect(mockUserDatabase.insertUser).toHaveBeenCalledWith(expect.objectContaining({
      id: 'new_id',
      personal_id: '1378901234',
      entity_type: 'PERSONAL',
      name: 'Chloe Smith',
      email: 'chloe.smith@example.ca',
      password: 'hashed_password',
      birthdate: '1996-04-18',
      role: USER_ROLES.CLIENT,
      created_at: expect.any(String),
      address: '101 Toronto Street',
      number: '456',
      neighborhood: 'Downtown',
      city: 'Toronto',
      country: 'Canada',
      gender: 'FEMALE',
    }));
    expect(mockTokenService.generateToken).toHaveBeenCalledWith('new_id', USER_ROLES.CLIENT);
  });

  test('should throw ConflictError if email already exists', async () => {
    const input = {
      token: undefined,
      personal_id: '12345',
      entity_type: 'PERSON',
      name: 'Chloe Smith',
      email: 'chloe.smith@example.ca',
      password: 'CanadaPass',
      birthdate: '1996-04-18',
      role: USER_ROLES.CLIENT,
      address: '101 Toronto Street',
      number: '456',
      neighborhood: 'Downtown',
      city: 'Toronto',
      country: 'Canada',
      gender: 'FEMALE',
      phones: [],
    };

    mockUserDatabase.findUserByEmail.mockResolvedValue({ id: 'existing_id' });
    mockUserDatabase.findUserByPersonalId.mockResolvedValue(null);

    await expect(userBusiness.createUser(input)).rejects.toThrow(ConflictError);
  });

  test('should throw ConflictError if personal_id already exists', async () => {
    const input = {
      token: undefined,
      personal_id: '12345',
      entity_type: 'PERSON',
      name: 'Chloe Smith',
      email: 'chloe.smith@example.ca',
      password: 'CanadaPass',
      birthdate: '1996-04-18',
      role: USER_ROLES.CLIENT,
      address: '101 Toronto Street',
      number: '456',
      neighborhood: 'Downtown',
      city: 'Toronto',
      country: 'Canada',
      gender: 'FEMALE',
      phones: [],
    };

    mockUserDatabase.findUserByEmail.mockResolvedValue(null);
    mockUserDatabase.findUserByPersonalId.mockResolvedValue({ id: 'existing_id' });

    await expect(userBusiness.createUser(input)).rejects.toThrow(ConflictError);
  });

  test('should throw ForbiddenError if creating an admin user without proper permissions', async () => {
    const input = {
      token: 'invalid_token',
      personal_id: '12345',
      entity_type: 'PERSON',
      name: 'Chloe Smith',
      email: 'chloe.smith@example.ca',
      password: 'CanadaPass',
      birthdate: '1996-04-18',
      role: USER_ROLES.ADMIN,
      address: '101 Toronto Street',
      number: '456',
      neighborhood: 'Downtown',
      city: 'Toronto',
      country: 'Canada',
      gender: 'FEMALE',
      phones: [],
    };

    mockTokenService.verifyToken.mockReturnValue({ role: USER_ROLES.CLIENT });

    await expect(userBusiness.createUser(input)).rejects.toThrow(ForbiddenError);
  });

  test('should successfully create a user with phones', async () => {
    const input = {
      token: undefined,
      personal_id: '12345',
      entity_type: 'PERSON',
      name: 'Chloe Smith',
      email: 'chloe.smith@example.ca',
      password: 'CanadaPass',
      birthdate: '1996-04-18',
      role: USER_ROLES.CLIENT,
      address: '101 Toronto Street',
      number: '456',
      neighborhood: 'Downtown',
      city: 'Toronto',
      country: 'Canada',
      gender: 'FEMALE',
      phones: [
        { number: '1234567890', type: 'HOME' },
        { number: '0987654321', type: 'WORK' },
      ],
    };

    mockUserDatabase.findUserByEmail.mockResolvedValue(null);
    mockUserDatabase.findUserByPersonalId.mockResolvedValue(null);
    mockHashManager.hash.mockResolvedValue('hashed_password');
    mockIdGenerator.generate.mockResolvedValue('new_id');
    mockTokenService.generateToken.mockReturnValue('new_token');

    const result = await userBusiness.createUser(input);

    expect(result).toEqual({
      message: 'User created successfully',
      user: {
        id: 'new_id',
        name: 'Chloe Smith',
        email: 'chloe.smith@example.ca',
        createdAt: expect.any(String),
        token: 'new_token',
      },
    });
    expect(mockUserDatabase.insertPhone).toHaveBeenCalledTimes(2);
  });
});
