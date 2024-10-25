// order-service/src/rabbitmq.ts

import amqp, { Channel } from 'amqplib';

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
      //@ts-expect-error - JSON.parse(msg.content.toString()) returns any
      const { item } = JSON.parse(msg.content.toString());
      console.log(`Order created for item: ${item}`);
      //@ts-expect-error - msg is any
      channel.ack(msg); // Acknowledge the message
    },
    { noAck: false },
  );
}

function getChannel() {
  return channel;
}

export { connect, getChannel };
