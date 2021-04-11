import { types } from "node:util";
import { Operation } from "./Operation";
import { Types } from "./Types";
export class OperationList {
  private static _operations: Operation[] = [];

  static add(op: Operation): void {
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

  static confirmIfBuy(op: Operation): boolean {
    const list: Operation[] = this._operations.filter(
      (o) => o.getType() === Types.sell
    );
    for (let o of list) {
      if (
        o.getBroker() === op.getBroker() &&
        o.getValue() === op.getValue() &&
        o.getQnt() >= op.getQnt()
      ) {
        o.sell(op);
        return true;
      }
    }
    return false;
  }

  static confirmIfSell(op: Operation): boolean {
    const list: Operation[] = this._operations.filter(
      (o) => o.getType() === Types.buy
    );
    for (let o of list) {
      if (
        o.getBroker() === op.getBroker() &&
        o.getValue() === op.getValue() &&
        o.getQnt() <= op.getQnt()
      ) {
        op.sell(o);
        return true;
      }
    }
    return false;
  }
}
