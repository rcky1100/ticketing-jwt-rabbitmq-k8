import { rabbitMQWrapper } from "./rabbit-mq-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
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
  } catch (err) {
    console.error(err);
  }
};

start();
