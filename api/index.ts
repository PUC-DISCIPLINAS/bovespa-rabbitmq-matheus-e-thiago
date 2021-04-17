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
    console.log(topicId + " recebeu " + message.content.toString());
    topics[topicId].messages.push(message);
  }, channel);

  return res.json(topicId);
});

app.post("/messages", (req: Request<Id>, res: Response) => {
  const idBody: Id = req.body;
  const index = idBody.id;
  if (topics[index]) {
    return res.json(topics[index].messages);
  } else return res.status(404);
});

app.listen(PORT, async () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  const connection = await connect(
    "amqps://pozawbsw:dEHTHRVWhV_JJ1_OoIH_7yqL7jQ_jDc0@jackal.rmq.cloudamqp.com/pozawbsw"
  );
  const channel = await connection.createChannel();
  const topicServer = new RabbitMQTopicServer();

  await topicServer.start(channel);
  await topicServer.bindToQueue("GALO");
  await topicServer.consume((message) => {
    console.log(`recebi: ${message.content.toString()}`);
  }, channel);

  await topicServer.publishExchange("hello world", "compra.GALO", channel);
});
