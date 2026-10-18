import {
  OrderCancelledEvent,
  RoutingKeys,
  Listener,
  OrderStatus,
} from "@rcky1983/common-rmq";

import { ConsumeMessage } from "amqplib";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  exchange = "app_exchange";
  routingKey: RoutingKeys.OrderCancelled = RoutingKeys.OrderCancelled;
  queue = queueGroupName + "-" + RoutingKeys.OrderCancelled;

  async onMessage(data: OrderCancelledEvent["data"], msg: ConsumeMessage) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
  }
}
