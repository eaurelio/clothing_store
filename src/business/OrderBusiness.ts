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

import { Order, OrderDB, OrderDBOutput } from "../models/Order";
import { OrderDatabase } from "../database/OrderDatabase";
import TokenService from "../services/TokenService";
import { IdGenerator } from "../services/idGenerator";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";
import { HashManager } from "../services/HashManager";
import { ErrorHandler } from "../errors/ErrorHandler";
import { OrderItemDB } from "../models/OrderItem";
import { ForbiddenError } from "../errors/ForbiddenError";
import { ProductDatabase } from "../database/ProductDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { USER_ROLES } from "../models/User";
import {
  CancelOrderInputDTO,
  CancelOrderOutputDTO,
  DeleteOrderInputDTO,
  DeleteOrderOutputDTO,
} from "../dtos/orders/deleteOrder.dto";

export class OrderBusiness {
  constructor(
    private orderDatabase: OrderDatabase,
    private productDatabase: ProductDatabase,
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenService: TokenService,
    private hashmanager: HashManager,
    private errorHandler: ErrorHandler
  ) {}


  public createOrder = async (
    input: CreateOrderInputDTO
  ): Promise<CreateOrderOutputDTO> => {
    const { items, total, userId } = input;

    const orderId = this.idGenerator.generate();
    const orderDate = new Date().toISOString();
    const status_id = 1;

    const validItems = [];

    for (const item of items) {
      const product = await this.productDatabase.findPureProductById(
        item.productId
      );
      if (!product) {
        console.log(`Product with ID ${item.productId} not found`);
        continue;
      }

      if (!product.active) {
        console.log(`Product with ID ${item.productId} is deactivated`);
        continue;
      }

      validItems.push(item);
    }

    if (validItems.length === 0) {
      throw new ForbiddenError("No valid products to create an order.");
    }

    const newOrder = new Order(
      orderId,
      userId,
      validItems,
      status_id,
      total,
      orderDate
    );

    const newOrderDB: OrderDB = {
      order_id: newOrder.getOrderId(),
      user_id: newOrder.getUserId(),
      status_id: newOrder.getStatusId(),
      total: newOrder.getTotal(),
      order_date: newOrder.getOrderDate(),
    };

    await this.orderDatabase.insertOrder(newOrderDB);

    if (validItems.length > 0) {
      for (const item of validItems) {
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
        items: validItems.map((item) => ({
          itemId: item.productId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    };

    return output;
  };

  // --------------------------------------------------------------------

  public getUserOrders = async (
    input: GetOrdersInputDTO
  ): Promise<GetOrdersOutputDTO | GetAllOrdersOutputDTO> => {
    const { userId, orderId } = input;

    if (orderId) {
      const orderDB = await this.orderDatabase.findOrderById(orderId);
      if (!orderDB || orderDB.user_id !== userId) {
        throw new NotFoundError("Order not found");
      }

      const orderItemsDB = await this.orderDatabase.findOrderItemsByOrderId(
        orderId
      );
      const items = orderItemsDB.map((item: OrderItemDB) => ({
        itemId: item.item_id,
        productId: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }));

      return {
        order: {
          orderId: orderDB.order_id,
          userId: orderDB.user_id,
          status_name: orderDB.status_name,
          total: orderDB.total,
          orderDate: orderDB.order_date,
          trackingCode: orderDB.tracking_code,
          items: items
        },
      };
    } else {
      // Fetch all orders for the user
      const ordersDB = await this.orderDatabase.findOrdersByUserId(userId);
      const ordersWithItems = await Promise.all(
        ordersDB.map(async (order: OrderDBOutput) => {
          const itemsDB = await this.orderDatabase.findOrderItemsByOrderId(
            order.order_id
          );
          const items = itemsDB.map((item: OrderItemDB) => ({
            itemId: item.item_id,
            productId: item.product_id,
            quantity: item.quantity,
            price: item.price,
          }));

          return {
            orderId: order.order_id,
            userId: order.user_id,
            status_name: order.status_name,
            total: order.total,
            orderDate: order.order_date,
            trackingCode: order.tracking_code,
            items: items,
          };
        })
      );

      return {
        orders: ordersWithItems,
      };
    }
  };

  // --------------------------------------------------------------------

  public getAllStatus = async () => {
    const status = await this.orderDatabase.getAllStatus();
    return status;
  };

  // --------------------------------------------------------------------

  public getAllOrders = async (
    input: GetAllOrdersInputDTO
  ): Promise<GetAllOrdersOutputDTO> => {
    const { userId } = input;

    const ordersDB = await this.orderDatabase.findOrdersByUserId(
      userId === undefined ? undefined : userId
    );

    const ordersWithItems = await Promise.all(
      ordersDB.map(async (order: OrderDBOutput) => {
        const itemsDB = await this.orderDatabase.findOrderItemsByOrderId(
          order.order_id
        );
        const items = itemsDB.map((item: OrderItemDB) => ({
          itemId: item.item_id,
          productId: item.product_id,
          quantity: item.quantity,
          price: item.price,
        }));

        return {
          orderId: order.order_id,
          userId: order.user_id,
          status_name: order.status_name,
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

  // --------------------------------------------------------------------

  // public updateOrder = async (
  //   input: UpdateOrderInputDTO
  // ): Promise<UpdateOrderOutputDTO> => {
  //   const { orderId, statusId, total, items } = input;

  //   const orderDB = await this.orderDatabase.findOrderById(orderId);
  //   if (!orderDB) {
  //     throw new NotFoundError("Order not found");
  //   }

  //   const updatedOrderDB: OrderDB = {
  //     ...orderDB,
  //     statusId: statusId ?? orderDB.status_id,
  //     total: total ?? orderDB.total,
  //   };

  //   await this.orderDatabase.updateOrder(orderId, updatedOrderDB);

  //   await this.orderDatabase.deleteOrderItemsByOrderId(orderId);

  //   if (items) {
  //     for (const item of items) {
  //       const productDB = await this.productDatabase.findProductById(
  //         item.productId
  //       );
  //       if (!productDB || !productDB.active) {
  //         throw new ForbiddenError(`Product ${item.productId} is deactivated`);
  //       }

  //       const newOrderItemDB: OrderItemDB = {
  //         item_id: this.idGenerator.generate(),
  //         order_id: orderId,
  //         product_id: item.productId,
  //         quantity: item.quantity,
  //         price: item.price,
  //       };
  //       await this.orderDatabase.insertOrderItem(newOrderItemDB);
  //     }
  //   }

  //   const updatedItemsDB = await this.orderDatabase.findOrderItemsByOrderId(
  //     orderId
  //   );
  //   const updatedItems = updatedItemsDB.map((item: OrderItemDB) => ({
  //     itemId: item.item_id,
  //     productId: item.product_id,
  //     quantity: item.quantity,
  //     price: item.price,
  //   }));

  //   const output: UpdateOrderOutputDTO = {
  //     message: "Order updated successfully",
  //     order: {
  //       orderId: updatedOrderDB.order_id,
  //       userId: updatedOrderDB.user_id,
  //       orderDate: updatedOrderDB.order_date,
  //       status: updatedOrderDB.status_id,
  //       total: updatedOrderDB.total,
  //       items: updatedItems,
  //     },
  //   };

  //   return output;
  // };

  // public updateOrder = async (
  //   input: UpdateOrderInputDTO
  // ): Promise<UpdateOrderOutputDTO> => {
  //   const { orderId, statusId, total } = input;
  
  //   // Verifica se o pedido existe
  //   const orderDB = await this.orderDatabase.findOrderById(orderId);
  //   if (!orderDB) {
  //     throw new NotFoundError("Order not found");
  //   }
  
  //   // Atualiza o pedido na base de dados
  //   const updatedOrderDB: Partial<OrderDB> = {
  //     status_id: statusId ?? orderDB.status_id,
  //     total: total ?? orderDB.total,
  //   };
  
  //   await this.orderDatabase.updateOrder(orderId, updatedOrderDB);
  
  //   // Recupera os itens atualizados do pedido
  //   const updatedItemsDB = await this.orderDatabase.findOrderItemsByOrderId(orderId);
  //   const updatedItems = updatedItemsDB.map((item: OrderItemDB) => ({
  //     itemId: item.item_id,
  //     productId: item.product_id,
  //     quantity: item.quantity,
  //     price: item.price,
  //   }));
  
  //   // Prepara a resposta
  //   const output: UpdateOrderOutputDTO = {
  //     message: "Order updated successfully",
  //     order: {
  //       orderId: orderId,
  //       userId: orderDB.user_id,
  //       orderDate: orderDB.order_date,
  //       status: updatedOrderDB.status_id ?? orderDB.status_id,
  //       total: updatedOrderDB.total ?? orderDB.total,
  //       items: updatedItems,
  //     },
  //   };
  
  //   return output;
  // };

  public updateOrder = async (
    input: UpdateOrderInputDTO
  ): Promise<UpdateOrderOutputDTO> => {
    const { orderId, statusId, total, items, trackingCode } = input;

    const orderDB = await this.orderDatabase.findPureOrderById(orderId);
    if (!orderDB) {
      throw new NotFoundError("Order not found");
    }
  
    const updatedOrderDB: OrderDB = {
      ...orderDB,
      status_id: statusId ?? orderDB.status_id,
      total: total ?? orderDB.total,
      tracking_code: trackingCode ?? orderDB.tracking_code,
    };
  
    await this.orderDatabase.updateOrder(orderId, updatedOrderDB);
  
    if (items) {
      await this.orderDatabase.deleteOrderItemsByOrderId(orderId);
  
      for (const item of items) {
        const productDB = await this.productDatabase.findPureProductById(item.productId);
  
        if (!productDB) {
          console.log(`Product with ID ${item.productId} not found`);
          continue;
        }
  
        if (!productDB.active) {
          console.log(`Product with ID ${item.productId} is deactivated`);
          continue;
        }
  
        const newOrderItemDB: OrderItemDB = {
          item_id: this.idGenerator.generate(),
          order_id: orderId,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
        };
  
        await this.orderDatabase.insertOrderItem(newOrderItemDB);
      }
    }
  
    const updatedItemsDB = await this.orderDatabase.findOrderItemsByOrderId(orderId);
    const updatedItems = updatedItemsDB.map((item: OrderItemDB) => ({
      itemId: item.item_id,
      productId: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));
  
    const output: UpdateOrderOutputDTO = {
      message: "Order updated successfully",
      order: {
        orderId: updatedOrderDB.order_id,
        userId: updatedOrderDB.user_id,
        orderDate: updatedOrderDB.order_date,
        status: updatedOrderDB.status_id,
        total: updatedOrderDB.total,
        trackingCode: updatedOrderDB.tracking_code, // Inclui o código de rastreamento na resposta
        items: updatedItems,
      },
    };
  
    return output;
  };

  // --------------------------------------------------------------------

  public cancelOrder = async (
    input: CancelOrderInputDTO
  ): Promise<CancelOrderOutputDTO> => {
    const { orderId } = input;

    const orderDB = await this.orderDatabase.findPureOrderById(orderId);
    if (!orderDB) {
      throw new NotFoundError("Order not found");
    }

    if (orderDB.status_id !== 1) {
      throw new UnauthorizedError(
        "Order cannot be canceled as its status is not 'Pending'"
      );
    }

    await this.orderDatabase.cancelOrderById(orderId);

    return {
      message: "Order Cancelled sussesfully",
    };
  };

  public deleteOrder = async (
    input: DeleteOrderInputDTO
  ): Promise<DeleteOrderOutputDTO> => {
    const { orderId } = input;

    const orderDB = await this.orderDatabase.findOrderById(orderId);
    if (!orderDB) {
      throw new NotFoundError("Order not found");
    }

    await this.orderDatabase.deleteOrderItemsByOrderId(orderId);
    await this.orderDatabase.deleteOrder(orderId);

    return {
      message: "Order deleted sussesfully",
    };
  };
}
