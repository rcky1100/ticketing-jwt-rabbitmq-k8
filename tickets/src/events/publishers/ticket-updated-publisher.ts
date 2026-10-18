import {
  TicketUpdatedEvent,
  RoutingKeys,
  Publisher,
} from "@rcky1983/common-rmq";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  exchange: string = "app_exchange";
  routingKey: RoutingKeys.TicketUpdated = RoutingKeys.TicketUpdated;
}
