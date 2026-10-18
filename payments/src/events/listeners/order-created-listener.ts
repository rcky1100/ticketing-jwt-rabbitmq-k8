import { ConsumeMessage } from "amqplib";
import { Listener, OrderCreatedEvent, RoutingKeys } from "@rcky1983/common-rmq";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  exchange = "app_exchange";
  routingKey: RoutingKeys.OrderCreated = RoutingKeys.OrderCreated;
  queue = queueGroupName + "-" + RoutingKeys.OrderCreated;

  async onMessage(data: OrderCreatedEvent["data"], msg: ConsumeMessage) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();
  }
}
