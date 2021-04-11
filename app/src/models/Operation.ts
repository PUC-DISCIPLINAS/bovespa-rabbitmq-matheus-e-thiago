import { Types } from "./Types";
export abstract class Operation {
  private _type: Types;
  private _value: number;
  private _quant: number;
  private _broker: string;
  private _date: Date;
  private _active: boolean = true;

  constructor(type: Types, value: number, quant: number, broker: string) {
    this._type = type;
    this._value = value;
    this._quant = quant;
    this._broker = broker;
    this._date = new Date();
    if (quant <= 0) {
      this._active = false;
    }
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

  public sell = (op: Operation) => {
    const value = op.getValue();
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

  public abstract execute(list: Operation[]): Operation;
}

export class Sell extends Operation {
  public execute = (list: Operation[]): Operation => {
    return this;
  };
}

export class Buy extends Operation {
  public execute = (list: Operation[]): Operation => {
    return this;
  };
}

// export class Broker {
//   private _quant: number;
//   private _name: string;
//   private _value: number;

//   constructor(value: number, quant: number, name: string) {
//     this._value = value;
//     this._quant = quant;
//     this._name = name;
//   }

//   public getTotalValue = (): number => {
//     return this._value * this._quant;
//   };

//   public buy = (quant: number, value: number): boolean => {
//     if (quant <= this._quant && this.getTotalValue() <= value) {
//       this._quant -= quant;
//       return true;
//     } else return false;
//   };

//   public transition = () => {};

//   public getName = (): string => {
//     return this._name;
//   };
// }
