import {Operation2} from "./Operation2"
import {Transition} from "./Transition"
import amqp from 'amqplib/callback_api'

export class StockExchange {
    private _buyList: Operation2[];
    private _sellList: Operation2[];

    constructor() {
        this._buyList = [];
        this._sellList = [];

       
    }

    public addBuy = (Operation2: Operation2) => {
        this._buyList.push(Operation2);
    }

    public addSell = (Operation2: Operation2) => {
        this._sellList.push(Operation2);
    }

    public removeBuy = (Operation2: Operation2) => {
        this._buyList.filter((op) => op != Operation2);
    }

    public removeSell = (Operation2: Operation2) => {
        this._sellList.filter((op) => op != Operation2);
    }

    public getBuyList = ():Operation2[] => {
        return this._buyList
    }

    public getSellList = ():Operation2[] => {
        return this._sellList
    }

    public tryTransition = (operation:Operation2):Transition => {
        let transition = new Transition()
        if(operation.getType() === "BUY") {
            this._sellList.forEach((op) => {
                let message = transition.realizeTransition(operation,op)
                if(message != "/fail") {
                    let messageArray = message.split("/")
                    if(messageArray[0] === "BUY"){
                        this.removeSell(op);
                        operation.setQuant(parseInt(messageArray[1]))
                        this.addBuy(operation)
                        this.publishToTopicOperation(operation);
                        return true;
                    } else if (messageArray[0] === "SELL") {
                        this.removeSell(op);
                        op.setQuant(parseInt(messageArray[1]))
                        this.addSell(op);
                        this.publishToTopicOperation(op);
                        return true;
                    } else {
                        this.removeSell(op);
                        this.publishToTopicOperation(op)
                        return true;
                    }
                }
            })
        } else {
            this._buyList.forEach((op) => {
                let message = transition.realizeTransition(op,operation)
                if(message != "/fail") {
                    let messageArray = message.split("/")
                    if(messageArray[0] === "BUY") {
                        this.removeBuy(op);
                        op.setQuant(parseInt(messageArray[1]));
                        this.addBuy(op);
                        this.publishToTopicOperation(op);
                        return true;
                    } else if (messageArray[0] === "SELL") {
                        this.removeBuy(op);
                        operation.setQuant(parseInt(messageArray[1]));
                        this.addSell(operation)
                        this.publishToTopicOperation(operation);
                        return true;
                    } else {
                        this.removeSell(op);
                        return true;
                    }
                }

            })
        }
        return transition.getQuant() ? transition : null;
    }

 

    private publishToTopicOperation = (operation:Operation2) => {
        amqp.connect('amqp://localhost', function(error0, connection) {
            if(error0) {
                throw error0;
            }
            connection.createChannel(function(error1, channel) {
                if (error1) {
                  throw error1;
                }
                let exchange = 'topic_logs';
                let key = `${operation.getType()}.${operation.getBroker()}`;
                let msg = `${operation.getQuant()},${operation.getValue()},${operation.getBroker()}`;
            
                channel.assertExchange(exchange, 'topic', {
                  durable: false
                });
                channel.publish(exchange, key, Buffer.from(msg));
                console.log(" [x] Sent %s:'%s'", key, msg);

              });
            
              setTimeout(function() {
                connection.close();
                process.exit(0)
              }, 500);
            }); 
    }

    



}