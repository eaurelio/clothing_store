import { Request, Response } from "express";
import { OrderBusiness } from "../business/OrderBusiness";
import {
  CreateOrderSchema,
  CreateOrderInputDTO,
  CreateOrderOutputDTO
} from "../dtos/orders/createOrder.dto";
import {
  GetOrdersSchema,
  GetOrdersInputDTO,
  GetOrdersOutputDTO
} from "../dtos/orders/getOrder.dto";
import {
  UpdateOrderSchema,
  UpdateOrderInputDTO,
  UpdateOrderOutputDTO
} from "../dtos/orders/updateOrder.dto";
import { ErrorHandler } from "../errors/ErrorHandler";
import logger from "../logs/logger";

export class OrderController {
  constructor(private orderBusiness: OrderBusiness) {}

  // ------------------------------------------------------------------------------------------------------------------
  // ORDERS
  // ------------------------------------------------------------------------------------------------------------------

  public createOrder = async (req: Request, res: Response) => {
    try {
      const input: CreateOrderInputDTO = CreateOrderSchema.parse({
        token: req.headers.authorization as string,
        userId: req.body.userId,
        items: req.body.items,
        status_id: req.body.status_id,
        total: req.body.total
      });

      const output: CreateOrderOutputDTO = await this.orderBusiness.createOrder(input);
      res.status(201).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  public getOrder = async (req: Request, res: Response) => {
    try {
      const input = GetOrdersSchema.parse({
        token: req.headers.authorization as string,
        userId: req.params.userId
      });

      const output: GetOrdersOutputDTO = await this.orderBusiness.getOrder(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  // public getAllOrders = async (req: Request, res: Response) => {
  //   try {
  //     const input = GetOrdersSchema.parse({
  //       token: req.headers.authorization as string,
  //       userId: req.query.userId as string
  //     });

  //     const output: GetOrdersOutputDTO = await this.orderBusiness.getAllOrders(input);
  //     res.status(200).send(output);
  //   } catch (error) {
  //     logger.error(error);
  //     ErrorHandler.handleError(error, res);
  //   }
  // };

  // public updateOrder = async (req: Request, res: Response) => {
  //   try {
  //     const input: UpdateOrderInputDTO = UpdateOrderSchema.parse({
  //       token: req.headers.authorization as string,
  //       orderId: req.params.id,
  //       status: req.body.status,
  //       items: req.body.items,
  //       total: req.body.total
  //     });

  //     const output: UpdateOrderOutputDTO = await this.orderBusiness.updateOrder(input);
  //     res.status(200).send(output);
  //   } catch (error) {
  //     logger.error(error);
  //     ErrorHandler.handleError(error, res);
  //   }
  // };

  // public deleteOrder = async (req: Request, res: Response) => {
  //   try {
  //     const input = {
  //       token: req.headers.authorization as string,
  //       orderId: req.params.id
  //     };

  //     const output = await this.orderBusiness.deleteOrder(input);
  //     res.status(200).send({ message: "Order deleted successfully" });
  //   } catch (error) {
  //     logger.error(error);
  //     ErrorHandler.handleError(error, res);
  //   }
  // };
}
