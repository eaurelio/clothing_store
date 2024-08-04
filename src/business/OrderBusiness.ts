import {
  CreateOrderInputDTO,
  CreateOrderOutputDTO,
} from "../dtos/orders/createOrder.dto";
import {
  GetAllOrdersInputDTO,
  GetAllOrdersOutputDTO,
  GetOrdersInputDTO,
  GetOrdersOutputDTO,
} from "../dtos/orders/getOrder.dto";
import {
  UpdateOrderInputDTO,
  UpdateOrderOutputDTO,
} from "../dtos/orders/updateOrder.dto";

import { Order, OrderDB } from "../models/Order";
import { OrderDatabase } from "../database/OrderDatabase";
import TokenService from "../services/TokenService";
import { IdGenerator } from "../services/idGenerator";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";
import { HashManager } from "../services/HashManager";
import { ErrorHandler } from "../errors/ErrorHandler";
import { OrderItemDB } from "../models/OrderItem";

export class OrderBusiness {
  constructor(
    private orderDatabase: OrderDatabase,
    private idGenerator: IdGenerator,
    private tokenService: TokenService,
    private hashmanager: HashManager,
    private errorHandler: ErrorHandler
  ) {}

  // ------------------------------------------------------------------------------------------------------------------
  // CREATE ORDER
  // ------------------------------------------------------------------------------------------------------------------

  public createOrder = async (
    input: CreateOrderInputDTO
  ): Promise<CreateOrderOutputDTO> => {
    const { token, items, status_id, total } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new UnauthorizedError("Invalid token");
    }

    const id = this.idGenerator.generate();
    const orderDate = new Date().toISOString();

    const newOrder = new Order(id, userId, items, status_id, total, orderDate);

    const newOrderDB: OrderDB = {
      order_id: newOrder.getOrderId(),
      user_id: newOrder.getUserId(),
      status_id: newOrder.getStatusId(),
      total: newOrder.getTotal(),
      order_date: newOrder.getOrderDate(),
    };

    await this.orderDatabase.insertOrder(newOrderDB);

    // Inserir os itens do pedido
    if (items && items.length > 0) {
      for (const item of items) {
        const itemData = {
          item_id: await this.idGenerator.generate(),
          order_id: newOrder.getOrderId(),
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
        };

        await this.orderDatabase.insertOrderItem(itemData);
      }
    }

    const output: CreateOrderOutputDTO = {
      message: "Order created successfully",
      order: {
        orderId: newOrder.getOrderId(),
        userId: newOrder.getUserId(),
        orderDate: newOrder.getOrderDate(),
        status: newOrder.getStatusId(),
        total: newOrder.getTotal(),
        items: items.map(item => ({
          itemId: item.productId, 
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    };

    return output;
  };
  

  // ------------------------------------------------------------------------------------------------------------------
  // GET ORDER
  // ------------------------------------------------------------------------------------------------------------------

  public getOrder = async (
    input: GetOrdersInputDTO
  ): Promise<GetOrdersOutputDTO> => {
    const { token, orderId } = input;
  
    const userId = this.tokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new UnauthorizedError("Invalid token");
    }
  
    const orderDB = await this.orderDatabase.findOrderById(orderId);
  
    if (!orderDB || orderDB.user_id !== userId) {
      throw new NotFoundError("Order not found");
    }
  
    const orderItemsDB = await this.orderDatabase.findOrderItemsByOrderId(orderId);
  
    const items = orderItemsDB.map((item: OrderItemDB) => ({
      itemId: item.item_id,
      productId: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));
  
    const output: GetOrdersOutputDTO = {
      order: {
        orderId: orderDB.order_id,
        userId: orderDB.user_id,
        status: orderDB.status_id,
        total: orderDB.total,
        orderDate: orderDB.order_date,
        items: items,
      },
    };
  
    return output;
  };
  

  // ------------------------------------------------------------------------------------------------------------------
  // GET ALL ORDERS
  // ------------------------------------------------------------------------------------------------------------------

  public getAllOrders = async (
    input: GetAllOrdersInputDTO
  ): Promise<GetAllOrdersOutputDTO> => {
    const { token } = input;
  
    const userId = this.tokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new UnauthorizedError("Invalid token");
    }
  
    const ordersDB = await this.orderDatabase.findOrdersByUserId(userId);
  
    const ordersWithItems = await Promise.all(
      ordersDB.map(async (order: OrderDB) => {
        const itemsDB = await this.orderDatabase.findOrderItemsByOrderId(order.order_id);
        const items = itemsDB.map((item: OrderItemDB) => ({
          itemId: item.item_id,
          productId: item.product_id,
          quantity: item.quantity,
          price: item.price,
        }));
  
        return {
          orderId: order.order_id,
          userId: order.user_id,
          status: order.status_id,
          total: order.total,
          orderDate: order.order_date,
          items: items,
        };
      })
    );
  
    const output: GetAllOrdersOutputDTO = {
      orders: ordersWithItems,
    };
  
    return output;
  };

  // ------------------------------------------------------------------------------------------------------------------
  // UPDATE ORDER
  // ------------------------------------------------------------------------------------------------------------------

  public updateOrder = async (
    input: UpdateOrderInputDTO
  ): Promise<UpdateOrderOutputDTO> => {
    const { token, orderId, status, items, total } = input;
  
    // Validar o token e obter o ID do usuário
    const userId = this.tokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new UnauthorizedError("Invalid token");
    }
  
    // Buscar o pedido no banco de dados
    const orderDB = await this.orderDatabase.findOrderById(orderId);
    if (!orderDB || orderDB.user_id !== userId) {
      throw new NotFoundError("Order not found");
    }
  
    // Atualizar os campos do pedido conforme necessário
    const updatedOrderDB: OrderDB = {
      ...orderDB,
      status: status !== undefined ? status : orderDB.status,
      total: total !== undefined ? total : orderDB.total,
    };
  
    // Atualizar o pedido no banco de dados
    await this.orderDatabase.updateOrder(orderId, updatedOrderDB);
  
    // Se houver itens fornecidos, atualizar os itens do pedido
    if (items && items.length > 0) {
      // Remover os itens antigos
      await this.orderDatabase.deleteOrderItemsByOrderId(orderId);
  
      // Inserir os novos itens
      for (const item of items) {
        const newItemData: OrderItemDB = {
          item_id: this.idGenerator.generate(),
          order_id: orderId,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
        };
  
        await this.orderDatabase.insertOrderItem(newItemData);
      }
    }
  
    // Buscar os itens atualizados do pedido no banco de dados
    const updatedItemsDB = await this.orderDatabase.findOrderItemsByOrderId(orderId);
    const updatedItems = updatedItemsDB.map((item: OrderItemDB) => ({
      itemId: item.item_id,
      productId: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));
  
    // Montar o objeto de resposta
    const output: UpdateOrderOutputDTO = {
      message: "Order updated successfully",
      order: {
        orderId: orderDB.order_id,
        userId: orderDB.user_id,
        orderDate: orderDB.order_date,
        status: updatedOrderDB.status,
        total: updatedOrderDB.total,
        items: updatedItems,
      },
    };
  
    return output;
  };
  
  
}
