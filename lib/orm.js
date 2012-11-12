var mongoose = require('mongoose'), Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;


var MessageSchema = new Schema({
    message:{type:String}
}, {strict:true});

MessageSchema.plugin(useTimestamps);

module.exports.MessageSchema = mongoose.model('MessageSchema', MessageSchema);
