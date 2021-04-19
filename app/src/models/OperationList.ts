import { Buy, Sell, Operation, Transfer } from "./Operation";
import { Types } from "./Types";
import { sendOperation, getMessages } from "../api/api";
import { OperationInterface } from "./OperationInterface";

/**
 * @class repsonsável por armazenar um array de operações e realizar transições entre elas
 */
export class OperationList {
  private static _operations: Operation[] = [];
  private static _init = 0;

  /**
   * Recebe uma operação e adiciona na lista de operações
   * @param op {Operation}
   */
  //adiciona uma nova lista
  static async add(op: Operation) {
    switch (op.getType()) {
      case Types.sell:
        if (!(await this.confirmIfSell(op))) await this.confirmIfExist(op);
        break;
      case Types.buy:
        await this.confirmIfBuy(op);
        break;
    }
  }

  /**
   * Ordena a lista de operações de acordo com a ultima data de atualização
   */
  private static sort(): void {
    this._operations.sort((a, b) => (a.getDate() > b.getDate() ? -1 : 1));
  }

  static get(): Operation[] {
    return ([] as Operation[]).concat(this._operations);
  }

  /**
   * Quando insere uma operação de compra, ele pecorre todos e ve se alguem queria vender
   * @param op {Operation}
   * @returns retorna um boolean: true acaso seja criada uma transferencia e false caso não
   */
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
    await sendOperation(op);
    return false;
  }

  /**
   * Quando insere uma operação de venda, ele pecorre todas e vê se tinha alguém querendo comprar
   * @param op {Operation}
   * @returns retorna um boolean: true acaso seja criada uma transferencia e false caso não
   */
  static async confirmIfSell(op: Operation): Promise<boolean> {
    const list: Operation[] = this._operations.filter(
      (o) => o.getType() === Types.buy
    );
    for (let o of list) {
      if (
        o.getBroker() === op.getBroker() &&
        o.getValue() === op.getValue()) {
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
        await sendOperation(o);
        await sendOperation(op);
        return true;
      }
    }
    await sendOperation(op);
    return false;
  }

  /**
   * Quando insere uma operação de venda, ele pecorre todas e vê se já existia essa operação para aumentar a quantidade
   * @param op {Operation}
   * @returns retorna true caso seja incrementado em alguma operação e false caso não
   */
  static async confirmIfExist(op: Operation): Promise<boolean> {
    const list: Operation[] = this._operations.filter(
      (o) => o.getType() === Types.sell
    );
    for (let o of list) {
      if (o.getBroker() === op.getBroker() && o.getValue() === op.getValue()) {
        op.addMore(o.getQnt());
        await sendOperation(op);
        this._operations = this._operations.filter((oLambda) => oLambda !== o);
        return true;
      }
    }
    await sendOperation(op);
    return false;
  }

  /**
   * Pega as operações do back-end que estão armazenadas para aquele usuário no backend a partir de um id no localstorage
   * @param id {string}
   */
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
    this.sort();
  }
}
