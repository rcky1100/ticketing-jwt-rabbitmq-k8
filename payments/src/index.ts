import mongoose from "mongoose";
import { app } from "./app";
import { rabbitMQWrapper } from "./rabbit-mq-wrapper";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.RABBIT_MQ_URL) {
    throw new Error("RABBIT_MQ_URL must be defined");
  }

  try {
    // Connect RabbitMQ
    await rabbitMQWrapper.connect(process.env.RABBIT_MQ_URL);
    process.on("SIGINT", async () => {
      await rabbitMQWrapper.close();
    });

    process.on("SIGTERM", async () => {
      await rabbitMQWrapper.close();
    });

    new OrderCreatedListener(rabbitMQWrapper.channel).listen();
    new OrderCancelledListener(rabbitMQWrapper.channel).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3002, () => {
    console.log("Listening on port 3002!!!!!!!!");
  });
};

start();
