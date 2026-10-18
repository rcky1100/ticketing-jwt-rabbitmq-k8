import { ConsumeMessage } from "amqplib";
import { Listener, OrderCreatedEvent, RoutingKeys } from "@rcky1983/common-rmq";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  exchange = "app_exchange";
  routingKey: RoutingKeys.OrderCreated = RoutingKeys.OrderCreated;
  queue = queueGroupName + "-" + RoutingKeys.OrderCreated;

  async onMessage(data: OrderCreatedEvent["data"], msg: ConsumeMessage) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.channel).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId || "",
      version: ticket.version,
    });

    // ack the message: in rabbitmq we will ack message from base class if don't want ack then from child class we will return new Error, so base class will nto ack
    //this.channel.ack(msg);
  }
}
