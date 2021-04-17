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

export const bind = async (): Promise<number> => {
  try {
    return await (await api.post("/bind")).data;
  } catch (e) {
    console.error(e);
  }
};

export const getMessages = async (id: string): Promise<string> => {
  try {
    return await (await api.post("/messages", { id })).data;
  } catch (e) {
    console.error(e);
  }
};

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
