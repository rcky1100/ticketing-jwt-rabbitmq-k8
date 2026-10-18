import {
  RoutingKeys,
  Publisher,
  OrderCancelledEvent,
} from "@rcky1983/common-rmq";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  exchange: string = "app_exchange";
  routingKey: RoutingKeys.OrderCancelled = RoutingKeys.OrderCancelled;
}
