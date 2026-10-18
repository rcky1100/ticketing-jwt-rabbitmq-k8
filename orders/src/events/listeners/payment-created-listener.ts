import {
  RoutingKeys,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from "@rcky1983/common-rmq";
import { ConsumeMessage } from "amqplib";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  exchange = "app_exchange";
  routingKey: RoutingKeys.PaymentCreated = RoutingKeys.PaymentCreated;
  queue = queueGroupName + "-" + RoutingKeys.PaymentCreated;

  async onMessage(data: PaymentCreatedEvent["data"], msg: ConsumeMessage) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();
  }
}
