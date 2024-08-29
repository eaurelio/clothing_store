import { UserBusiness } from '../../../src/business/UserBusiness';
import { UserDatabase } from '../../../src/database/UserDatabase';
import { HashManager } from '../../../src/services/HashManager';
import { NotFoundError, BadRequestError } from '../../../src/errors/Errors';

const mockUserDatabase = {
  findUserByEmail: jest.fn(),
  updateUserActiveStatus: jest.fn(),
};

const mockHashManager = {
  compare: jest.fn(),
};

const userBusiness = new UserBusiness(
  mockUserDatabase as unknown as UserDatabase,
  {} as any, // Mock for IdGenerator if needed
  {} as any, // Mock for TokenService if needed
  mockHashManager as unknown as HashManager,
  {} as any  // Mock for ErrorHandler if needed
);

describe('UserBusiness - toggleUserActiveStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully toggle user active status to activated', async () => {
    const input = {
      email: 'user@example.com',
      password: 'CorrectPass123',
    };

    mockUserDatabase.findUserByEmail.mockResolvedValue({
      id: 'existing_user_id',
      email: 'user@example.com',
      password: 'hashed_password',
      active: false,
    });
    mockHashManager.compare.mockResolvedValue(true); // Password is correct
    mockUserDatabase.updateUserActiveStatus.mockResolvedValue({});

    const result = await userBusiness.toggleUserActiveStatus(input);

    expect(result).toEqual({
      message: 'User activated successfully',
    });
    expect(mockUserDatabase.updateUserActiveStatus).toHaveBeenCalledWith('existing_user_id', true);
  });

  test('should successfully toggle user active status to deactivated', async () => {
    const input = {
      email: 'user@example.com',
      password: 'CorrectPass123',
    };

    mockUserDatabase.findUserByEmail.mockResolvedValue({
      id: 'existing_user_id',
      email: 'user@example.com',
      password: 'hashed_password',
      active: true,
    });
    mockHashManager.compare.mockResolvedValue(true); // Password is correct
    mockUserDatabase.updateUserActiveStatus.mockResolvedValue({});

    const result = await userBusiness.toggleUserActiveStatus(input);

    expect(result).toEqual({
      message: 'User deactivated successfully',
    });
    expect(mockUserDatabase.updateUserActiveStatus).toHaveBeenCalledWith('existing_user_id', false);
  });

  test('should throw NotFoundError if user does not exist', async () => {
    const input = {
      email: 'non_existing_user@example.com',
      password: 'CorrectPass123',
    };

    mockUserDatabase.findUserByEmail.mockResolvedValue(null);

    await expect(userBusiness.toggleUserActiveStatus(input)).rejects.toThrow(NotFoundError);
  });

  test('should throw BadRequestError if password is incorrect', async () => {
    const input = {
      email: 'user@example.com',
      password: 'WrongPass123',
    };

    mockUserDatabase.findUserByEmail.mockResolvedValue({
      id: 'existing_user_id',
      email: 'user@example.com',
      password: 'hashed_password',
      active: true,
    });
    mockHashManager.compare.mockResolvedValue(false); // Password is incorrect

    await expect(userBusiness.toggleUserActiveStatus(input)).rejects.toThrow(BadRequestError);
  });
});
