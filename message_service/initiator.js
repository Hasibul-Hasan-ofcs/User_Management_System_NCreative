const amqp = require("amqplib");

const setMessageByInitiator = async (id, message) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue("initiator-updates");
    await channel.sendToQueue(
      "initiator-updates",
      Buffer.from(JSON.stringify({ id, message }))
    );
    console.log(`Initiator update published for user ${id}:`, message);
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error rabbitmq message initiation:", error);
  }
};

module.exports = setMessageByInitiator;
