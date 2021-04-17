import { OperationList } from "../models/OperationList";
import { Operation, Sell, Buy, Transfer } from "../models/Operation";
import { Types } from "../models/Types";
export class Controller {
  constructor() {}

  async add(
    type: Types,
    value: number,
    qnt: number,
    name: string,
    owner: string
  ) {
    let op: Operation;
    switch (type) {
      case Types.sell:
        op = new Sell(value, qnt, name, owner);
        OperationList.add(op);
        break;
      case Types.buy:
        op = new Buy(value, qnt, name, owner);
        OperationList.add(op);
        break;
    }
  }

  get(): Operation[] {
    return OperationList.get();
  }
}
