import { OperationList } from "../models/OperationList";
import { Operation, Sell, Broker } from "../models/Operation";

export class Controller {
  constructor() {}

  add(type: string, value: number, qnt: number, name: string): void {
    OperationList.add(new Sell(type, value, qnt, new Broker(value, qnt, name)));
  }

  get(): Operation[] {
    return OperationList.get();
  }
}
