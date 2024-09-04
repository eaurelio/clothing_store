import { UserBusiness } from '../../../src/business/UserBusiness';
import { UserDatabase } from '../../../src/database/UserDatabase';
import { IdGenerator } from '../../../src/services/idGenerator';
import { NotFoundError, ForbiddenError } from '../../../src/errors/Errors';

const mockUserDatabase = {
  findUserById: jest.fn(),
  findPhoneById: jest.fn(),
  deletePhoneById: jest.fn(),
  getPhones: jest.fn(),
};

const mockIdGenerator = {
  generate: jest.fn(),
};

const userBusiness = new UserBusiness(
  mockUserDatabase as unknown as UserDatabase,
  mockIdGenerator as unknown as IdGenerator,
  {} as any,
  {} as any,
  {} as any 
);

describe('UserBusiness - deletePhone', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully delete a phone for an active user', async () => {
    const input = {
      userId: 'existing_user_id',
      phoneId: 'existing_phone_id',
    };

    const mockPhones = [
      {
        phone_id: 'other_phone_id',
        user_id: 'existing_user_id',
        number: '9876543210',
        type: 'WORK',
      },
    ];

    mockUserDatabase.findUserById.mockResolvedValue({
      id: 'existing_user_id',
      active: true,
    });
    mockUserDatabase.findPhoneById.mockResolvedValue({
      phone_id: 'existing_phone_id',
      user_id: 'existing_user_id',
      number: '1234567890',
      type: 'HOME',
    });
    mockUserDatabase.deletePhoneById.mockResolvedValue({});
    mockUserDatabase.getPhones.mockResolvedValue(mockPhones);

    const result = await userBusiness.deletePhone(input);

    expect(result).toEqual({
      message: 'Phone deleted successfully',
      phones: mockPhones,
    });
    expect(mockUserDatabase.deletePhoneById).toHaveBeenCalledWith('existing_phone_id');
    expect(mockUserDatabase.getPhones).toHaveBeenCalledWith('existing_user_id');
  });

  test('should throw NotFoundError if user does not exist', async () => {
    const input = {
      userId: 'non_existing_user_id',
      phoneId: 'existing_phone_id',
    };

    mockUserDatabase.findUserById.mockResolvedValue(null);

    await expect(userBusiness.deletePhone(input)).rejects.toThrow(NotFoundError);
  });

  test('should throw ForbiddenError if user account is deactivated', async () => {
    const input = {
      userId: 'existing_user_id',
      phoneId: 'existing_phone_id',
    };

    mockUserDatabase.findUserById.mockResolvedValue({
      id: 'existing_user_id',
      active: false,
    });

    await expect(userBusiness.deletePhone(input)).rejects.toThrow(ForbiddenError);
  });

  test('should throw NotFoundError if phone does not exist or does not belong to user', async () => {
    const input = {
      userId: 'existing_user_id',
      phoneId: 'non_existing_phone_id',
    };

    mockUserDatabase.findUserById.mockResolvedValue({
      id: 'existing_user_id',
      active: true,
    });
    mockUserDatabase.findPhoneById.mockResolvedValue(null);

    await expect(userBusiness.deletePhone(input)).rejects.toThrow(NotFoundError);
  });
});
