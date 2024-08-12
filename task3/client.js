const { Kafka } = require("kafkajs");

exports.kafka = new Kafka({
  clientId: "kafka-app",
  brokers: ["192.22.224.1:9092"], // replace 192.22.224.1 with your own ip address
});
