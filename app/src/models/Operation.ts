export abstract class Operation {
    private _type: string
    private _value: number
    private _quant: number
    private _broker: Broker
    
    constructor(type: string, value: number, quant: number, broker: Broker) {
        this._type = type;
        this._value = value;
        this._quant = quant;
        this._broker = broker;
    }

    public getTotalValue = ():number => {
        return this._value * this._quant;
    }

    public getType = ():string => {
        return this._type;
    }

    public abstract execute;


}

export class Broker {
    private _quant: number
    private _name: string
    private _value: number
    
    constructor(quant: number, name: string,value: number ) {
        this._quant = quant;
        this._name = name;
    }

    public getTotalValue = ():number => {
        return this._value * this._quant;
    }

    public buy = (quant: number, value: number):boolean => {
        if(quant <= this._quant && this.getTotalValue() <= value){
            this._quant -= quant
            return true;
        } else 
            return false;
    }


    public transition = () => {

    }
}