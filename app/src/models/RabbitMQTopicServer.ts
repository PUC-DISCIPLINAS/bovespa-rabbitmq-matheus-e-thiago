import { Channel, Connection, connect, Message } from "amqplib";

export class RabbitMQTopicServer {
    private connection: Connection;
    private channel: Channel;
    private uri: string
    private exchange: string;
    private bindgs: string[]

    constructor(uri: string) {
        this.uri = uri;
        this.exchange = "STOCK";   
        this.bindgs= []
    }

    public async bindToQueue(active:string) {
        const q = await this.channel.assertQueue('', { exclusive: false });
        this.bindgs = [...this.bindgs,active.toUpperCase()];
        this.bindgs.forEach( async (act) => {
            await this.channel.bindQueue(q.queue,this.exchange,`*.${act}`)
        })
    }

    public async start(channel:Channel): Promise<void> {
        await channel.assertExchange(this.exchange, 'topic',{ durable:false });
    }

    public async publishExchange(message:string,key: string) {
        return this.channel.publish(this.exchange, key, Buffer.from(message));
    }


    public async consume(callback: (message: Message) => void,key:string) {
        const q = await this.channel.assertQueue('', { exclusive: true })

    }    
}




