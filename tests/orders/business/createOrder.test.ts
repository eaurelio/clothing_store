import { OrderBusiness } from '../../../src/business/OrderBusiness';
import { OrderDatabase } from '../../../src/database/OrderDatabase';
import { ProductDatabase } from '../../../src/database/ProductDatabase';
import { IdGenerator } from '../../../src/services/idGenerator';
import { CreateOrderInputDTO, CreateOrderOutputDTO } from '../../../src/dtos/orders/createOrder.dto';
import { ForbiddenError } from '../../../src/errors/Errors';
import { UserDatabase } from '../../../src/database/UserDatabase';

// Mocks
const mockOrderDatabase = {
  insertOrder: jest.fn(),
  insertOrderItem: jest.fn(),
};

const mockProductDatabase = {
  findPureProductById: jest.fn(),
};

const mockUserDatabase = {
  generate: jest.fn(),
};

const mockIdGenerator = {
  generate: jest.fn(),
};

const orderBusiness = new OrderBusiness(
  mockOrderDatabase as unknown as OrderDatabase,
  mockProductDatabase as unknown as ProductDatabase,
  mockUserDatabase as unknown as UserDatabase, 
  mockIdGenerator as unknown as IdGenerator,
  {} as any,
  {} as any,
  {} as any
);

describe('OrderBusiness - createOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully create an order', async () => {
    const input: CreateOrderInputDTO = {
      items: [
        { productId: 'product_id_1', quantity: 2, price: 10 },
        { productId: 'product_id_2', quantity: 1, price: 20 },
      ],
      total: 40,
      userId: 'user_id',
      status_id: 1,
    };

    const validProduct1 = { id: 'product_id_1', active: true };
    const validProduct2 = { id: 'product_id_2', active: true };

    mockProductDatabase.findPureProductById.mockImplementation((id) => {
      if (id === 'product_id_1') return Promise.resolve(validProduct1);
      if (id === 'product_id_2') return Promise.resolve(validProduct2);
      return Promise.resolve(null);
    });

    mockIdGenerator.generate.mockReturnValue('new_order_id');
    mockOrderDatabase.insertOrder.mockResolvedValue({});
    mockOrderDatabase.insertOrderItem.mockResolvedValue({});

    const result: CreateOrderOutputDTO = await orderBusiness.createOrder(input);

    expect(result).toEqual({
      message: 'Order created successfully',
      order: {
        orderId: 'new_order_id',
        userId: 'user_id',
        orderDate: expect.any(String),
        status: 1,
        total: 40,
        items: [
          { itemId: 'product_id_1', productId: 'product_id_1', quantity: 2, price: 10 },
          { itemId: 'product_id_2', productId: 'product_id_2', quantity: 1, price: 20 },
        ],
      },
    });
    expect(mockOrderDatabase.insertOrder).toHaveBeenCalledWith({
      order_id: 'new_order_id',
      user_id: 'user_id',
      status_id: 1,
      total: 40,
      order_date: expect.any(String),
    });
    expect(mockOrderDatabase.insertOrderItem).toHaveBeenCalledTimes(2);
  });

  test('should throw ForbiddenError if no valid products', async () => {
    const input: CreateOrderInputDTO = {
      items: [
        { productId: 'product_id_1', quantity: 2, price: 10 },
        { productId: 'product_id_2', quantity: 1, price: 20 },
      ],
      total: 40,
      userId: 'user_id',
      status_id: 1,
    };

    mockProductDatabase.findPureProductById.mockImplementation((id) => Promise.resolve(null));

    await expect(orderBusiness.createOrder(input)).rejects.toThrow(ForbiddenError);
  });

  test('should skip invalid products and create order with valid ones', async () => {
    const input: CreateOrderInputDTO = {
      items: [
        { productId: 'product_id_1', quantity: 2, price: 10 },
        { productId: 'product_id_2', quantity: 1, price: 20 },
      ],
      total: 30,
      userId: 'user_id',
      status_id: 1,
    };

    const validProduct = { id: 'product_id_2', active: true };
    const invalidProduct = { id: 'product_id_1', active: false };

    mockProductDatabase.findPureProductById.mockImplementation((id) => {
      if (id === 'product_id_1') return Promise.resolve(invalidProduct);
      if (id === 'product_id_2') return Promise.resolve(validProduct);
      return Promise.resolve(null);
    });

    mockIdGenerator.generate.mockReturnValue('new_order_id');
    mockOrderDatabase.insertOrder.mockResolvedValue({});
    mockOrderDatabase.insertOrderItem.mockResolvedValue({});

    const result: CreateOrderOutputDTO = await orderBusiness.createOrder(input);

    expect(result).toEqual({
      message: 'Order created successfully',
      order: {
        orderId: 'new_order_id',
        userId: 'user_id',
        orderDate: expect.any(String),
        status: 1,
        total: 30,
        items: [
          { itemId: 'product_id_2', productId: 'product_id_2', quantity: 1, price: 20 },
        ],
      },
    });
    expect(mockOrderDatabase.insertOrder).toHaveBeenCalledWith({
      order_id: 'new_order_id',
      user_id: 'user_id',
      status_id: 1,
      total: 30,
      order_date: expect.any(String),
    });
    expect(mockOrderDatabase.insertOrderItem).toHaveBeenCalledWith({
      order_id: 'new_order_id',
      product_id: 'product_id_2',
      quantity: 1,
      price: 20,
    });
  });
});
