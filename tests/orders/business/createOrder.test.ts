import { OrderBusiness } from "../../../src/business/OrderBusiness";
import { OrderDatabase } from "../../../src/database/OrderDatabase";
import { ProductDatabase } from "../../../src/database/ProductDatabase";
import { IdGenerator } from "../../../src/services/idGenerator";
import {
  CreateOrderInputDTO,
  CreateOrderOutputDTO,
} from "../../../src/dtos/orders/createOrder.dto";
import { ForbiddenError } from "../../../src/errors/Errors";

const mockOrderDatabase = {
  insertOrder: jest.fn(),
  insertOrderItem: jest.fn(),
};

const mockProductDatabase = {
  findPureProductById: jest.fn(),
};

const mockIdGenerator = {
  generate: jest.fn(),
};

const orderBusiness = new OrderBusiness(
  mockOrderDatabase as unknown as OrderDatabase,
  mockProductDatabase as unknown as ProductDatabase,
  {} as any,
  mockIdGenerator as unknown as IdGenerator,
  {} as any,
  {} as any,
  {} as any
);

describe("OrderBusiness - createOrder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully create an order with valid items", async () => {
    const input: CreateOrderInputDTO = {
      userId: "user_id",
      total: 100,
      items: [
        { productId: "product_id_1", quantity: 2, price: 50 },
        { productId: "product_id_2", quantity: 1, price: 50 },
      ],
    };

    const validProduct1 = { id: "product_id_1", active: true };
    const validProduct2 = { id: "product_id_2", active: true };

    mockIdGenerator.generate
      .mockReturnValueOnce("order_id")
      .mockReturnValueOnce("item_id_1")
      .mockReturnValueOnce("item_id_2");
    mockProductDatabase.findPureProductById
      .mockResolvedValueOnce(validProduct1)
      .mockResolvedValueOnce(validProduct2);

    const result: CreateOrderOutputDTO = await orderBusiness.createOrder(input);

    expect(result).toEqual({
      message: "Order created successfully",
      order: {
        orderId: "order_id",
        userId: "user_id",
        orderDate: expect.any(String),
        status: 1,
        total: 100,
        items: [
          {
            itemId: "product_id_1",
            productId: "product_id_1",
            quantity: 2,
            price: 50,
          },
          {
            itemId: "product_id_2",
            productId: "product_id_2",
            quantity: 1,
            price: 50,
          },
        ],
      },
    });
    expect(mockOrderDatabase.insertOrder).toHaveBeenCalled();
    expect(mockOrderDatabase.insertOrderItem).toHaveBeenCalledTimes(2);
  });

  test("should throw ForbiddenError when no valid items are found", async () => {
    const input: CreateOrderInputDTO = {
      userId: "user_id",
      total: 100,
      items: [{ productId: "invalid_product_id", quantity: 2, price: 50 }],
    };

    mockProductDatabase.findPureProductById.mockResolvedValueOnce(null);

    await expect(orderBusiness.createOrder(input)).rejects.toThrow(
      ForbiddenError
    );
    expect(mockOrderDatabase.insertOrder).not.toHaveBeenCalled();
    expect(mockOrderDatabase.insertOrderItem).not.toHaveBeenCalled();
  });

  test("should create an order with valid items and skip invalid ones", async () => {
    const input: CreateOrderInputDTO = {
      userId: "user_id",
      total: 100,
      items: [
        { productId: "invalid_product_id", quantity: 2, price: 50 },
        { productId: "product_id_2", quantity: 1, price: 50 },
      ],
    };

    const validProduct2 = { id: "product_id_2", active: true };

    mockIdGenerator.generate
      .mockReturnValueOnce("order_id")
      .mockReturnValueOnce("item_id_2");
    mockProductDatabase.findPureProductById
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(validProduct2);

    const result: CreateOrderOutputDTO = await orderBusiness.createOrder(input);

    expect(result).toEqual({
      message: "Order created successfully",
      order: {
        orderId: "order_id",
        userId: "user_id",
        orderDate: expect.any(String),
        status: 1,
        total: 100,
        items: [
          {
            itemId: "product_id_2",
            productId: "product_id_2",
            quantity: 1,
            price: 50,
          },
        ],
      },
    });
    expect(mockOrderDatabase.insertOrder).toHaveBeenCalled();
    expect(mockOrderDatabase.insertOrderItem).toHaveBeenCalledTimes(1);
  });
});
