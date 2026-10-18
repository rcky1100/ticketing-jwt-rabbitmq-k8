import {
  RoutingKeys,
  Publisher,
  ExpirationCompleteEvent,
} from "@rcky1983/common-rmq";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  exchange: string = "app_exchange";
  routingKey: RoutingKeys.ExpirationComplete = RoutingKeys.ExpirationComplete;
}
