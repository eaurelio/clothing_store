import { UserBusiness } from '../../../src/business/UserBusiness';
import { UserDatabase } from '../../../src/database/UserDatabase';
import TokenService from '../../../src/services/TokenService';
import { HashManager } from '../../../src/services/HashManager';
import { IdGenerator } from '../../../src/services/idGenerator';
import { ConflictError, ForbiddenError, NotFoundError } from '../../../src/errors/Errors';
import { ErrorHandler } from '../../../src/errors/ErrorHandler';
import { USER_ROLES } from '../../../src/models/User';

const mockUserDatabase = {
  findUserById: jest.fn(),
  findUserByPersonalId: jest.fn(),
  updateUser: jest.fn(),
};

const mockHashManager = {
  hash: jest.fn(),
};

const userBusiness = new UserBusiness(
  mockUserDatabase as unknown as UserDatabase,
  {} as unknown as IdGenerator,
  {} as unknown as TokenService,
  mockHashManager as unknown as HashManager,
  {} as unknown as ErrorHandler
);

describe('UserBusiness - editUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully edit a user', async () => {
    const input = {
      userId: 'user_id_1',
      personal_id: '1378901234',
      password: 'NewPass123',
      name: 'Chloe Smith',
      email: 'chloe.smith@example.ca',
      birthdate: '1996-04-18',
      address: '101 Toronto Street',
      number: '456',
      neighborhood: 'Downtown',
      city: 'Toronto',
      country: 'Canada',
      gender: 'FEMALE',
    };

    const existingUser = {
      id: 'user_id_1',
      personal_id: '1234567890',
      name: 'Old Name',
      email: 'old.email@example.ca',
      password: 'old_password',
      birthdate: '1996-04-18',
      address: 'Old Address',
      number: '123',
      neighborhood: 'Old Neighborhood',
      city: 'Old City',
      country: 'Old Country',
      gender: 'MALE',
      created_at: '2022-01-01T00:00:00Z',
      active: true,
    };

    const updatedUser = {
      ...existingUser,
      personal_id: '1378901234',
      name: 'Chloe Smith',
      email: 'chloe.smith@example.ca',
      password: 'hashed_password',
      address: '101 Toronto Street',
      number: '456',
      neighborhood: 'Downtown',
      city: 'Toronto',
      country: 'Canada',
      gender: 'FEMALE',
    };

    mockUserDatabase.findUserById.mockResolvedValue(existingUser);
    mockUserDatabase.findUserByPersonalId.mockResolvedValue(null);
    mockHashManager.hash.mockResolvedValue('hashed_password');
    mockUserDatabase.updateUser.mockResolvedValue(undefined);
    mockUserDatabase.findUserById.mockResolvedValue(updatedUser);

    const result = await userBusiness.editUser(input);

    expect(result).toEqual({
      message: 'Editing completed successfully',
      user: {
        userId: 'user_id_1',
        name: 'Chloe Smith',
        email: 'chloe.smith@example.ca',
        createdAt: '2022-01-01T00:00:00Z',
      },
    });

    expect(mockUserDatabase.updateUser).toHaveBeenCalledWith('user_id_1', {
      ...existingUser,
      personal_id: '1378901234',
      name: 'Chloe Smith',
      email: 'chloe.smith@example.ca',
      password: 'hashed_password',
      address: '101 Toronto Street',
      number: '456',
      neighborhood: 'Downtown',
      city: 'Toronto',
      country: 'Canada',
      gender: 'FEMALE',
    });
  });

  test('should throw NotFoundError if user is not found', async () => {
    const input = {
      userId: 'nonexistent_user_id',
    };

    mockUserDatabase.findUserById.mockResolvedValue(null);

    await expect(userBusiness.editUser(input)).rejects.toThrow(NotFoundError);
  });

  test('should throw ForbiddenError if user is deactivated', async () => {
    const input = {
      userId: 'user_id_1',
    };

    const deactivatedUser = {
      id: 'user_id_1',
      active: false,
    };

    mockUserDatabase.findUserById.mockResolvedValue(deactivatedUser);

    await expect(userBusiness.editUser(input)).rejects.toThrow(ForbiddenError);
  });

  test('should throw ConflictError if personal_id is already in use', async () => {
    const input = {
      userId: 'user_id_1',
      personal_id: 'conflicting_personal_id',
    };

    const existingUser = {
      id: 'user_id_1',
      personal_id: '1234567890',
      active: true,
    };

    const conflictingUser = {
      id: 'another_user_id',
    };

    mockUserDatabase.findUserById.mockResolvedValue(existingUser);
    mockUserDatabase.findUserByPersonalId.mockResolvedValue(conflictingUser);

    await expect(userBusiness.editUser(input)).rejects.toThrow(ConflictError);
  });
});
