import {
  Publisher,
  OrderCreatedEvent,
  RoutingKeys,
} from "@rcky1983/common-rmq";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  exchange: string = "app_exchange";
  routingKey: RoutingKeys.OrderCreated = RoutingKeys.OrderCreated;
}
