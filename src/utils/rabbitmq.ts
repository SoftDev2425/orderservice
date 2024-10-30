// order-service/src/rabbitmq.ts

import amqp, { Channel } from 'amqplib';
import { Basket } from '../protos/generated/basket';

let channel: Channel;

async function connect() {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || 'amqp://localhost',
  );
  channel = await connection.createChannel();
  await channel.assertQueue('orderQueue', { durable: true });
  channel.consume(
    'orderQueue',
    msg => {
      if (msg !== null) {
        // Deserialize the message from binary to the Basket object - this needs the Basket + Protobuf... shared repo???
        const deserializedMsg = Basket.decode(msg.content);

        // Logging the received basket
        console.log(
          `Order created for basket: ${JSON.stringify(deserializedMsg)}`,
        );

        // const basket: BasketType = Basket.decode(msg.content); // Use the decode method from Protobuf

        // Logging the received basket
        // console.log(`Order created for basket: ${JSON.stringify(basket)}`);

        // Acknowledge the message
        channel.ack(msg);
      }
    },
    { noAck: false },
  );
}

function getChannel() {
  return channel;
}

export { connect, getChannel };
