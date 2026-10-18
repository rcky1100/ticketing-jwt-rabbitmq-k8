import mongoose from "mongoose";
import { app } from "./app";
import { rabbitMQWrapper } from "./rabbit-mq-wrapper";

import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

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

    new TicketCreatedListener(rabbitMQWrapper.channel).listen();
    new TicketUpdatedListener(rabbitMQWrapper.channel).listen();
    new ExpirationCompleteListener(rabbitMQWrapper.channel).listen();
    new PaymentCreatedListener(rabbitMQWrapper.channel).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();
