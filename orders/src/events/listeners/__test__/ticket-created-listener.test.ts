import { ConsumeMessage } from "amqplib";
import mongoose from "mongoose";
import { TicketCreatedEvent } from "@rcky1983/common-rmq";
import { TicketCreatedListener } from "../ticket-created-listener";
import { rabbitMQWrapper } from "../../../rabbit-mq-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(rabbitMQWrapper.channel);

  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  const msg = {
    content: Buffer.from(JSON.stringify(data)),
  } as ConsumeMessage;

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(rabbitMQWrapper.channel.ack).toHaveBeenCalledWith(msg);
});
