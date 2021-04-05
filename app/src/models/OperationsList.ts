import {Operation} from "./Operation"

export class OperationsLists {
    private _list: Operation[];

    constructor() {
        this._list = [];
    }

    public addOperation = (operation: Operation) => {
        this._list.push(operation);
        
    }




}