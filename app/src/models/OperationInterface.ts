/**
 * @interface OperationInterface define uma interface de Operation que será utilizada para enviar operações do front para a api
 */

export interface OperationInterface {
  broker: string;
  date: Date;
  qnt: number;
  type: string;
  value: number;
  owner: string;
}
