import { Buy, Sell, Operation, Transfer } from "./Operation";
import { Types } from "./Types";
import { sendOperation, getMessages } from "../api/api";
import { OperationInterface } from "./OperationInterface";
export class OperationList {
  private static _operations: Operation[] = [];
  private static _init = 0;

  static async add(op: Operation) {
    //this._rabbitmqServer.start()
    this._operations.push(op);
    this.sort();
    switch (op.getType()) {
      case Types.sell:
        await this.confirmIfSell(op);
        break;
      case Types.buy:
        await this.confirmIfBuy(op);
        break;
    }
    await sendOperation(op);
  }

  private static sort(): void {
    this._operations.sort((a, b) => (a.getDate() > b.getDate() ? -1 : 1));
  }

  static get(): Operation[] {
    return ([] as Operation[]).concat(this._operations);
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
        await sendOperation(o);
        await sendOperation(op);
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

  public static async initialize(id: string) {
    const messages = await getMessages(id);
    const initializeAt = this._init;
    for (let i = initializeAt; i < messages.length; i++) {
      try {
        const msg = messages[i];
        const operationJSON: OperationInterface = JSON.parse(msg);
        let operation: Operation;
        switch (operationJSON.type) {
          case Types.buy:
            operation = new Buy(
              operationJSON.value,
              operationJSON.qnt,
              operationJSON.broker,
              operationJSON.owner
            );
            break;
          case Types.sell:
            operation = new Sell(
              operationJSON.value,
              operationJSON.qnt,
              operationJSON.broker,
              operationJSON.owner
            );
            break;
          case Types.transfer:
            operation = new Transfer(
              operationJSON.value,
              operationJSON.qnt,
              operationJSON.broker,
              operationJSON.owner
            );
        }
        this._init++;
        this._operations.push(operation);
      } catch (error) {}
    }
  }
}
