// Express
import { Request, Response } from "express";

// Business Logic
import { OrderBusiness } from "../business/OrderBusiness";

// DTOs
import {
  CreateOrderSchema,
  CreateOrderInputDTO,
  CreateOrderOutputDTO,
} from "../dtos/orders/createOrder.dto";
import {
  GetOrdersSchema,
  GetOrdersOutputDTO,
  GetAllOrdersSchema,
  GetAllOrdersOutputDTO,
} from "../dtos/orders/getOrder.dto";
import {
  UpdateOrderSchema,
  UpdateOrderInputDTO
} from "../dtos/orders/updateOrder.dto";
import {
  DeleteOrderSchema,
  DeleteOrderInputDTO,
  CancelOrderInputDTO,
  CancelOrderSchema,
} from "../dtos/orders/deleteOrder.dto";

// Errors
import ErrorHandler from "../errors/ErrorHandler";

// Logging
import logger from "../logs/logger";

export class OrderController {
  constructor(private orderBusiness: OrderBusiness) {}

  public createOrder = async (req: Request, res: Response) => {
    try {
      const input: CreateOrderInputDTO = CreateOrderSchema.parse({
        userId: req.body.userId,
        items: req.body.items,
        total: req.body.total,
      });

      const output: CreateOrderOutputDTO = await this.orderBusiness.createOrder(
        input
      );
      res.status(201).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public getUserOrders = async (req: Request, res: Response) => {
    try {
      const input = GetOrdersSchema.parse({
        userId: req.body.userId,
        orderId: req.body.orderId,
      });

      const output: GetOrdersOutputDTO | GetAllOrdersOutputDTO =
        await this.orderBusiness.getUserOrders(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public getAllOrders = async (req: Request, res: Response) => {
    try {
      const input = GetAllOrdersSchema.parse({
        userId: req.body.userId,
      });

      const output: GetAllOrdersOutputDTO =
        await this.orderBusiness.getAllOrders(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };
  // --------------------------------------------------------------------

  public getAllStatus = async (req: Request, res: Response) => {
    try {
      const output = await this.orderBusiness.getAllStatus();
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public updateOrder = async (req: Request, res: Response) => {
    try {
      const input: UpdateOrderInputDTO = UpdateOrderSchema.parse({
        orderId: req.params.id,
        statusId: req.body.statusId,
        items: req.body.items,
        trackingCode: req.body.trackingCode,
        total: req.body.total,
      });

      const output = await this.orderBusiness.updateOrder(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public cancelOrder = async (req: Request, res: Response) => {
    try {
      const input: CancelOrderInputDTO = CancelOrderSchema.parse({
        orderId: req.params.id,
      });

      await this.orderBusiness.cancelOrder(input);
      res.status(200).send({ message: "Order deleted successfully" });
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // --------------------------------------------------------------------

  public deleteOrder = async (req: Request, res: Response) => {
    try {
      const input: DeleteOrderInputDTO = DeleteOrderSchema.parse({
        orderId: req.params.id,
      });

      await this.orderBusiness.deleteOrder(input);
      res.status(200).send({ message: "Order deleted successfully" });
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };
}
