import { Operation, Transfer } from "./Operation";
import { Types } from "./Types";
import { sendOperation } from "../api/api";

export class OperationList {
  private static _operations: Operation[] = [];
  //private static _rabbitmqServer: RabbitMQServer = new RabbitMQServer('amqps://kahlzmrv:OASXWAFgUNArCgwzkd0hoPvoE-If0xdu@jackal.rmq.cloudamqp.com/kahlzmrv');

  static async add(op: Operation, buyer?: string) {
    //this._rabbitmqServer.start()
    switch (op.getType()) {
      case Types.sell:
        await this.confirmIfSell(op);
        break;
      case Types.buy:
        await this.confirmIfBuy(op);
        break;
    }
    await sendOperation(op);
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
        this.sort();
        return true;
      }
    }
    return false;
  }

  //Quando insere uma operação de compra, ele pecorre todos e ve se alguem queria vender
  static async confirmIfBuy(op: Operation): Promise<boolean> {
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
        const transfer = new Transfer(
          op.getValue(),
          qnt,
          op.getOwner(),
          o.getOwner()
        );
        this.add(transfer);
        await sendOperation(transfer);
        return true;
      }
    }
    return false;
  }

  //Quando insere uma operação de venda, ele pecorre todas e vê se tinha alguém querendo comprar
  static async confirmIfSell(op: Operation): Promise<boolean> {
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
        //cria a transação
        op.sell(o);
        const transfer = new Transfer(
          o.getValue(),
          qnt,
          o.getOwner(),
          op.getOwner()
        );
        this.add(transfer);
        await sendOperation(transfer);
        return true;
      }
    }
    return false;
  }
}
