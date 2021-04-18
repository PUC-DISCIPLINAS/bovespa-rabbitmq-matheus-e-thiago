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

  //thread that will listen to updates
  topics[topicId].topic.consume((message) => {
    const messageString = message.content.toString();
    const newOperation: Operation = JSON.parse(message.content.toString());
    const toRemove: string[] = [];

    for (let msg of topics[topicId].messages) {
      const oldOperation: Operation = JSON.parse(msg);
      if (
        oldOperation.broker === newOperation.broker &&
        oldOperation.value === newOperation.value &&
        oldOperation.type === newOperation.type
      ) {
        toRemove.push(msg);
      }
    }
    for (let msg of toRemove) {
      topics[topicId].messages = topics[topicId].messages.filter(
        (m) => msg !== m
      );
    }

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
});
