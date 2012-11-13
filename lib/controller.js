var say = require('./say'), kn = require('kn'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    orm = require('./orm'),
    NGramCountModel = kn.NGramCountModel,
    KneserNeyModFixModel2 = kn.KneserNeyModFixModel2,
    NGram = kn.NGram;



var Controller = function(options){
    this.cur = (options)? options.cur : null;
    this.voice = (options)? options.voice : null;
    this.rate = (options)? options.rate : null;
    this.backoff = (options)? options.backoff : null;
    this.profile = (options)? options.profile : 'default'
    this.connection = (options)? options.connection : mongoose.connect('mongodb://localhost/emospeak');
    // need a write to the db option..
    this.ngcm = new NGramCountModel();
};

Controller.prototype.submitLine = function(callback){

    /* when we submit a new line, want to take the following steps
        1) call say for TTS
        2) save to the DB
        3) add to the counter
        4) calculate a new backoff model
    */
    var cur = this.cur;
    var profile = this.profile;
    if (cur && cur.length >0){
        this.ngcm.populate(cur);
        var knmfm2 = new KneserNeyModFixModel2(this.ngcm);
        this.backoff = knmfm2.calcBackoff();
        var Message = this.connection.model('Message');
        var newMsg = new Message({message:cur, created:new Date(), profile:profile});
        newMsg.save(function(err){
            if (err) console.log('issue trying to save msg = ',this.cur,err);
        });
        say.say(cur, callback, {voice:this.voice, rate:this.rate});
    }

}

Controller.prototype.init = function(callback){
    /* on init we want to
        1) stream phrases from db into a new count model
        2) calculate a new backoff model
     */
    var self = this;
    self.ngcm = new NGramCountModel();
    var Message = this.connection.model('Message');
//    Message.findAll(function(err, msgs){
        Message.find({}, function(err,msgs){
        _.each(msgs, function(msg){
            console.log(msg);
            self.ngcm.populate(msg.message);
        });
    });
    callback();
}

module.exports = {Controller:Controller};