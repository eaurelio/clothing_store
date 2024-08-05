// import {
//   CreateOrderInputDTO,
//   CreateOrderOutputDTO,
// } from "../dtos/orders/createOrder.dto";
// import {
//   GetAllOrdersInputDTO,
//   GetAllOrdersOutputDTO,
//   GetOrdersInputDTO,
//   GetOrdersOutputDTO,
// } from "../dtos/orders/getOrder.dto";
// import {
//   AddOrderItemInputDTO,
//   RemoveOrderItemInputDTO,
//   UpdateOrderInputDTO,
//   UpdateOrderOutputDTO,
// } from "../dtos/orders/updateOrder.dto";

// import { Order, OrderDB, OrderDBOutput } from "../models/Order";
// import { OrderDatabase } from "../database/OrderDatabase";
// import TokenService from "../services/TokenService";
// import { IdGenerator } from "../services/idGenerator";
// import { UnauthorizedError } from "../errors/UnauthorizedError";
// import { NotFoundError } from "../errors/NotFoundError";
// import { HashManager } from "../services/HashManager";
// import { ErrorHandler } from "../errors/ErrorHandler";
// import { OrderItemDB } from "../models/OrderItem";

// export class OrderBusiness {
//   constructor(
//     private orderDatabase: OrderDatabase,
//     private idGenerator: IdGenerator,
//     private tokenService: TokenService,
//     private hashmanager: HashManager,
//     private errorHandler: ErrorHandler
//   ) {}

//   // ------------------------------------------------------------------------------------------------------------------
//   // CREATE ORDER
//   // ------------------------------------------------------------------------------------------------------------------

//   public createOrder = async (
//     input: CreateOrderInputDTO
//   ): Promise<CreateOrderOutputDTO> => {
//     const { token, items, status_id, total } = input;

//     const userId = this.tokenService.getUserIdFromToken(token);
//     if (!userId) {
//       throw new UnauthorizedError("Invalid token");
//     }

//     const id = this.idGenerator.generate();
//     const orderDate = new Date().toISOString();

//     const newOrder = new Order(id, userId, items, status_id, total, orderDate);

//     const newOrderDB: OrderDB = {
//       order_id: newOrder.getOrderId(),
//       user_id: newOrder.getUserId(),
//       status_id: newOrder.getStatusId(),
//       total: newOrder.getTotal(),
//       order_date: newOrder.getOrderDate(),
//     };

//     await this.orderDatabase.insertOrder(newOrderDB);

//     // Inserir os itens do pedido
//     if (items && items.length > 0) {
//       for (const item of items) {
//         const itemData = {
//           item_id: await this.idGenerator.generate(),
//           order_id: newOrder.getOrderId(),
//           product_id: item.productId,
//           quantity: item.quantity,
//           price: item.price,
//         };

//         await this.orderDatabase.insertOrderItem(itemData);
//       }
//     }

//     const output: CreateOrderOutputDTO = {
//       message: "Order created successfully",
//       order: {
//         orderId: newOrder.getOrderId(),
//         userId: newOrder.getUserId(),
//         orderDate: newOrder.getOrderDate(),
//         status: newOrder.getStatusId(),
//         total: newOrder.getTotal(),
//         items: items.map((item) => ({
//           itemId: item.productId,
//           productId: item.productId,
//           quantity: item.quantity,
//           price: item.price,
//         })),
//       },
//     };

//     return output;
//   };

//   // ------------------------------------------------------------------------------------------------------------------
//   // GET ORDER
//   // ------------------------------------------------------------------------------------------------------------------

//   public getOrder = async (
//     input: GetOrdersInputDTO
//   ): Promise<GetOrdersOutputDTO> => {
//     const { token, orderId } = input;

//     const userId = this.tokenService.getUserIdFromToken(token);
//     if (!userId) {
//       throw new UnauthorizedError("Invalid token");
//     }

//     const orderDB = await this.orderDatabase.findOrderById(orderId);

//     if (!orderDB || orderDB.user_id !== userId) {
//       throw new NotFoundError("Order not found");
//     }

//     const orderItemsDB = await this.orderDatabase.findOrderItemsByOrderId(
//       orderId
//     );

//     const items = orderItemsDB.map((item: OrderItemDB) => ({
//       itemId: item.item_id,
//       productId: item.product_id,
//       quantity: item.quantity,
//       price: item.price,
//     }));

//     const output: GetOrdersOutputDTO = {
//       order: {
//         orderId: orderDB.order_id,
//         userId: orderDB.user_id,
//         status: orderDB.status_id,
//         total: orderDB.total,
//         orderDate: orderDB.order_date,
//         items: items,
//       },
//     };

//     return output;
//   };

//   // ------------------------------------------------------------------------------------------------------------------
//   // GET ALL ORDERS
//   // ------------------------------------------------------------------------------------------------------------------

//   public getAllOrders = async (
//     input: GetAllOrdersInputDTO
//   ): Promise<GetAllOrdersOutputDTO> => {
//     const { token } = input;

//     const userId = this.tokenService.getUserIdFromToken(token);
//     if (!userId) {
//       throw new UnauthorizedError("Invalid token");
//     }

//     const ordersDB = await this.orderDatabase.findOrdersByUserId(userId);

//     const ordersWithItems = await Promise.all(
//       ordersDB.map(async (order: OrderDBOutput) => {
//         const itemsDB = await this.orderDatabase.findOrderItemsByOrderId(
//           order.order_id
//         );
//         const items = itemsDB.map((item: OrderItemDB) => ({
//           itemId: item.item_id,
//           productId: item.product_id,
//           quantity: item.quantity,
//           price: item.price,
//         }));

//         return {
//           orderId: order.order_id,
//           userId: order.user_id,
//           status: order.status,
//           total: order.total,
//           orderDate: order.order_date,
//           items: items,
//         };
//       })
//     );

//     const output: GetAllOrdersOutputDTO = {
//       orders: ordersWithItems,
//     };

//     return output;
//   };

//   // ------------------------------------------------------------------------------------------------------------------
//   // UPDATE ORDER
//   // ------------------------------------------------------------------------------------------------------------------

//   public updateOrder = async (
//     input: UpdateOrderInputDTO
//   ): Promise<UpdateOrderOutputDTO> => {
//     const { token, orderId, status, total } = input;

//     const userId = this.tokenService.getUserIdFromToken(token);
//     if (!userId) {
//       throw new UnauthorizedError("Invalid token");
//     }

//     // Verifica se o pedido existe e pertence ao usuário
//     const orderDB = await this.orderDatabase.findOrderById(orderId);
//     if (!orderDB || orderDB.user_id !== userId) {
//       throw new NotFoundError("Order not found");
//     }

//     // Atualiza o pedido com o novo status e total
//     const updatedOrderDB: OrderDB = {
//       ...orderDB,
//       status: status !== undefined ? status : orderDB.status,
//       total: total !== undefined ? total : orderDB.total,
//     };

//     await this.orderDatabase.updateOrder(orderId, updatedOrderDB);

//     // Obtém os itens atualizados do pedido
//     const updatedItemsDB = await this.orderDatabase.findOrderItemsByOrderId(
//       orderId
//     );
//     const updatedItems = updatedItemsDB.map((item: OrderItemDB) => ({
//       itemId: item.item_id,
//       productId: item.product_id,
//       quantity: item.quantity,
//       price: item.price,
//     }));

//     const output: UpdateOrderOutputDTO = {
//       message: "Order updated successfully",
//       order: {
//         orderId: updatedOrderDB.order_id,
//         userId: updatedOrderDB.user_id,
//         orderDate: updatedOrderDB.order_date,
//         status: updatedOrderDB.status_id,
//         total: updatedOrderDB.total,
//         items: updatedItems,
//       },
//     };

//     return output;
//   };

//   public addOrderItem = async (input: AddOrderItemInputDTO): Promise<void> => {
//     const { token, orderId, productId, quantity, price } = input;

//     const userId = this.tokenService.getUserIdFromToken(token);
//     if (!userId) {
//       throw new UnauthorizedError("Invalid token");
//     }

//     const orderDB = await this.orderDatabase.findOrderById(orderId);
//     if (!orderDB || orderDB.user_id !== userId) {
//       throw new NotFoundError("Order not found");
//     }

//     const existingItem =
//       await this.orderDatabase.findOrderItemByOrderIdAndProductId(
//         orderId,
//         productId
//       );

//     if (existingItem) {
//       const newQuantity = existingItem.quantity + quantity;
//       if (newQuantity <= 0) {
//         await this.removeOrderItem({ token, orderId, productId });
//       } else {
//         await this.orderDatabase.updateOrderItemQuantity(
//           existingItem.item_id,
//           newQuantity
//         );
//       }
//     } else {
//       const newItemData: OrderItemDB = {
//         item_id: this.idGenerator.generate(),
//         order_id: orderId,
//         product_id: productId,
//         quantity,
//         price,
//       };

//       await this.orderDatabase.insertOrderItem(newItemData);
//     }

//     const updatedTotal = await this.calculateOrderTotal(orderId);
//     await this.orderDatabase.updateOrder(orderId, { total: updatedTotal });
//   };

//   private calculateOrderTotal = async (orderId: string): Promise<number> => {
//     const items: OrderItemDB[] =
//       await this.orderDatabase.findOrderItemsByOrderId(orderId);
//     return items.reduce(
//       (total: number, item: OrderItemDB) => total + item.quantity * item.price,
//       0
//     );
//   };

//   public removeOrderItem = async (
//     input: RemoveOrderItemInputDTO
//   ): Promise<void> => {
//     const { token, orderId, productId } = input;

//     const userId = this.tokenService.getUserIdFromToken(token);
//     if (!userId) {
//       throw new UnauthorizedError("Invalid token");
//     }

//     const orderDB = await this.orderDatabase.findOrderById(orderId);
//     if (!orderDB || orderDB.user_id !== userId) {
//       throw new NotFoundError("Order not found");
//     }

//     const existingItem =
//       await this.orderDatabase.findOrderItemByOrderIdAndProductId(
//         orderId,
//         productId
//       );

//     if (existingItem) {
//       const newQuantity = existingItem.quantity - 1;
//       if (newQuantity <= 0) {
//         await this.orderDatabase.deleteOrderItem(existingItem.item_id);
//       } else {
//         await this.orderDatabase.updateOrderItemQuantity(
//           existingItem.item_id,
//           newQuantity
//         );
//       }

//       const updatedTotal = await this.calculateOrderTotal(orderId);
//       await this.orderDatabase.updateOrder(orderId, { total: updatedTotal });
//     } else {
//       throw new NotFoundError("Item not found in the order");
//     }
//   };
// }

//----------------------------------------------------------------------------------------------------------------------------------------------------------

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
  AddOrderItemInputDTO,
  RemoveOrderItemInputDTO,
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

export class OrderBusiness {
  constructor(
    private orderDatabase: OrderDatabase,
    private idGenerator: IdGenerator,
    private tokenService: TokenService,
    private hashmanager: HashManager,
    private errorHandler: ErrorHandler
  ) {}

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
        items: items.map((item) => ({
          itemId: item.productId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    };

    return output;
  };

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

    const orderItemsDB = await this.orderDatabase.findOrderItemsByOrderId(
      orderId
    );

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
          status: order.status,
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

  // public updateOrder = async (
  //   input: UpdateOrderInputDTO
  // ): Promise<UpdateOrderOutputDTO> => {
  //   const { token, orderId, status_id, total } = input;

  //   const userId = this.tokenService.getUserIdFromToken(token);
  //   if (!userId) {
  //     throw new UnauthorizedError("Invalid token");
  //   }

  //   const orderDB = await this.orderDatabase.findOrderById(orderId);
  //   if (!orderDB || orderDB.user_id !== userId) {
  //     throw new NotFoundError("Order not found");
  //   }

  //   const updatedOrderDB: OrderDB = {
  //     ...orderDB,
  //     status_id: status_id !== undefined ? status_id : orderDB.status_id,
  //     total: total !== undefined ? total : orderDB.total,
  //   };

  //   console.log(status_id)

  //   await this.orderDatabase.updateOrder(orderId, updatedOrderDB);

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

  public updateOrder = async (
    input: UpdateOrderInputDTO
  ): Promise<UpdateOrderOutputDTO> => {
    const { token, orderId, status_id, total, items } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new UnauthorizedError("Invalid token");
    }

    const orderDB = await this.orderDatabase.findOrderById(orderId);
    if (!orderDB || orderDB.user_id !== userId) {
      throw new NotFoundError("Order not found");
    }

    const updatedOrderDB: OrderDB = {
      ...orderDB,
      status_id: status_id !== undefined ? status_id : orderDB.status_id,
      total: total !== undefined ? total : orderDB.total,
    };

    await this.orderDatabase.updateOrder(orderId, updatedOrderDB);

    await this.orderDatabase.deleteOrderItemsByOrderId(orderId);

    if (items) {
      for (const item of items) {
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

    const updatedItemsDB = await this.orderDatabase.findOrderItemsByOrderId(
      orderId
    );
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
        items: updatedItems,
      },
    };

    return output;
  };

  public addOrderItem = async (
    input: AddOrderItemInputDTO
  ): Promise<UpdateOrderOutputDTO> => {
    const { token, orderId, productId, quantity, price } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new UnauthorizedError("Invalid token");
    }

    const orderDB = await this.orderDatabase.findOrderById(orderId);
    if (!orderDB || orderDB.user_id !== userId) {
      throw new NotFoundError("Order not found");
    }

    const existingItem =
      await this.orderDatabase.findOrderItemByOrderIdAndProductId(
        orderId,
        productId
      );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity <= 0) {
        await this.removeOrderItem({ token, orderId, productId });
      } else {
        await this.orderDatabase.updateOrderItemQuantity(
          existingItem.item_id,
          newQuantity
        );
      }
    } else {
      const newItemData: OrderItemDB = {
        item_id: this.idGenerator.generate(),
        order_id: orderId,
        product_id: productId,
        quantity,
        price,
      };

      await this.orderDatabase.insertOrderItem(newItemData);
    }

    const updatedTotal = await this.calculateOrderTotal(orderId);
    await this.orderDatabase.updateOrder(orderId, { total: updatedTotal });

    const updatedOrderDB = await this.orderDatabase.findOrderById(orderId);

    const updatedItemsDB = await this.orderDatabase.findOrderItemsByOrderId(
      orderId
    );
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
        items: updatedItems,
      },
    };

    return output;
  };

  private calculateOrderTotal = async (orderId: string): Promise<number> => {
    const items: OrderItemDB[] =
      await this.orderDatabase.findOrderItemsByOrderId(orderId);
    return items.reduce(
      (total: number, item: OrderItemDB) => total + item.quantity * item.price,
      0
    );
  };

  public removeOrderItem = async (
    input: RemoveOrderItemInputDTO
  ): Promise<UpdateOrderOutputDTO> => {
    const { token, orderId, productId } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new UnauthorizedError("Invalid token");
    }

    const orderDB = await this.orderDatabase.findOrderById(orderId);
    if (!orderDB || orderDB.user_id !== userId) {
      throw new NotFoundError("Order not found");
    }

    const existingItem =
      await this.orderDatabase.findOrderItemByOrderIdAndProductId(
        orderId,
        productId
      );

    if (existingItem) {
      const newQuantity = existingItem.quantity - 1;
      if (newQuantity <= 0) {
        await this.orderDatabase.deleteOrderItem(existingItem.item_id);
      } else {
        await this.orderDatabase.updateOrderItemQuantity(
          existingItem.item_id,
          newQuantity
        );
      }

      const updatedTotal = await this.calculateOrderTotal(orderId);
      await this.orderDatabase.updateOrder(orderId, { total: updatedTotal });
    } else {
      throw new NotFoundError("Item not found in the order");
    }

    const updatedOrderDB = await this.orderDatabase.findOrderById(orderId);

    const updatedItemsDB = await this.orderDatabase.findOrderItemsByOrderId(
      orderId
    );
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
        items: updatedItems,
      },
    };

    return output;
  };

  public deleteOrder = async (input: {
    token: string;
    orderId: string;
  }): Promise<void> => {
    const { token, orderId } = input;

    const userId = this.tokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new UnauthorizedError("Invalid token");
    }

    const orderDB = await this.orderDatabase.findOrderById(orderId);
    if (!orderDB || orderDB.user_id !== userId) {
      throw new NotFoundError("Order not found");
    }

    console.log(orderDB)

    if (orderDB.status_id !== 1) {
      throw new UnauthorizedError("Order cannot be deleted as its status is not 'Pending'");
    }

    await this.orderDatabase.deleteOrderItemsByOrderId(orderId);

    await this.orderDatabase.deleteOrder(orderId);
  };
}
