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

interface Id {
  id: number;
}

interface Connections {
  topic: RabbitMQTopicServer;
  messages: string[];
}

const topics: Connections[] = [];
let id: number = 1;
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

//initialize a connection
app.post(`/bind`, async (req: Request, res: Response) => {
  const connection = await connect(
    "amqps://pozawbsw:dEHTHRVWhV_JJ1_OoIH_7yqL7jQ_jDc0@jackal.rmq.cloudamqp.com/pozawbsw"
  );
  const channel = await connection.createChannel();
  const topicId = id;
  id++;
  topics[topicId] = {
    topic: new RabbitMQTopicServer(),
    messages: [],
  };
  topics[topicId].topic.start(channel);

  topics[topicId].topic.bindToQueue("GALO");
  topics[topicId].topic.consume((message) => {
    const messageString = message.content.toString();
    topics[topicId].messages.push(messageString);
    console.log("Broker " + topicId + " received " + messageString);
  }, channel);

  return res.json(topicId);
});

//recover connection messages
app.get("/messages/:id", (req: Request, res: Response) => {
  if (topics[1]) {
    setTimeout(() => {
      return res.json(topics[1].messages);
    }, 500);
  } else return res.status(404);
});

app.listen(PORT, async () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  // const connection = await connect(
  //   "amqps://pozawbsw:dEHTHRVWhV_JJ1_OoIH_7yqL7jQ_jDc0@jackal.rmq.cloudamqp.com/pozawbsw"
  // );
  // const channel = await connection.createChannel();
  // const topicServer = new RabbitMQTopicServer();

  // await topicServer.start(channel);
  // await topicServer.bindToQueue("GALO");
  // await topicServer.consume((message) => {
  //   console.log(`recebi: ${message.content.toString()}`);
  // }, channel);

  // await topicServer.publishExchange("hello world", "compra.GALO", channel);
});
