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
} from "../dtos/orders/updateOrder.dto";
import {
  DeleteOrderSchema,
  DeleteOrderInputDTO,
  CancelOrderInputDTO,
  CancelOrderSchema,
} from "../dtos/orders/deleteOrder.dto";

import ErrorHandler from "../errors/ErrorHandler";

import logger from "../logs/logger";

export class OrderController {
  constructor(private orderBusiness: OrderBusiness) {
    this.createOrder = this.createOrder.bind(this);
    this.getUserOrders = this.getUserOrders.bind(this);
    this.getAllOrders = this.getAllOrders.bind(this);
    this.getAllStatus = this.getAllStatus.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
  }

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

  public getAllStatus = async (req: Request, res: Response) => {
    try {
      const output = await this.orderBusiness.getAllStatus();
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

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

  public cancelOrder = async (req: Request, res: Response) => {
    try {
      const input: CancelOrderInputDTO = CancelOrderSchema.parse({
        orderId: req.params.id,
        userId: req.body.userId,
      });

      const token = req.headers.authorization;

      const output = await this.orderBusiness.cancelOrder(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };

  public deleteOrder = async (req: Request, res: Response) => {
    try {
      const input: DeleteOrderInputDTO = DeleteOrderSchema.parse({
        orderId: req.params.id,
      });

      const output = await this.orderBusiness.deleteOrder(input);
      res.status(200).send(output);
    } catch (error) {
      logger.error(error);
      ErrorHandler.handleError(error, res);
    }
  };
}
