const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter product name"],
        trim:true
    },
    price:{
        type:Number,
        required:[true,"please enter product price"],
        maxLength:[8,"price cannot exceed 8 figures"]
    },
    category:{
        type:String,
        required:[true,"please enter product category"]
    },
    description:{
        type:String,
        required:[true,"please enter product description"]
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            image_url:{
                type:String,
                required:true
            }            
        }
    ],
    ratings:{
        type:Number,
        default:0
    },
    stock:{
        type:Number,
        required:[true,"please enter product stock"],
        maxLength:[4,"stock cannot exceed 4 figures"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            name:{
                type:String,
                required:[true,'please enter your name']
            },
            rating:{
                type:Number,
                required:[true,'please give rating']
            },
            comment:{
                type:String,
                required:[true,'please describe your review']
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('Product',productSchema);