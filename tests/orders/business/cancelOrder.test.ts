import { OrderBusiness } from '../../../src/business/OrderBusiness';
import { OrderDatabase } from '../../../src/database/OrderDatabase';
import { NotFoundError, UnauthorizedError } from '../../../src/errors/Errors';
import { CancelOrderInputDTO, CancelOrderOutputDTO } from '../../../src/dtos/orders/deleteOrder.dto';

// Mocks
const mockOrderDatabase = {
  findPureOrderById: jest.fn(),
  cancelOrderById: jest.fn(),
  updateOrder: jest.fn(),
};

const orderBusiness = new OrderBusiness(
  mockOrderDatabase as unknown as OrderDatabase,
  {} as any,
  {} as any,
  {} as any,
  {} as any,
  {} as any,
  {} as any
);

describe('OrderBusiness - cancelOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should cancel order successfully if status is Pending', async () => {
    const input: CancelOrderInputDTO = {
      orderId: 'order_id_1',
      userId: 'user_id'
    };

    const mockOrderDB = {
      order_id: 'order_id_1',
      user_id: 'user_id',
      status_id: 1, // Status is Pending
    };

    mockOrderDatabase.findPureOrderById.mockResolvedValue(mockOrderDB);
    mockOrderDatabase.updateOrder.mockResolvedValue({});

    const result: CancelOrderOutputDTO = await orderBusiness.cancelOrder(input);

    expect(result).toEqual({
      message: "Order canceled successfully",
    });

    expect(mockOrderDatabase.findPureOrderById).toHaveBeenCalledWith('order_id_1');
    expect(mockOrderDatabase.updateOrder).toHaveBeenCalledWith('order_id_1', {
      ...mockOrderDB,
      status_id: 5,
    });
  });

  test('should throw NotFoundError if order does not exist', async () => {
    const input: CancelOrderInputDTO = {
      orderId: 'non_existent_order_id',
      userId: 'user_id'
    };

    mockOrderDatabase.findPureOrderById.mockResolvedValue(null);

    await expect(orderBusiness.cancelOrder(input)).rejects.toThrow(
      new NotFoundError("Order not found")
    );

    expect(mockOrderDatabase.findPureOrderById).toHaveBeenCalledWith('non_existent_order_id');
  });

  test('should throw UnauthorizedError if user does not have permission to cancel', async () => {
    const input: CancelOrderInputDTO = {
      orderId: 'order_id_1',
      userId: 'another_user_id'
    };

    const mockOrderDB = {
      order_id: 'order_id_1',
      user_id: 'user_id',
      status_id: 1, // Status is Pending
    };

    mockOrderDatabase.findPureOrderById.mockResolvedValue(mockOrderDB);

    await expect(orderBusiness.cancelOrder(input)).rejects.toThrow(
      new UnauthorizedError("You do not have permission to cancel this order")
    );

    expect(mockOrderDatabase.findPureOrderById).toHaveBeenCalledWith('order_id_1');
  });

  test('should throw UnauthorizedError if order status is already cancelled', async () => {
    const input: CancelOrderInputDTO = {
      orderId: 'order_id_1',
      userId: 'user_id'
    };

    const mockOrderDB = {
      order_id: 'order_id_1',
      user_id: 'user_id',
      status_id: 5, // Status is Already Cancelled
    };

    mockOrderDatabase.findPureOrderById.mockResolvedValue(mockOrderDB);

    await expect(orderBusiness.cancelOrder(input)).rejects.toThrow(
      new UnauthorizedError("Order has already been cancelled")
    );

    expect(mockOrderDatabase.findPureOrderById).toHaveBeenCalledWith('order_id_1');
  });

  test('should throw UnauthorizedError if order status is not Pending', async () => {
    const input: CancelOrderInputDTO = {
      orderId: 'order_id_2',
      userId: 'user_id'
    };

    const mockOrderDB = {
      order_id: 'order_id_2',
      user_id: 'user_id',
      status_id: 2, // Status is Not Pending
    };

    mockOrderDatabase.findPureOrderById.mockResolvedValue(mockOrderDB);

    await expect(orderBusiness.cancelOrder(input)).rejects.toThrow(
      new UnauthorizedError("Order cannot be canceled because its status is not Pending")
    );

    expect(mockOrderDatabase.findPureOrderById).toHaveBeenCalledWith('order_id_2');
  });
});
