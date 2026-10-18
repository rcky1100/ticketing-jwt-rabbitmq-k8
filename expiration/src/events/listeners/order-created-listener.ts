import { Listener, OrderCreatedEvent, RoutingKeys } from "@rcky1983/common-rmq";
import { ConsumeMessage } from "amqplib";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  exchange = "app_exchange";
  routingKey: RoutingKeys.OrderCreated = RoutingKeys.OrderCreated;
  queue = queueGroupName + "-" + RoutingKeys.OrderCreated;

  async onMessage(data: OrderCreatedEvent["data"], msg: ConsumeMessage) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("Waiting this many milliseconds to process the job:", delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      },
    );
  }
}
