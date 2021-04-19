import { Channel, Message } from "amqplib";
/**
 * @class RabbitMQBroker 
 * Classe em que o cliente "broker" manda mensagens de compra, venda e transferencia.
 * Possui um atributo queue que será a fila BROKER onde serão enviadas essas mensagens
 */
export class RabbitMQBroker {
    private queue: string;

    constructor() {
        this.queue = "BROKER";
    }
    /**
     * assertQueue verifica se ja existe a fila "BROKER", caso não exista cria a fila.
     * @param channel {Channel} uma variável que será utilizada para criar uma conexão com o RabbitMQ
     */
    public async start(channel:Channel): Promise<void> {
        await channel.assertQueue(this.queue,{durable:false});
    }

    /**
     * Publica uma mensagem na fila "BROKER"
     * @param message {string} mensagem que será enviada a fila
     * @param channel {Channel} uma variável que será utilizada para criar uma conexão com o RabbitMQ
     */
    public async publishInQueue(message: string,channel:Channel) {
         channel.sendToQueue(this.queue,Buffer.from(message));
    }

    /**
     * Utilizada para ouvir mensagens vindas da fila BROKER
     * @param callback uma função que será utilizada para tratar a mensagem que será retornada pelo rabbitMQ após consumir a mensagem da fila 
     * @param channel {Channel} uma variável que será utilizada para criar uma conexão com o RabbitMQ
     * @returns retorna uma mensagem armazenada na fila "BROKER"
     */

    public async consume(callback: (message: Message) => void, channel:Channel) {
        return channel.consume(this.queue, (message) => {
            if(message) {
                callback(message);
                channel.ack(message);
            }    
        })
    }    
}