export  class Operation2 {
    private _value: number
    private _quant: number
    private _broker: string[4]
    private _type: string

    
    constructor(value: number, quant: number, broker: string ) {
        this._value = value;
        this._quant = quant;
        this._broker = broker;
  
    }

    public getType = () => {
        return this._type;
    }

    public getValue = ():number => {
        return this._value;
    }

    public getQuant = ():number => {
        return this._quant;
    }

    public setQuant = (quant:number) => {
        this._quant = quant;
    }
    public getBroker = ():string => {
        return this._broker;
    }

    public  execute = (broker:string,value:number) => {
        if(broker === this.getBroker() && value === this.getValue()){
            return true;
        } else return false;
    };

    

}