import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { rabbitMQWrapper } from "../rabbit-mq-wrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(rabbitMQWrapper.channel).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
