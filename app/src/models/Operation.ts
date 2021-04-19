import { Types } from "./Types";

/**
 * Classe abstrata que representa uma operacao dentro do sistema
 */
export abstract class Operation {
  private _type: Types;
  private _value: number;
  private _quant: number;
  protected _broker: string;
  protected _owner: string;
  private _date: Date;
  private _active: boolean = true;

  /**
   * 
   * @param type 
   * @param value 
   * @param quant 
   * @param broker 
   * @param owner 
   * inicializa os atributos da classe e verifica se ainda possui objetos disponiveis na operação, caso não exista coloca active como false para demonstrar que a operação está desativada
   */
  constructor(
    type: Types,
    value: number,
    quant: number,
    broker: string,
    owner: string
  ) {
    this._type = type;
    this._value = value;
    this._quant = quant;
    this._broker = broker;
    this._owner = owner;
    this._date = new Date();
    if (quant <= 0) {
      this._active = false;
    }
  }

  /**
   * Vende a operação para uma Operation op e atualiza a quantidade, caso a quantidade restante seja 0 desativa a operação igualando active a false
   * @param op {Operation}
   */
  public sell = (op: Operation) => {
    const qntSold = op._quant> this._quant ? this._quant: op._quant;
    op.buy(qntSold);
    this._date = new Date();
    this._quant = this._quant - qntSold;
    if (this._quant <= 0) {
      this._active = false;
    }
  };

  /**
   * A operação compra uma quantidade de items e atualiza a sua quantidade, caso a quantidade estante seja 0 desativa a operação igualando active a false
   * @param qnt {number}
   */
  private buy = (qnt: number) => {
    this._quant = this._quant - qnt;
    this._date = new Date();
    if (this._quant <= 0) {
      this._active = false;
    }
  };

  /**
   * utilizada para adicionar mais na quantidade de objetos disponíveis para a operação
   * @param qnt {number}
   */
  public addMore = (qnt: number) => {
    this._quant = +this._quant + +qnt;
    this._date = new Date();
    if (this._quant > 0) {
      this._active = true;
    }
  };

  /**
   * 
   * @returns retorna o valor total da operação multiplicando o valor da unidade pela sua quantidade
   */
  public getTotalValue = (): number => {
    return this._value * this._quant;
  };

  public getType = (): string => {
    return this._type;
  };

  public getQnt = (): number => {
    return this._quant;
  };

  public getValue = (): number => {
    return this._value;
  };

  public getBroker = (): string => {
    return this._broker;
  };

  public getDate = (): Date => {
    return this._date;
  };

  public isActive = () => {
    return this._active;
  };

  public setActive = (active: boolean) => {
    this._active = active;
  };

  public getOwner = (): string => {
    return this._owner;
  };
}

/**
 * @class filha de operation e tem o seu tipo definido pelo enum Types.sell
 */
export class Sell extends Operation {
  constructor(value: number, quant: number, broker: string, owner: string) {
    super(Types.sell, value, quant, broker, owner);
  }
}

/**
 * @class filha de operation e tem o seu tipo definido pelo enum Types.buy
 */
export class Buy extends Operation {
  constructor(value: number, quant: number, broker: string, owner: string) {
    super(Types.buy, value, quant, broker, owner);
  }
}

/**
 * @class filha de operation e tem o seu tipo definido pelo enum Types.Transfer
 */
export class Transfer extends Operation {
  constructor(value: number, quant: number, broker: string, owner: string) {
    super(Types.transfer, value, quant, broker, owner);
  }

  /**
   * 
   * @returns retorna o nome da pessoa que está vendendo e da pessoa que está comprando a operação
   */
  public getBroker = (): string => {
    return this._broker + " -> " + this._owner;
  };
}
