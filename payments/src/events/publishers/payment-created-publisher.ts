import {
  RoutingKeys,
  Publisher,
  PaymentCreatedEvent,
} from "@rcky1983/common-rmq";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  exchange: string = "app_exchange";
  routingKey: RoutingKeys.PaymentCreated = RoutingKeys.PaymentCreated;
}
