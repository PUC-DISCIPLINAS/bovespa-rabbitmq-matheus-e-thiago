import { Channel, Message } from "amqplib";

/**
 * @class RabbitMQTopicServer 
 * Classe que é utilizada para espalhar as mensagens para vários clientes de acordo com as suas assinaturas.
 * Possui um atributo exchange que guarda o nome da exchange.
 * Possui um atributo bindgs que guarda todas as assinaturas do cliente.
 */
export class RabbitMQTopicServer {
    private exchange: string;
    private bindgs: string[]

    constructor() {
        this.exchange = "BOLSADEVALORES";   
        this.bindgs= []
    }

    /**
     * Utilizado para armazenar a lista de ativos
     * @param actives {string[]}
     */
    public async bindToQueue(actives:string[]) {
        this.bindgs = actives;      
    }

     /**
     * assertExchange verifica se ja existe a exchange "BOLSADEVALORES", caso não exista cria a exchange.
     * @param channel {Channel} uma variável que será utilizada para criar uma conexão com o RabbitMQ
     */
    public async start(channel:Channel): Promise<void> {
        await channel.assertExchange(this.exchange, 'topic',{ durable:false });

    }

    /**
     * Publica uma mensagem na fila desejada a partir da routing key do parametro key
     * @param message {string} mensagem que será enviada a fila
     * @param channel {Channel} uma variável que será utilizada para criar uma conexão com o RabbitMQ
     * @param key {string} chave para que a exchange possa rotear a mensagem para as filas certas
     */
    public async publishExchange(message:string,key: string,channel:Channel) {
        return channel.publish(this.exchange, key, Buffer.from(message));
    }

    /**
     * Utilizada para ouvir mensagens vindas de uma fila de acordo com os topicos assinados(bindgs)
     * @param callback uma função que será utilizada para tratar a mensagem que será retornada pelo rabbitMQ após consumir a mensagem da fila 
     * @param channel {Channel} uma variável que será utilizada para criar uma conexão com o RabbitMQ
     * @returns retorna uma mensagem armazenada na fila.
     */
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




