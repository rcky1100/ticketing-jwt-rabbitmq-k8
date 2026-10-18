import mongoose from "mongoose";
import { ConsumeMessage } from "amqplib";
import { OrderCreatedEvent, OrderStatus } from "@rcky1983/common-rmq";
import { rabbitMQWrapper } from "../../../rabbit-mq-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(rabbitMQWrapper.channel);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "alskdjf",
    userId: "alskdjf",
    status: OrderStatus.Created,
    ticket: {
      id: "alskdfj",
      price: 10,
    },
  };

  const msg = {
    content: Buffer.from(JSON.stringify(data)),
  } as ConsumeMessage;

  return { listener, data, msg };
};

it("replicates the order info", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(rabbitMQWrapper.channel.ack).toHaveBeenCalledWith(msg);
});
