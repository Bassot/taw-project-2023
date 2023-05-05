import mongoose = require('mongoose');
export interface Item extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,
    name: string,
    type: "Dish" | "Drink";
    price: number;
    stock: number
    getStock: ()=>number,
    changeStock: (number)=>number
}

var ItemSchema = new mongoose.Schema<Item>( {
    name: {
        type: mongoose.SchemaTypes.
            String,
        required: true,
        unique: true
    },
    type: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    price: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    stock: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
})




export function getSchema() { return ItemSchema; }



// Mongoose Model
var itemModel : any;  // This is not exposed outside the model
export function getModel() : mongoose.Model< Item >  { // Return Model as singleton
    if( !itemModel ) {
        /*Nel metodo model(), non importa se si passa un nome maiuscolo al singolare, la collezione nel db
         *viene creata sempre in minuscolo al plurale. Tipo 'User'->users.
         */
        itemModel = mongoose.model('Item', getSchema() )
    }
    return itemModel;
}

export function newTable( data: any ): Item {
    var _itemmodel = getModel();
    return new _itemmodel(data);
}