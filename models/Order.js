const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        userId:{type: String, required: true},
        products:[//used array as user can add multiple products

            {
                productId:{
                    type: String,
                },
                quantity: {
                    type:Number, 
                    default:1
                },   
            },

        ],

        amount:{type: Number, required: true},
        address:{type: Object, required: true},   //used object because its gonna contain multiple lines.
        status:{type:String, default:"pending"},  //after shipping the product we can change it to "On its way", when recived by user we can do it "order shipped"
    },


    {timestamps:true}
);

module.exports = mongoose.model("Order",OrderSchema)