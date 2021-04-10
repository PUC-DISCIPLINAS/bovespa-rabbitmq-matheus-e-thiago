import { Operation } from "./Operation";

export class OperationList {
  private static _operations: Operation[] = [];

  static add(op: Operation): void {
    this._operations.push(op);
  }

  private static sort(): void {
    this._operations.sort((a, b) => (a.getDate() > b.getDate() ? -1 : 1));
  }

  static get(): Operation[] {
    return ([] as Operation[]).concat(this._operations);
  }

  static update(op: Operation): boolean {
    for (let o of this._operations) {
      if (o.getBroker() === op.getBroker() && o.getValue() === op.getValue()) {
        o.addMore(op.getQnt());
        this.sort();
        return true;
      }
    }
    return false;
  }
}
