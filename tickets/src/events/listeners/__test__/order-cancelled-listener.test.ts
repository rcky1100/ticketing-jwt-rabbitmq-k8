import mongoose from "mongoose";
import { ConsumeMessage } from "amqplib";
import { OrderCancelledEvent } from "@rcky1983/common-rmq";
import { rabbitMQWrapper } from "../../../rabbit-mq-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new OrderCancelledListener(rabbitMQWrapper.channel);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "asdf",
  });
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  const msg = {
    content: Buffer.from(JSON.stringify(data)),
  } as ConsumeMessage;

  return { msg, data, ticket, orderId, listener };
};

it("updates the ticket, publishes an event, and acks the message", async () => {
  const { msg, data, ticket, orderId, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(rabbitMQWrapper.channel.ack).toHaveBeenCalledWith(msg);
  expect(rabbitMQWrapper.channel.publish).toHaveBeenCalled();
});
