import axios from "axios";
import { Operation } from "../models/Operation";
import { OperationInterface } from "../models/OperationInterface";

export const api = axios.create({
  baseURL: "http://localhost:8002/",
});

export const bind = async (actives:string[]): Promise<number> => {
  try {
    console.log(actives)
    return await (await api.post("/bind" , actives )).data;
  } catch (e) {
    console.error(e);
  }
};

export const getMessages = async (id: string): Promise<string[]> => {
  try {
    return await (await api.get("/messages/" + id)).data;
  } catch (e) {
    console.error(e);
  }
};

export const sendOperation = async (
  operation: Operation
): Promise<Operation> => {
  try {
    const op: OperationInterface = {
      broker: operation.getBroker().substr(0,5),
      date: operation.getDate(),
      qnt: operation.getQnt(),
      type: operation.getType(),
      value: operation.getValue(),
      owner: operation.getOwner(),
    };
    console.log(op.broker.substr(0,5));
    return await (await api.post("/send", op)).data;
  } catch (e) {
    console.error(e);
  }
};
