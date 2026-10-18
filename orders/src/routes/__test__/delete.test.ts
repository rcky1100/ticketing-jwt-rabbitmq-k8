import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { rabbitMQWrapper } from "../../rabbit-mq-wrapper";

it("marks an order as cancelled", async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const token = (global as unknown as NodeJS.Global).signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Authorization", `Bearer ${token}`)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Authorization", `Bearer ${token}`)
    .send()
    .expect(204);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits a order cancelled event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const token = (global as unknown as NodeJS.Global).signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Authorization", `Bearer ${token}`)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Authorization", `Bearer ${token}`)
    .send()
    .expect(204);

  expect(rabbitMQWrapper.channel.publish).toHaveBeenCalled();
});
