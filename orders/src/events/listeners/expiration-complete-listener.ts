import {
  Listener,
  RoutingKeys,
  ExpirationCompleteEvent,
  OrderStatus,
} from "@rcky1983/common-rmq";
import { ConsumeMessage } from "amqplib";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  exchange = "app_exchange";
  routingKey: RoutingKeys.ExpirationComplete = RoutingKeys.ExpirationComplete;
  queue = queueGroupName + "-" + RoutingKeys.ExpirationComplete;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: ConsumeMessage) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === OrderStatus.Complete) {
      return;
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();
    await new OrderCancelledPublisher(this.channel).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
  }
}
