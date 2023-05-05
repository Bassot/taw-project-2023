import mongoose = require('mongoose');
import {Item} from "./Item";
export interface Table extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,
    total_seats: number,
    free_seats: number,
    state: "Free" | "Occupied",
    orders: Item[], //???
    bill: number,
    takeSeat: ()=>void,
    freeSeat: ()=>void
}

var userSchema = new mongoose.Schema<Table>( {
    total_seats: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    free_seats: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    state: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    /*
    orders: {
        type: //???
        required: true,
    },
    */
})

userSchema.methods.isFree = function(): boolean {
    return this.state == "Free";
}

userSchema.methods.takeSeat = function(): void {
    if(this.free_seats>0){
        this.free_seats--;
    }
    if(this.total_seats!=this.free_seats){
        this.state = "Occupied";
    }
}

userSchema.methods.freeSeat = function(): void {
    if(this.free_seats<this.total_seats){
        this.free_seats++;
    }
    if(this.total_seats==this.free_seats){
        this.state = "Free";
    }
}




export function getSchema() { return userSchema; }



// Mongoose Model
var tableModel : any;  // This is not exposed outside the model
export function getModel() : mongoose.Model< Table >  { // Return Model as singleton
    if( !tableModel ) {
        /*Nel metodo model(), non importa se si passa un nome maiuscolo al singolare, la collezione nel db
         *viene creata sempre in minuscolo al plurale. Tipo 'User'->users.
         */
        tableModel = mongoose.model('Table', getSchema() )
    }
    return tableModel;
}

export function newTable( data: any ): Table {
    var _tablemodel = getModel();
    return new _tablemodel(data);
}
