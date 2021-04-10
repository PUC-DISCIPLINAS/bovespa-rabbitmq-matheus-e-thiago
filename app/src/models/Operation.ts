export abstract class Operation {
  private _type: string;
  private _value: number;
  private _quant: number;
  private _broker: Broker;

  constructor(type: string, value: number, quant: number, broker: Broker) {
    this._type = type;
    this._value = value;
    this._quant = quant;
    this._broker = broker;
  }

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

  public getBroker = (): Broker => {
    return this._broker;
  };

  public abstract execute;
}

export class Sell extends Operation {
  public execute: any;
}

export class Broker {
  private _quant: number;
  private _name: string;
  private _value: number;

  constructor(value: number, quant: number, name: string) {
    this._value = value;
    this._quant = quant;
    this._name = name;
  }

  public getTotalValue = (): number => {
    return this._value * this._quant;
  };

  public buy = (quant: number, value: number): boolean => {
    if (quant <= this._quant && this.getTotalValue() <= value) {
      this._quant -= quant;
      return true;
    } else return false;
  };

  public transition = () => {};

  public getName = (): string => {
    return this._name;
  };
}
