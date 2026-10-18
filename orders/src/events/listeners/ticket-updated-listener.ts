import { ConsumeMessage } from "amqplib";
import {
  RoutingKeys,
  Listener,
  TicketUpdatedEvent,
} from "@rcky1983/common-rmq";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  exchange = "app_exchange";
  routingKey: RoutingKeys.TicketUpdated = RoutingKeys.TicketUpdated;
  queue = queueGroupName + "-" + RoutingKeys.TicketUpdated;

  async onMessage(data: TicketUpdatedEvent["data"], msg: ConsumeMessage) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { title, price } = data;
    ticket.set({ title, price, updatedAt: new Date() });
    await ticket.save();
  }
}
