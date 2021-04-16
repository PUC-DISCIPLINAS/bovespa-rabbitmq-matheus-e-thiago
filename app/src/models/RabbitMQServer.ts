import { Channel, Connection, connect, Message } from "amqplib";

export class RabbitMQServer {
    private connection: Connection;
    private channel: Channel;
    private uri: string
    private queue: string;

    constructor(uri: string) {
        this.uri = uri;
        this.queue = "BROKER";   
           
    }

    public async start(): Promise<void> {
        this.connection = await connect(this.uri);
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.queue,{durable:false});
    }

    public async publishInQueue(message: string) {
        return this.channel.sendToQueue(this.queue,Buffer.from(message));
    }

    public async consume(callback: (message: Message) => void) {
        return this.channel.consume(this.queue, (message) => {
            callback(message);
            this.channel.ack(message);
        })
    }    
}




