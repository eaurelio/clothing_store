import { OrderBusiness } from '../../../src/business/OrderBusiness';
import { OrderDatabase } from '../../../src/database/OrderDatabase';
import { NotFoundError, UnauthorizedError } from '../../../src/errors/Errors';
import { CancelOrderInputDTO, CancelOrderOutputDTO } from '../../../src/dtos/orders/deleteOrder.dto';

// Mocks
const mockOrderDatabase = {
  findPureOrderById: jest.fn(),
  cancelOrderById: jest.fn(),
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
    };

    const mockOrderDB = {
      order_id: 'order_id_1',
      status_id: 1,
    };

    mockOrderDatabase.findPureOrderById.mockResolvedValue(mockOrderDB);
    mockOrderDatabase.cancelOrderById.mockResolvedValue({});

    const result: CancelOrderOutputDTO = await orderBusiness.cancelOrder(input);

    expect(result).toEqual({
      message: "Order Cancelled successfully",
    });

    expect(mockOrderDatabase.findPureOrderById).toHaveBeenCalledWith('order_id_1');
    expect(mockOrderDatabase.cancelOrderById).toHaveBeenCalledWith('order_id_1');
  });

  test('should throw NotFoundError if order does not exist', async () => {
    const input: CancelOrderInputDTO = {
      orderId: 'non_existent_order_id',
    };

    mockOrderDatabase.findPureOrderById.mockResolvedValue(null);

    await expect(orderBusiness.cancelOrder(input)).rejects.toThrow(NotFoundError);

    expect(mockOrderDatabase.findPureOrderById).toHaveBeenCalledWith('non_existent_order_id');
    expect(mockOrderDatabase.cancelOrderById).not.toHaveBeenCalled();
  });

  test('should throw UnauthorizedError if order status is not Pending', async () => {
    const input: CancelOrderInputDTO = {
      orderId: 'order_id_2',
    };

    const mockOrderDB = {
      order_id: 'order_id_2',
      status_id: 2,
    };

    mockOrderDatabase.findPureOrderById.mockResolvedValue(mockOrderDB);

    await expect(orderBusiness.cancelOrder(input)).rejects.toThrow(UnauthorizedError);

    expect(mockOrderDatabase.findPureOrderById).toHaveBeenCalledWith('order_id_2');
    expect(mockOrderDatabase.cancelOrderById).not.toHaveBeenCalled();
  });
});
