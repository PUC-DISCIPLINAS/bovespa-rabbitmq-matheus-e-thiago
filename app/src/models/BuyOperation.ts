import {Operation2} from "./Operation2"

export  class BuyOperation extends Operation2{

    constructor(value: number, quant: number, broker: string) {
        super(value,quant,broker)
    }


    public execute2 = (broker:string,quant:number,value:number):number => {
        if(broker === this.getBroker() && value === this.getValue()){
            if(quant > this.getQuant()){
                this.setQuant(0);
                return 1;
            }else if(quant < this.getQuant()){
                this.setQuant(this.getQuant() - quant)
            } else return 0;
        }
        return 0;
    }
    // Retorna 0 se quant === get_quant / 1 se quant > get_quant / 2 se quant < get_quant.
    // Retorna -1 se broker ou valores forem diferentes.

}