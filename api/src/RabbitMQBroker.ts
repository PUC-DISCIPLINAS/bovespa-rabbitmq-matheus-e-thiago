import { Channel, Connection, connect, Message } from "amqplib";

export class RabbitMQBroker {
    private queue: string;

    constructor() {
        this.queue = "BROKER";
    }

    public async start(channel:Channel): Promise<void> {
        await channel.assertQueue(this.queue,{durable:false});
    }

    public async publishInQueue(message: string,channel:Channel) {
        return channel.sendToQueue(this.queue,Buffer.from(message));
    }

    public async consume(callback: (message: Message) => void, channel:Channel) {
        return channel.consume(this.queue, (message) => {
            if(message) {
                callback(message);
                channel.ack(message);
            }    
        })
    }    
}