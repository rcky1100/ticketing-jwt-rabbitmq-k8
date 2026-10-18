import mongoose from "mongoose";
import { ConsumeMessage } from "amqplib";
import { OrderStatus, OrderCancelledEvent } from "@rcky1983/common-rmq";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { rabbitMQWrapper } from "../../../rabbit-mq-wrapper";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCancelledListener(rabbitMQWrapper.channel);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: "asldkfj",
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "asldkfj",
    },
  };

  const msg = {
    content: Buffer.from(JSON.stringify(data)),
  } as ConsumeMessage;

  return { listener, data, msg, order };
};

it("updates the status of the order", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(rabbitMQWrapper.channel.ack).toHaveBeenCalledWith(msg);
});
