const mongoose = require('mongoose')

const typeMsgSchema = new mongoose.Schema({
    instantMessage : {
        type : String
    } 
},{timestamps:true})

const typeMsgModel = mongoose.model('instantMsg', typeMsgSchema)

module.exports = typeMsgModel