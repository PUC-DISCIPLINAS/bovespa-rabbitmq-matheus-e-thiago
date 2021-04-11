import { OperationList } from "../models/OperationList";
import { Operation, Sell, Buy } from "../models/Operation";
import { Types } from "../models/Types";
export class Controller {
  constructor() {}

  add(type: Types, value: number, qnt: number, name: string): void {
    let op: Operation;
    switch (type) {
      case Types.sell:
        op = new Sell(type, value, qnt, name);
        if (!OperationList.update(op)) {
          OperationList.add(op);
        }
        break;
      case Types.buy:
        op = new Buy(type, value, qnt, name);
      case Types.transfer:

      default:
        OperationList.add(op);
    }
  }

  get(): Operation[] {
    return OperationList.get();
  }
}
