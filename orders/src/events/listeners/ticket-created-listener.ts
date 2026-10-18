import { ConsumeMessage } from "amqplib";
import {
  RoutingKeys,
  Listener,
  TicketCreatedEvent,
} from "@rcky1983/common-rmq";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  exchange = "app_exchange";
  routingKey: RoutingKeys.TicketCreated = RoutingKeys.TicketCreated;
  queue = queueGroupName + "-" + RoutingKeys.TicketCreated;

  async onMessage(data: TicketCreatedEvent["data"], msg: ConsumeMessage) {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
  }
}
