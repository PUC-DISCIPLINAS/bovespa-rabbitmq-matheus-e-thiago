import  { Operation2 } from "./Operation2"

export class Transition {
    private _date: Date
    private _broker1: string[4]
    private _broker2: string[4]
    private _value: number
    private _quant: number

    constructor() {

    }

    public getQuant = ():number => {
        return this._quant;
    }

    public getBroker = ():string[4] => {
        return this._broker1;
    }

    public getDate = ():Date => {
        return this._date;
    }

    public getValue = ():number => {
        return this._value;
    }


    public realizeTransition = (buyOperation:Operation2, sellOperation:Operation2):string => {
        let quant
        if(sellOperation.execute(buyOperation.getBroker(),buyOperation.getValue())){
            quant = sellOperation.getQuant() - buyOperation.getQuant();

            if(quant < 0) {
                this.fillVariables(buyOperation,sellOperation,sellOperation.getQuant())
                return `BUY/${quant*(-1)}`
            } else if (quant > 0 ){
                this.fillVariables(buyOperation,sellOperation,buyOperation.getQuant())
                return `SELL/${quant}`
            } else{
                this.fillVariables(buyOperation,sellOperation,buyOperation.getQuant())
                return "/0"
            } 

                
        } else return "/fail"
    }

    public fillVariables = (buyOperation:Operation2, sellOperation:Operation2,quant:number) => {
        this._date = new Date()
        this._broker1 = buyOperation.getBroker()
        this._broker2 = sellOperation.getBroker()
        this._value = sellOperation.getValue()
        this._quant = quant
    }

    //Retorna uma string em um dos 4 formatos sell/numero se a quantidade de compra foi totalmente suprida e sobrou de venda.
    //                                        buy/numero se a quantidade de venda foi totalmente suprida e sobrou de compra.
    //                                        /0 se as duas quantidades forem iguais.
    //                                        /fail se o valour ou borkers nao forem iguais 
}