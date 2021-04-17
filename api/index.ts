import express from "express";
import { RabbitMQBroker } from "./src/RabbitMQBroker"
import { RabbitMQTopicServer } from "./src/RabbitMQTopicServer"
import { Channel, Connection, connect } from "amqplib";


// rest of the code remains same
const app = express();
const PORT = 8002;
app.get("/", (req, res) => res.send("RabbiMQ Server - Bolsa de valores"));
app.listen(PORT, async () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
  const connection = await connect('amqps://pozawbsw:dEHTHRVWhV_JJ1_OoIH_7yqL7jQ_jDc0@jackal.rmq.cloudamqp.com/pozawbsw');
  const channel = await connection.createChannel();


  const server1 = new RabbitMQBroker();
  await server1.start(channel);
  await server1.publishInQueue("servidor1",channel)
  await server1.consume((message) => {
    console.log(message.content.toString())
  },channel)

  const server = new RabbitMQTopicServer();
  await server.start(channel);
  await server.bindToQueue("AMBEV");
  await server.bindToQueue("AMBE1");
  await server.consume((message) => {console.log(`recebi: ${message.content.toString()}`)},channel);
  await server.publishExchange("hello world", "compra.AMBEV",channel);
  await server.publishExchange("hello world2", "venda.AMBE1",channel);
  await server.publishExchange("hello world3", "transferencia.AMBE5",channel);

});
 

 