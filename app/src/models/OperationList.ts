import { Operation, Transfer } from "./Operation";
import { Types } from "./Types";
import { RabbitMQServer } from "./RabbitMQServer";

export class OperationList {
  private static _operations: Operation[] = [];
  private static _rabbitmqServer: RabbitMQServer = new RabbitMQServer('amqps://kahlzmrv:OASXWAFgUNArCgwzkd0hoPvoE-If0xdu@jackal.rmq.cloudamqp.com/kahlzmrv');

  static async add(op: Operation, buyer?: string) {
    this._rabbitmqServer.start()
    switch (op.getType()) {
      case Types.sell:
        this.confirmIfSell(op);
        break;
      case Types.buy:
        this.confirmIfBuy(op);
        break;
    }
    this._operations.push(op);
    this.sort();
  }

  private static sort(): void {
    this._operations.sort((a, b) => (a.getDate() > b.getDate() ? -1 : 1));
  }

  static get(): Operation[] {
    return ([] as Operation[]).concat(this._operations);
  }

  //quando insere uma operação de venda, ele pecorre todos e vê se aquela operação já estava
  //sendo vendida, para aumentar a quantidade
  static update(op: Operation): boolean {
    for (let o of this._operations) {
      if (
        o.getType() === Types.sell &&
        o.getBroker() === op.getBroker() &&
        o.getValue() === op.getValue()
      ) {
        o.addMore(op.getQnt());
        this.add(
          new Transfer(op.getValue(), op.getQnt(), op.getOwner(), o.getOwner())
        );
        this.sort();
        return true;
      }
    }
    return false;
  }

  //Quando insere uma operação de compra, ele pecorre todos e ve se alguem queria vender
  static confirmIfBuy(op: Operation): boolean {
    const list: Operation[] = this._operations.filter(
      (o) => o.getType() === Types.sell
    );
    for (let o of list) {
      if (
        o.getBroker() === op.getBroker() &&
        o.getValue() === op.getValue() &&
        +o.getQnt() >= +op.getQnt()
      ) {
        const qnt = op.getQnt();
        o.sell(op);
        //cria a transação
        this.add(new Transfer(op.getValue(), qnt, op.getOwner(), o.getOwner()));
        return true;
      }
    }
    return false;
  }

  //Quando insere uma operação de venda, ele pecorre todas e vê se tinha alguém querendo comprar
  static confirmIfSell(op: Operation): boolean {
    const list: Operation[] = this._operations.filter(
      (o) => o.getType() === Types.buy
    );
    for (let o of list) {
      if (
        o.getBroker() === op.getBroker() &&
        o.getValue() === op.getValue() &&
        +o.getQnt() <= +op.getQnt()
      ) {
        const qnt = o.getQnt();
        op.sell(o);
        //cria a transação
        this.add(new Transfer(o.getValue(), qnt, o.getOwner(), op.getOwner()));
        return true;
      }
    }
    return false;
  }
}
