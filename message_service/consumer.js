const amqp = require("amqplib");
const { logger } = require("../src/utilities/Logger");

const consumerMessageReceive = async (userId) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue("initiator-updates");
    logger.info("Waiting for initiator updates...");
    channel.consume("initiator-updates", (data) => {
      logger.debug(userId);
      if (data) {
        const { id, message } = JSON.parse(data.content.toString());
        if (id == userId) {
          logger.info(`Received message for user ${userId}:${message}`);
          channel.ack(data);
        }
        return;
      }
    });
  } catch (error) {
    console.error("Failed to get initiator updates:", error);
  }
};

module.exports = consumerMessageReceive;
