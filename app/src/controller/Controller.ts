import { OperationList } from "../models/OperationList";
import { Operation, Sell, Buy, Transfer } from "../models/Operation";
import { Types } from "../models/Types";
import { sendOperation } from "../api/api";
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
        if (!OperationList.update(op)) {
          OperationList.add(op);
        }
        console.log("send to api");
        const res2 = await sendOperation(op);
        console.log(res2);
        break;
      case Types.buy:
        op = new Buy(value, qnt, name, owner);
        OperationList.add(op);
        console.log("send to api");
        const res = await sendOperation(op);
        console.log(res);
        break;
    }
  }

  get(): Operation[] {
    return OperationList.get();
  }
}
