import express from "express";
import { RabbitMQBroker } from "./src/RabbitMQBroker";
import { RabbitMQTopicServer } from "./src/RabbitMQTopicServer";
import { Channel, Connection, connect } from "amqplib";
import { Request, Response } from "express";
import cors from "cors";

/**
 * inteface que será utilizada para fazer a transição de operações entre back e front
 */
interface Operation {
  broker: string;
  date: Date;
  qnt: number;
  type: string;
  value: number;
  owner: string;
}

/**
 * interface que será utilizada pela const topics para armazenar as mensagens(operações) de um cliente e instancia da RabbitMQServer
 */
interface Connections {
  topic: RabbitMQTopicServer;
  messages: string[];
}

const topics: Connections[] = [];
let id: number = 1;
const app = express();
const PORT = 8002;
const brokerServer = new RabbitMQBroker();
const cloudAMQPURI = "amqps://pozawbsw:dEHTHRVWhV_JJ1_OoIH_7yqL7jQ_jDc0@jackal.rmq.cloudamqp.com/pozawbsw"

app.use(cors());
// middleware
app.use(express.json());
app.use(express.urlencoded());

//Test api
app.get("/ping", function (req, res) {
  res.json({ msg: "GOT IT!" });
});

/**
 * Envia uma operação para a fila broker e publica na exchange para os clientes receberem a operação
 */
app.post("/send", async (req: Request<Operation>, res: Response) => {
  const connection = await connect(cloudAMQPURI);
  const channel = await connection.createChannel();
  const op: Operation = req.body;
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

/**
 * Cria uma fila para um cliente de acordo com os bindings desejados e consome mensagens daquela fila
 */
app.post(`/bind`, async (req: Request<string[]>, res: Response) => {
  const connection = await connect(cloudAMQPURI);
  const channel = await connection.createChannel();
  const topicId = id;
  id++;
  topics[topicId] = {
    topic: new RabbitMQTopicServer(),
    messages: [],
  };
  const bindings : string[] = req.body;
  topics[topicId].topic.start(channel);
  if (bindings.length > 0)  
     topics[topicId].topic.bindToQueue(bindings)

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

/**
 * Recupera as mensagens de um cliente a partir de seu id armazenado em localstorage
 */
app.get("/messages/:id", (req: Request, res: Response) => {
  const index = (req.params.id as unknown) as number;
  if (topics[index]) {
    setTimeout(() => {
      return res.json(topics[index].messages);
    }, 500);
  } else return res.status(404);
});

app.listen(PORT, async () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
