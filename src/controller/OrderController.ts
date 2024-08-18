import { Request, Response } from "express";
import { OrderBusiness } from "../business/OrderBusiness";
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
  UpdateOrderInputDTO,
  UpdateOrderOutputDTO,
} from "../dtos/orders/updateOrder.dto";
import {
  DeleteOrderSchema,
  DeleteOrderInputDTO,
  CancelOrderInputDTO,
  CancelOrderSchema,
} from "../dtos/orders/deleteOrder.dto";
import { ErrorHandler } from "../errors/ErrorHandler";
import logger from "../logs/logger";

export class OrderController {
  constructor(private orderBusiness: OrderBusiness) {}

  public createOrder = async (req: Request, res: Response) => {
    try {
      const input: CreateOrderInputDTO = CreateOrderSchema.parse({
        token: req.headers.authorization as string,
        items: req.body.items,
        status_id: req.body.status_id,
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

  public getOrders = async (req: Request, res: Response) => {
    try {
      const input = GetOrdersSchema.parse({
        orderId: req.params.id,
        token: req.headers.authorization as string,
      });

      const output: GetOrdersOutputDTO | GetAllOrdersOutputDTO = await this.orderBusiness.getOrders(
        input
      );
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
        token: req.headers.authorization as string,
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
      const output =await this.orderBusiness.getAllStatus();
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
        token: req.headers.authorization as string,
        orderId: req.params.id,
        status_id: req.body.status_id,
        items: req.body.items,
        total: req.body.total,
      });

      console.log(input)

      const output: UpdateOrderOutputDTO = await this.orderBusiness.updateOrder(
        input
      );
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
        token: req.headers.authorization as string,
        orderId: req.params.id,
      });

      await this.orderBusiness.cancelOrder(input);
      res.status(200).send({ message: "Order deleted successfully" });
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };
}
