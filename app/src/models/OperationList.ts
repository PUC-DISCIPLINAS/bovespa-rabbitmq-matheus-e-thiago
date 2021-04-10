import { Operation } from "./Operation";

export class OperationList {
  private static _operations: Operation[] = [];

  static add(op: Operation): void {
    this._operations.push(op);
  }

  static get(): Operation[] {
    return ([] as Operation[]).concat(this._operations);
  }
}
