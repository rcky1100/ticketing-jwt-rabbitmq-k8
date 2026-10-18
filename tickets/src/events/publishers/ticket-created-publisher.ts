import {
  TicketCreatedEvent,
  RoutingKeys,
  Publisher,
} from "@rcky1983/common-rmq";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  exchange: string = "app_exchange";
  routingKey: RoutingKeys.TicketCreated = RoutingKeys.TicketCreated;
}
