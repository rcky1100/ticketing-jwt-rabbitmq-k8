import { ConsumeMessage } from "amqplib";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@rcky1983/common-rmq";
import { OrderCreatedListener } from "../order-created-listener";
import { rabbitMQWrapper } from "../../../rabbit-mq-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(rabbitMQWrapper.channel);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "asdf",
  });
  await ticket.save();

  // Create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "alskdfj",
    expiresAt: "alskdjf",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  const msg = {
    content: Buffer.from(JSON.stringify(data)),
  } as ConsumeMessage;

  return { listener, ticket, data, msg };
};

it("sets the userId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(rabbitMQWrapper.channel.ack).toHaveBeenCalledWith(msg);
});

it("publishes a ticket updated event", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(rabbitMQWrapper.channel.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (rabbitMQWrapper.channel.publish as jest.Mock).mock.calls[0][2].toString(),
  );

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
