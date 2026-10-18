import {
  Listener,
  OrderCancelledEvent,
  RoutingKeys,
} from "@rcky1983/common-rmq";
import { ConsumeMessage } from "amqplib";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  exchange = "app_exchange";
  routingKey: RoutingKeys.OrderCancelled = RoutingKeys.OrderCancelled;
  queue = queueGroupName + "-" + RoutingKeys.OrderCancelled;

  async onMessage(data: OrderCancelledEvent["data"], msg: ConsumeMessage) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: undefined });
    await ticket.save();
    await new TicketUpdatedPublisher(this.channel).publish({
      id: ticket.id,
      orderId: ticket.orderId || "",
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    });
  }
}
