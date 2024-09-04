import { OrderBusiness } from "../../../src/business/OrderBusiness";
import { OrderDatabase } from "../../../src/database/OrderDatabase";
import { ProductDatabase } from "../../../src/database/ProductDatabase";
import { UserDatabase } from "../../../src/database/UserDatabase";
import { IdGenerator } from "../../../src/services/idGenerator";
import {
  UpdateOrderInputDTO,
  UpdateOrderOutputDTO,
} from "../../../src/dtos/orders/updateOrder.dto";
import { NotFoundError } from "../../../src/errors/Errors";

const mockOrderDatabase = {
  findPureOrderById: jest.fn(),
  updateOrder: jest.fn(),
  deleteOrderItemsByOrderId: jest.fn(),
  insertOrderItem: jest.fn(),
  findOrderItemsByOrderId: jest.fn(),
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

describe("OrderBusiness - updateOrder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully update an order without items", async () => {
    const input: UpdateOrderInputDTO = {
      orderId: "order_id",
      statusId: 2,
      total: 50,
      trackingCode: "new_tracking_code",
      items: undefined,
    };

    const existingOrder = {
      order_id: "order_id",
      user_id: "user_id",
      status_id: 1,
      total: 40,
      order_date: "2023-08-25",
      tracking_code: "old_tracking_code",
    };

    mockOrderDatabase.findPureOrderById.mockResolvedValue(existingOrder);
    mockOrderDatabase.updateOrder.mockResolvedValue({});
    mockOrderDatabase.findOrderItemsByOrderId.mockResolvedValue([]);

    const result: UpdateOrderOutputDTO = await orderBusiness.updateOrder(input);

    expect(result).toEqual({
      message: "Order updated successfully",
      order: {
        orderId: "order_id",
        userId: "user_id",
        orderDate: "2023-08-25",
        status: 2,
        total: 50,
        trackingCode: "new_tracking_code",
        items: [],
      },
    });
    expect(mockOrderDatabase.updateOrder).toHaveBeenCalledWith("order_id", {
      order_id: "order_id",
      user_id: "user_id",
      status_id: 2,
      total: 50,
      tracking_code: "new_tracking_code",
      order_date: "2023-08-25",
    });
  });

  test("should successfully update an order with items", async () => {
    const input: UpdateOrderInputDTO = {
      orderId: "order_id",
      statusId: 2,
      total: 60,
      trackingCode: "new_tracking_code",
      items: [
        { productId: "product_id_1", quantity: 2, price: 10 },
        { productId: "product_id_2", quantity: 3, price: 20 },
      ],
    };

    const existingOrder = {
      order_id: "order_id",
      user_id: "user_id",
      status_id: 1,
      total: 40,
      order_date: "2023-08-25",
      tracking_code: "old_tracking_code",
    };

    const validProduct1 = { id: "product_id_1", active: true };
    const validProduct2 = { id: "product_id_2", active: true };

    mockOrderDatabase.findPureOrderById.mockResolvedValue(existingOrder);
    mockOrderDatabase.updateOrder.mockResolvedValue({});
    mockOrderDatabase.deleteOrderItemsByOrderId.mockResolvedValue({});
    mockOrderDatabase.insertOrderItem.mockResolvedValue({});
    mockOrderDatabase.findOrderItemsByOrderId.mockResolvedValue([
      {
        item_id: "item_id_1",
        product_id: "product_id_1",
        quantity: 2,
        price: 10,
      },
      {
        item_id: "item_id_2",
        product_id: "product_id_2",
        quantity: 3,
        price: 20,
      },
    ]);

    mockProductDatabase.findPureProductById.mockImplementation((id) => {
      if (id === "product_id_1") return Promise.resolve(validProduct1);
      if (id === "product_id_2") return Promise.resolve(validProduct2);
      return Promise.resolve(null);
    });

    const result: UpdateOrderOutputDTO = await orderBusiness.updateOrder(input);

    expect(result).toEqual({
      message: "Order updated successfully",
      order: {
        orderId: "order_id",
        userId: "user_id",
        orderDate: "2023-08-25",
        status: 2,
        total: 60,
        trackingCode: "new_tracking_code",
        items: [
          {
            itemId: "item_id_1",
            productId: "product_id_1",
            quantity: 2,
            price: 10,
          },
          {
            itemId: "item_id_2",
            productId: "product_id_2",
            quantity: 3,
            price: 20,
          },
        ],
      },
    });

    expect(mockOrderDatabase.updateOrder).toHaveBeenCalledWith("order_id", {
      order_id: "order_id",
      user_id: "user_id",
      status_id: 2,
      total: 60,
      tracking_code: "new_tracking_code",
      order_date: "2023-08-25",
    });
    expect(mockOrderDatabase.deleteOrderItemsByOrderId).toHaveBeenCalledWith(
      "order_id"
    );
    expect(mockOrderDatabase.insertOrderItem).toHaveBeenCalledTimes(2);
  });

  test("should throw NotFoundError if the order does not exist", async () => {
    const input: UpdateOrderInputDTO = {
      orderId: "non_existent_order_id",
      statusId: 2,
      total: 60,
      trackingCode: "new_tracking_code",
      items: [
        { productId: "product_id_1", quantity: 2, price: 10 },
        { productId: "product_id_2", quantity: 3, price: 20 },
      ],
    };

    mockOrderDatabase.findPureOrderById.mockResolvedValue(null);

    await expect(orderBusiness.updateOrder(input)).rejects.toThrow(
      NotFoundError
    );
  });

  test("should skip invalid products and update order with valid ones", async () => {
    const input: UpdateOrderInputDTO = {
      orderId: "order_id",
      statusId: 2,
      total: 60,
      trackingCode: "new_tracking_code",
      items: [
        { productId: "product_id_1", quantity: 2, price: 10 },
        { productId: "product_id_2", quantity: 3, price: 20 },
      ],
    };

    const existingOrder = {
      order_id: "order_id",
      user_id: "user_id",
      status_id: 1,
      total: 40,
      order_date: "2023-08-25",
      tracking_code: "old_tracking_code",
    };

    const validProduct = { id: "product_id_2", active: true };
    const invalidProduct = { id: "product_id_1", active: false };

    mockOrderDatabase.findPureOrderById.mockResolvedValue(existingOrder);
    mockOrderDatabase.updateOrder.mockResolvedValue({});
    mockOrderDatabase.deleteOrderItemsByOrderId.mockResolvedValue({});
    mockOrderDatabase.insertOrderItem.mockResolvedValue({});
    mockOrderDatabase.findOrderItemsByOrderId.mockResolvedValue([
      {
        item_id: "item_id_2",
        product_id: "product_id_2",
        quantity: 3,
        price: 20,
      },
    ]);

    mockProductDatabase.findPureProductById.mockImplementation((id) => {
      if (id === "product_id_1") return Promise.resolve(invalidProduct);
      if (id === "product_id_2") return Promise.resolve(validProduct);
      return Promise.resolve(null);
    });

    const result: UpdateOrderOutputDTO = await orderBusiness.updateOrder(input);

    expect(result).toEqual({
      message: "Order updated successfully",
      order: {
        orderId: "order_id",
        userId: "user_id",
        orderDate: "2023-08-25",
        status: 2,
        total: 60,
        trackingCode: "new_tracking_code",
        items: [
          {
            itemId: "item_id_2",
            productId: "product_id_2",
            quantity: 3,
            price: 20,
          },
        ],
      },
    });

    expect(mockOrderDatabase.updateOrder).toHaveBeenCalledWith("order_id", {
      order_id: "order_id",
      user_id: "user_id",
      status_id: 2,
      total: 60,
      tracking_code: "new_tracking_code",
      order_date: "2023-08-25",
    });
    expect(mockOrderDatabase.deleteOrderItemsByOrderId).toHaveBeenCalledWith(
      "order_id"
    );
    expect(mockOrderDatabase.insertOrderItem).toHaveBeenCalledTimes(1);
  });
});
