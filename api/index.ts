import express from "express";
import { RabbitMQBroker } from "./src/RabbitMQBroker";
import { RabbitMQTopicServer } from "./src/RabbitMQTopicServer";
import { Channel, Connection, connect } from "amqplib";
import { Request, Response } from "express";
import cors from "cors";

interface Operation {
  broker: string;
  date: Date;
  qnt: number;
  type: string;
  value: number;
  owner: string;
}

const app = express();
const PORT = 8002;
app.use(cors());
// middleware
app.use(express.json());
app.use(express.urlencoded());

//Test api
app.get("/ping", function (req, res) {
  res.json({ msg: "GOT IT!" });
});

//send operation to broker server
app.post("/send", async (req: Request<Operation>, res: Response) => {
  console.log("BODY: ", req.body);
  const connection = await connect(
    "amqps://pozawbsw:dEHTHRVWhV_JJ1_OoIH_7yqL7jQ_jDc0@jackal.rmq.cloudamqp.com/pozawbsw"
  );
  const channel = await connection.createChannel();
  const op: Operation = req.body;
  const brokerServer = new RabbitMQBroker();
  await brokerServer.start(channel);
  await brokerServer.publishInQueue(JSON.stringify(op), channel);
  const topicServer = new RabbitMQTopicServer();
  await topicServer.start(channel);
  await topicServer.publishExchange(
    JSON.stringify(req.body),
    op.type + "." + op.broker,
    channel
  );
  res.json(op);
});

app.listen(PORT, async () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  const connection = await connect(
    "amqps://pozawbsw:dEHTHRVWhV_JJ1_OoIH_7yqL7jQ_jDc0@jackal.rmq.cloudamqp.com/pozawbsw"
  );
  const channel = await connection.createChannel();
  const topicServer = new RabbitMQTopicServer();
  // await server1.start(channel);
  // await server1.publishInQueue("servidor1",channel)
  // await server1.consume((message) => {
  //   console.log(message.content.toString())
  // },channel)

  await topicServer.start(channel);
  await topicServer.bindToQueue("GALO");
  // await server.bindToQueue("AMBE1");
  await topicServer.consume((message) => {
    console.log(`recebi: ${message.content.toString()}`);
  }, channel);
  await topicServer.publishExchange("hello world", "compra.GALO", channel);
  // await server.publishExchange("hello world2", "venda.AMBE1",channel);
  // await server.publishExchange("hello world3", "transferencia.AMBE5",channel);
});
