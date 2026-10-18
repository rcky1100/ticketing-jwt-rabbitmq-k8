export const rabbitMQWrapper = {
  channel: {
    assertExchange: jest.fn().mockResolvedValue(undefined),

    publish: jest.fn().mockReturnValue(true),

    ack: jest.fn(),
    nack: jest.fn(),

    consume: jest.fn(),
    assertQueue: jest.fn().mockResolvedValue({ queue: "test-queue" }),
    bindQueue: jest.fn().mockResolvedValue(undefined),
  },

  connect: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
};
