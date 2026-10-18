import mongoose from "mongoose";
import { ConsumeMessage } from "amqplib";
import { OrderStatus, ExpirationCompleteEvent } from "@rcky1983/common-rmq";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { rabbitMQWrapper } from "../../../rabbit-mq-wrapper";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new ExpirationCompleteListener(rabbitMQWrapper.channel);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: "alskdfj",
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  const msg = {
    content: Buffer.from(JSON.stringify(data)),
  } as ConsumeMessage;

  return { listener, order, ticket, data, msg };
};

it("updates the order status to cancelled", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit an OrderCancelled event", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(rabbitMQWrapper.channel.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (rabbitMQWrapper.channel.publish as jest.Mock).mock.calls[0][2].toString(),
  );
  expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(rabbitMQWrapper.channel.ack).toHaveBeenCalledWith(msg);
});
