import axios from "axios";
import { Operation } from "../models/Operation";

interface SendOperation {
  broker: string;
  date: Date;
  qnt: number;
  type: string;
  value: number;
  owner: string;
}

export const api = axios.create({
  baseURL: "http://localhost:8002/",
});

export const sendOperation = async (
  operation: Operation
): Promise<Operation> => {
  try {
    const op: SendOperation = {
      broker: operation.getBroker(),
      date: operation.getDate(),
      qnt: operation.getQnt(),
      type: operation.getType(),
      value: operation.getValue(),
      owner: operation.getOwner(),
    };
    console.log("/send: ", op);
    return await (await api.post("/send", op)).data;
  } catch (e) {
    console.error(e);
  }
};
