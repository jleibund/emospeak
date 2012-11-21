var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;


var MessageSchema = new Schema({
    message:{type:String},
    profile:{type:String},
    created:{type:Date}
}, {strict:true});

MessageSchema.statics.findAll = function(cb){
    return this.find({},cb)
};

mongoose.model('Message', MessageSchema);
module.exports.MessageSchema = MessageSchema;
