import { UserBusiness } from '../../../src/business/UserBusiness';
import { UserDatabase } from '../../../src/database/UserDatabase';
import { IdGenerator } from '../../../src/services/idGenerator';
import { NotFoundError, ForbiddenError } from '../../../src/errors/Errors';

const mockUserDatabase = {
  findUserById: jest.fn(),
  findPhoneById: jest.fn(),
  updatePhone: jest.fn(),
};

const mockIdGenerator = {
  generate: jest.fn(),
};

const userBusiness = new UserBusiness(
  mockUserDatabase as unknown as UserDatabase,
  mockIdGenerator as unknown as IdGenerator,
  {} as any, // Mock for TokenService if needed
  {} as any, // Mock for HashManager if needed
  {} as any  // Mock for ErrorHandler if needed
);

describe('UserBusiness - updatePhone', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully update a phone for an active user', async () => {
    const input = {
      userId: 'existing_user_id',
      phoneId: 'existing_phone_id',
      number: '9876543210',
      type: 'WORK',
    };

    const mockPhoneData = {
      phone_id: 'existing_phone_id',
      user_id: 'existing_user_id',
      number: '9876543210',
      type: 'WORK',
    };

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
    mockUserDatabase.updatePhone.mockResolvedValue({});
    mockUserDatabase.findPhoneById.mockResolvedValue(mockPhoneData);

    const result = await userBusiness.updatePhone(input);

    expect(result).toEqual({
      message: 'Phone updated successfully',
      phones: [mockPhoneData],
    });
    expect(mockUserDatabase.updatePhone).toHaveBeenCalledWith('existing_phone_id', {
      number: '9876543210',
      type: 'WORK',
    });
    expect(mockUserDatabase.findPhoneById).toHaveBeenCalledWith('existing_phone_id');
  });

  test('should throw NotFoundError if user does not exist', async () => {
    const input = {
      userId: 'non_existing_user_id',
      phoneId: 'existing_phone_id',
      number: '9876543210',
      type: 'WORK',
    };

    mockUserDatabase.findUserById.mockResolvedValue(null);

    await expect(userBusiness.updatePhone(input)).rejects.toThrow(NotFoundError);
  });

  test('should throw ForbiddenError if user account is deactivated', async () => {
    const input = {
      userId: 'existing_user_id',
      phoneId: 'existing_phone_id',
      number: '9876543210',
      type: 'WORK',
    };

    mockUserDatabase.findUserById.mockResolvedValue({
      id: 'existing_user_id',
      active: false,
    });

    await expect(userBusiness.updatePhone(input)).rejects.toThrow(ForbiddenError);
  });

  test('should throw NotFoundError if phone does not exist or does not belong to user', async () => {
    const input = {
      userId: 'existing_user_id',
      phoneId: 'non_existing_phone_id',
      number: '9876543210',
      type: 'WORK',
    };

    mockUserDatabase.findUserById.mockResolvedValue({
      id: 'existing_user_id',
      active: true,
    });
    mockUserDatabase.findPhoneById.mockResolvedValue(null);

    await expect(userBusiness.updatePhone(input)).rejects.toThrow(NotFoundError);
  });

  test('should throw NotFoundError if phone data cannot be retrieved after update', async () => {
    const input = {
      userId: 'existing_user_id',
      phoneId: 'existing_phone_id',
      number: '9876543210',
      type: 'WORK',
    };

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
    mockUserDatabase.updatePhone.mockResolvedValue({});
    mockUserDatabase.findPhoneById.mockResolvedValue(null); // Phone not found

    await expect(userBusiness.updatePhone(input)).rejects.toThrow(NotFoundError);
  });
});
