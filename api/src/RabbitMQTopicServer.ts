import { Channel, Connection, connect, Message } from "amqplib";

export class RabbitMQTopicServer {
    private exchange: string;
    private bindgs: string[]

    constructor() {
        this.exchange = "STOCK";   
        this.bindgs= []
    }

    public async bindToQueue(active:string) {
        this.bindgs = [...this.bindgs,active.toUpperCase()];      
    }

    public async start(channel:Channel): Promise<void> {
        await channel.assertExchange(this.exchange, 'topic',{ durable:false });

    }

    public async publishExchange(message:string,key: string,channel:Channel) {
        return channel.publish(this.exchange, key, Buffer.from(message));
    }

    public async consume(callback: (message: Message) => void,channel:Channel) {
        const q = await channel.assertQueue('', { exclusive: true })    
        this.bindgs.forEach( async (act) => {
            await channel.bindQueue(q.queue,this.exchange,`*.${act}`)
        })
        return channel.consume(q.queue,(message) => {
            callback(message)
        })
    } 

}




