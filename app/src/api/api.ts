import axios from "axios";
import { Operation } from "../models/Operation";
import { OperationInterface } from "../models/OperationInterface";

/**
 * cria uma conexão com o backend na porta 8002
 */
export const api = axios.create({
  baseURL: "http://localhost:8002/",
});

/**
 * envia para o back uma requisição /bind para bindar ativos
 * @param actives {string[]}
 * @returns um post para o backend passando lista de ativos 
 */
export const bind = async (actives:string[]): Promise<number> => {
  try {
    return await (await api.post("/bind" , actives )).data;
  } catch (e) {
    console.error(e);
  }
};

/**
 * envia para o back uma requisição /messages pegar mensagens pertencentes a um usuário a partir de seu id
 * @param id {string}
 * @returns uma get para o backend passando o id do usuário 
 */
export const getMessages = async (id: string): Promise<string[]> => {
  try {
    return await (await api.get("/messages/" + id)).data;
  } catch (e) {
    console.error(e);
  }
};

/**
 * envia para o back uma requisição /send para enviar para o backend uma operação
 * @param opearation {Operation}
 * @returns um post para o backend passando a operação
 */
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
    return await (await api.post("/send", op)).data;
  } catch (e) {
    console.error(e);
  }
};
