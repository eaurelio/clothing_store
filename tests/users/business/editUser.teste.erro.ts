import { UserBusiness } from '../../../src/business/UserBusiness';
import { UserDatabase } from '../../../src/database/UserDatabase';
import TokenService from '../../../src/services/TokenService';
import { HashManager } from '../../../src/services/HashManager';
import { IdGenerator } from '../../../src/services/idGenerator';
import { ConflictError, ForbiddenError } from '../../../src/errors/Errors';
import { ErrorHandler } from '../../../src/errors/ErrorHandler';
import { USER_ROLES } from '../../../src/models/User';

const mockUserDatabase = {
  findUserById: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserByPersonalId: jest.fn(),
  updateUser: jest.fn(),
  updatePhone: jest.fn(),
};

const mockTokenService = {
  verifyToken: jest.fn(),
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

describe('UserBusiness - editUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully edit a user', async () => {
    const input = {
      token: 'valid_token',
      userId: 'existing_user_id',
      personal_id: '1378901234',
      entity_type: 'PERSONAL',
      name: 'Chloe Smith Updated',
      email: 'chloe.smith.updated@example.ca',
      password: 'UpdatedCanadaPass',
      birthdate: '1996-04-18',
      role: USER_ROLES.CLIENT,
      address: '101 Updated Toronto Street',
      number: '456',
      neighborhood: 'Updated Downtown',
      city: 'Updated Toronto',
      country: 'Canada',
      gender: 'FEMALE',
      phones: [
        { number: '1234567890', type: 'HOME' },
      ],
    };
  
    mockUserDatabase.findUserById.mockResolvedValue({
      id: 'existing_user_id',
      personal_id: '1378901234',
      email: 'chloe.smith@example.ca',
      active: true,
      created_at: '2024-01-01T00:00:00Z',
    });
    mockUserDatabase.findUserByEmail.mockResolvedValue(null);
    mockUserDatabase.findUserByPersonalId.mockResolvedValue(null);
    mockHashManager.hash.mockResolvedValue('hashed_updated_password');
    mockTokenService.verifyToken.mockReturnValue({ role: USER_ROLES.CLIENT });
    mockUserDatabase.updateUser.mockResolvedValue({
      id: 'existing_user_id',
      name: 'Chloe Smith Updated',
      email: 'chloe.smith.updated@example.ca',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    });    
    mockUserDatabase.updatePhone.mockResolvedValue({});
  
    const result = await userBusiness.editUser(input);
  
    expect(result).toEqual({
      message: 'Editing completed successfully',
      user: {
        userId: 'existing_user_id',
        name: 'Chloe Smith Updated',
        email: 'chloe.smith.updated@example.ca',
        createdAt: '2024-01-01T00:00:00Z',
      },
    });
  });

  test('should throw ConflictError if email already exists', async () => {
    const input = {
      token: 'valid_token',
      userId: 'existing_user_id',
      personal_id: '1378901234',
      entity_type: 'PERSONAL',
      name: 'Chloe Smith Updated',
      email: 'chloe.smith.updated@example.ca',
      password: 'UpdatedCanadaPass',
      birthdate: '1996-04-18',
      role: USER_ROLES.CLIENT,
      address: '101 Updated Toronto Street',
      number: '456',
      neighborhood: 'Updated Downtown',
      city: 'Updated Toronto',
      country: 'Canada',
      gender: 'FEMALE',
      phones: [],
    };

    mockUserDatabase.findUserById.mockResolvedValue({
      id: 'existing_user_id',
      personal_id: '1378901234',
      email: 'chloe.smith@example.ca',
      active: true,
      created_at: '2024-01-01T00:00:00Z',
    });
    mockUserDatabase.findUserByEmail.mockResolvedValue({ id: 'another_existing_id' });
    mockUserDatabase.findUserByPersonalId.mockResolvedValue(null);
    mockTokenService.verifyToken.mockReturnValue({ role: USER_ROLES.CLIENT });

    await expect(userBusiness.editUser(input)).rejects.toThrow(ConflictError);
  });

  test('should throw ConflictError if personal_id already exists', async () => {
    const input = {
      token: 'valid_token',
      userId: 'existing_user_id',
      personal_id: '12345',
      entity_type: 'PERSONAL',
      name: 'Chloe Smith Updated',
      email: 'chloe.smith.updated@example.ca',
      password: 'UpdatedCanadaPass',
      birthdate: '1996-04-18',
      role: USER_ROLES.CLIENT,
      address: '101 Updated Toronto Street',
      number: '456',
      neighborhood: 'Updated Downtown',
      city: 'Updated Toronto',
      country: 'Canada',
      gender: 'FEMALE',
      phones: [],
    };

    mockUserDatabase.findUserById.mockResolvedValue({
      id: 'existing_user_id',
      personal_id: '1378901234',
      email: 'chloe.smith@example.ca',
      active: true,
      created_at: '2024-01-01T00:00:00Z',
    });
    mockUserDatabase.findUserByEmail.mockResolvedValue(null);
    mockUserDatabase.findUserByPersonalId.mockResolvedValue({ id: 'another_existing_id' });
    mockTokenService.verifyToken.mockReturnValue({ role: USER_ROLES.CLIENT });

    await expect(userBusiness.editUser(input)).rejects.toThrow(ConflictError);
  });

  test('should throw ForbiddenError if editing a user without proper permissions', async () => {
    const input = {
      token: 'valid_token',
      userId: 'existing_user_id',
      personal_id: '1378901234',
      entity_type: 'PERSONAL',
      name: 'Chloe Smith Updated',
      email: 'chloe.smith.updated@example.ca',
      password: 'UpdatedCanadaPass',
      birthdate: '1996-04-18',
      role: USER_ROLES.CLIENT,
      address: '101 Updated Toronto Street',
      number: '456',
      neighborhood: 'Updated Downtown',
      city: 'Updated Toronto',
      country: 'Canada',
      gender: 'FEMALE',
      phones: [],
    };

    mockUserDatabase.findUserById.mockResolvedValue({
      id: 'existing_user_id',
      personal_id: '1378901234',
      email: 'chloe.smith@example.ca',
      active: true,
      created_at: '2024-01-01T00:00:00Z',
    });
    mockUserDatabase.findUserByEmail.mockResolvedValue(null);
    mockUserDatabase.findUserByPersonalId.mockResolvedValue(null);
    mockTokenService.verifyToken.mockReturnValue({ role: USER_ROLES.ADMIN });

    await expect(userBusiness.editUser(input)).rejects.toThrow(ForbiddenError);
  });

  test('should handle invalid data gracefully', async () => {
    const input = {
      token: 'valid_token',
      userId: 'existing_user_id',
      personal_id: '1378901234',
      entity_type: 'PERSONAL',
      name: '', // Invalid data
      email: 'chloe.smith.updated@example.ca',
      password: 'UpdatedCanadaPass',
      birthdate: '1996-04-18',
      role: USER_ROLES.CLIENT,
      address: '101 Updated Toronto Street',
      number: '456',
      neighborhood: 'Updated Downtown',
      city: 'Updated Toronto',
      country: 'Canada',
      gender: 'FEMALE',
      phones: [],
    };

    mockUserDatabase.findUserById.mockResolvedValue({
      id: 'existing_user_id',
      personal_id: '1378901234',
      email: 'chloe.smith@example.ca',
      active: true,
      created_at: '2024-01-01T00:00:00Z',
    });
    mockUserDatabase.findUserByEmail.mockResolvedValue(null);
    mockUserDatabase.findUserByPersonalId.mockResolvedValue(null);
    mockHashManager.hash.mockRejectedValue(new Error('Invalid data'));
    mockTokenService.verifyToken.mockReturnValue({ role: USER_ROLES.CLIENT });

    await expect(userBusiness.editUser(input)).rejects.toThrow(Error);
  });
});
