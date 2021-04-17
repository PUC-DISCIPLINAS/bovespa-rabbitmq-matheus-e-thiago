import {RabbitMQServer} from "../app/src/models/RabbitMQServer"

function f () {
    const server = new RabbitMQServer('amqps://kahlzmrv:OASXWAFgUNArCgwzkd0hoPvoE-If0xdu@jackal.rmq.cloudamqp.com/kahlzmrv')
    server.start()
}

f();
console.log('aaaaaa')