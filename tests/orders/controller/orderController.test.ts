import { Request, Response } from "express";
import { OrderController } from "../../../src/controller/OrderController";
import { OrderBusiness } from "../../../src/business/OrderBusiness";
import { CreateOrderInputDTO } from "../../../src/dtos/orders/createOrder.dto";
import { UpdateOrderInputDTO } from "../../../src/dtos/orders/updateOrder.dto";
import ErrorHandler from "../../../src/errors/ErrorHandler";
import logger from "../../../src/logs/logger";

const mockOrderBusiness = {
  createOrder: jest.fn(),
  getOrders: jest.fn(),
  updateOrder: jest.fn(),
  deleteOrder: jest.fn(),
};

const orderController = new OrderController(
  mockOrderBusiness as unknown as OrderBusiness
);

jest.mock("../../../src/logs/logger", () => ({
  error: jest.fn(),
}));

jest.mock("../../../src/errors/ErrorHandler", () => ({
  handleError: jest.fn(),
}));

describe("OrderController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // --------------------------------------------------------------------

  test("should successfully create an order", async () => {
    const input: CreateOrderInputDTO = {
      userId: "user_id",
      items: [
        {
          productId: "product_id_1",
          quantity: 2,
          price: 50,
        },
        {
          productId: "product_id_2",
          quantity: 1,
          price: 150,
        },
      ],
      total: 250,
    };
  
    req.body = input;
  
    mockOrderBusiness.createOrder.mockResolvedValue({
      message: "Order created successfully",
      order: {
        orderId: "aebd89e2-016b-4a4d-877c-1dc8a6009cf2",
        userId: "user_id",
        orderDate: "2024-08-27T23:16:47.947Z",
        status: 1,
        total: 250,
        items: [
          {
            itemId: "item_id_1",
            productId: "product_id_1",
            quantity: 2,
            price: 50,
          },
          {
            itemId: "item_id_2",
            productId: "product_id_2",
            quantity: 1,
            price: 150,
          },
        ],
      },
    });
  
    await orderController.createOrder(req as Request, res as Response);
  
    expect(mockOrderBusiness.createOrder).toHaveBeenCalledWith({
      userId: "user_id",
      items: [
        {
          productId: "product_id_1",
          quantity: 2,
          price: 50,
        },
        {
          productId: "product_id_2",
          quantity: 1,
          price: 150,
        },
      ],
      total: 250,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      message: "Order created successfully",
      order: {
        orderId: "aebd89e2-016b-4a4d-877c-1dc8a6009cf2",
        userId: "user_id",
        orderDate: "2024-08-27T23:16:47.947Z",
        status: 1,
        total: 250,
        items: [
          {
            itemId: "item_id_1",
            productId: "product_id_1",
            quantity: 2,
            price: 50,
          },
          {
            itemId: "item_id_2",
            productId: "product_id_2",
            quantity: 1,
            price: 150,
          },
        ],
      },
    });
  });
  
  // --------------------------------------------------------------------

  test("should handle errors properly in createOrder", async () => {
    const error = new Error("Validation Error");

    req.body = {
      userId: "user_id",
      items: [
        {
          productId: "product_id_1",
          quantity: 2,
          price: 50,
        },
      ],
      status_id: 1,
      total: 100,
    };

    mockOrderBusiness.createOrder.mockRejectedValue(error);

    await orderController.createOrder(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  // --------------------------------------------------------------------

  test("should successfully update an order", async () => {
    const input: UpdateOrderInputDTO = {
      orderId: "order_id",
      items: [
        {
          productId: "product_id_1",
          quantity: 3,
          price: 50,
        },
      ],
      statusId: 2,
      total: 150,
    };

    req.params = { id: "order_id" };
    req.body = input;

    mockOrderBusiness.updateOrder.mockResolvedValue({
      message: "Order updated successfully",
    });

    await orderController.updateOrder(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "Order updated successfully",
    });
  });

  // // --------------------------------------------------------------------

  test("should handle errors properly in updateOrder", async () => {
    const error = new Error("Error Updating Order");

    req.params = { id: "order_id" };
    req.body = {
      items: [
        {
          productId: "product_id_1",
          quantity: 3,
          price: 50,
        },
      ],
      status_id: 2,
      total: 150,
    };

    mockOrderBusiness.updateOrder.mockRejectedValue(error);

    await orderController.updateOrder(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });

  // // --------------------------------------------------------------------

  test("should successfully delete an order", async () => {
    const orderId = "order_id";

    req.params = { id: orderId };

    mockOrderBusiness.deleteOrder.mockResolvedValue({
      message: "Order deleted successfully",
    });

    await orderController.deleteOrder(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "Order deleted successfully",
    });
  });

  // // --------------------------------------------------------------------

  test("should handle errors properly in deleteOrder", async () => {
    const error = new Error("Error Deleting Order");

    req.params = { id: "order_id" };

    mockOrderBusiness.deleteOrder.mockRejectedValue(error);

    await orderController.deleteOrder(req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ErrorHandler.handleError).toHaveBeenCalledWith(error, res);
  });
});
