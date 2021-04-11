import { Types } from "./Types";
export abstract class Operation {
  private _type: Types;
  private _value: number;
  private _quant: number;
  protected _broker: string;
  protected _owner: string;
  private _date: Date;
  private _active: boolean = true;

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

  public sell = (op: Operation) => {
    const qntSold = op._quant;
    op.buy(qntSold);
    this._date = new Date();
    this._quant = this._quant - qntSold;
    if (this._quant <= 0) {
      this._active = false;
    }
  };

  private buy = (qnt: number) => {
    this._quant = this._quant - qnt;
    this._date = new Date();
    if (this._quant <= 0) {
      this._active = false;
    }
  };

  public addMore = (qnt: number) => {
    this._quant = +this._quant + +qnt;
    this._date = new Date();
    if (this._quant > 0) {
      this._active = true;
    }
  };

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

export class Sell extends Operation {
  constructor(value: number, quant: number, broker: string, owner: string) {
    super(Types.sell, value, quant, broker, owner);
  }
}

export class Buy extends Operation {
  constructor(value: number, quant: number, broker: string, owner: string) {
    super(Types.buy, value, quant, broker, owner);
  }
}

export class Transfer extends Operation {
  constructor(value: number, quant: number, broker: string, owner: string) {
    super(Types.transfer, value, quant, broker, owner);
  }

  public getBroker = (): string => {
    return this._broker + " -> " + this._owner;
  };
}
