import amqp, { Channel, ChannelModel } from "amqplib";

class RabbitMQWrapper {
  private _connection?: ChannelModel;
  private _channel?: Channel;

  get channel(): Channel {
    if (!this._channel) {
      throw new Error("Cannot access RabbitMQ channel before connecting");
    }
    return this._channel;
  }

  async connect(url: string) {
    this._connection = await amqp.connect(url);

    this._channel = await this._connection.createChannel();

    console.log("Connected to RabbitMQ");

    this._connection.on("close", () => {
      console.log("RabbitMQ connection closed!");
      process.exit();
    });

    this._connection.on("error", (err) => {
      console.error("RabbitMQ error:", err);
    });
  }

  async close() {
    await this._channel?.close();
    await this._connection?.close();
  }
}

export const rabbitMQWrapper = new RabbitMQWrapper();
