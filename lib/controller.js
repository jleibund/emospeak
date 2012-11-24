var say = require('./say'), kn = require('kn'),
    mongoose = require('mongoose'),
    events = require('events'),
    natural = require('natural'),
    spell = require('spell'),
    orm = require('./orm'),
    EventEmitter = events.EventEmitter,
    _ = require('underscore'),
    NGramCountModel = kn.NGramCountModel,
    KneserNeyModFixModel2 = kn.KneserNeyModFixModel2,
    NGram = kn.NGram;


var Controller = function(options){
//    this.cur = (options)? options.cur : null;
    this.voice = (options && options.voice)? options.voice : null;
    this.rate = (options && options.rate)? options.rate : null;
    this.backoff = (options && options.backoff)? options.backoff : null;
    this.profile = (options && options.profile)? options.profile : 'default'
    //this.conn = options.connection;

    this.conn = (options && options.connection)? options.connection : mongoose.connect('mongodb://localhost/emospeak');
 //   this.events = new ControllerEvents();
    // need a write to the db option..
    this.ngcm = new NGramCountModel();
};

Controller.prototype  = new EventEmitter;
Controller.NEUTRAL = '/COG/NEUTRAL';
Controller.PUSH = '/COG/PUSH';
Controller.PULL = '/COG/PULL';
Controller.DROP = '/COG/DROP';
Controller.LIFT = '/COG/LIFT';
Controller.LEFT = '/COG/LEFT';
Controller.RIGHT = '/COG/RIGHT';
Controller.ROTATE_LEFT = '/COG/ROTATE_LEFT';
Controller.ROTATE_RIGHT = '/COG/ROTATE_RIGHT';
Controller.ROTATE_CW = '/COG/ROTATE_CLOCKWISE';
Controller.ROTATE_CCW = '/COG/ROTATE_COUNTER_CLOCKWISE';
Controller.ROTATE_FWD = '/COG/ROTATE_FORWARD';
Controller.ROTATE_BCK = '/COG/ROTATE_REVERSE';
Controller.DISAPPEAR = '/COG/DISAPPEAR';
Controller.WINK_LEFT = '/EXP/WINK_LEFT';
Controller.WINK_RIGHT = '/EXT/WINK_RIGHT';
Controller.SMILE = '/EXP/SMILE';
Controller.FURROW = '/EXP/FURROW';
Controller.SUBMIT_LINE = '/CONTROL/SUBMIT';
Controller.SAY = '/CONTROL/SAY';
Controller.NEXTWORD = '/CONTROL/NEXTWORD';
Controller.SELECT = '/CONTROL/SELECT';


Controller.prototype.submitLine = function(msg){
    /* when we submit a new line, want to take the following steps
        2) save to the DB
        3) add to the counter
        4) calculate a new backoff model
    */
    var profile = this.profile;
    if (msg && msg.length >0){
        this.ngcm.populate(msg);
        this.dict.load(msg, { reset: false } );
        this.calcBackoff();
//        var Message = mongoose.model('Message');
        var MessageSchema = this.conn.model('Message');
        var newMsg = new MessageSchema({message:msg, created:new Date(), profile:profile});
        newMsg.save(function(err){
            if (err) console.log('issue trying to save msg = ',msg,err);
        });
        this.emit(Controller.SUBMIT_LINE,msg);
    }
}

Controller.prototype.say = function(msg, callback){
    if (msg && msg.length >0){
        say.say(msg, callback, {voice:this.voice, rate:this.rate});
        this.emit(Controller.SUBMIT_LINE,msg);
    }
}

Controller.prototype.suggest = function(word){
    return this.dict.suggest(word);
}

Controller.prototype.nextWord = function(msg){
    var words = [];
    var test = null;
    var reformat = (msg) ? NGramCountModel.START+msg.toLowerCase() : NGramCountModel.START;
    if (msg && msg.length >0){
        // get the last two words..
        var bigrams = natural.NGrams.bigrams(reformat,1);
        words = bigrams[bigrams.length-1];
        var idx1 = this.ngcm.index[words[0]];
        var idx2 = this.ngcm.index[words[1]];
        if (idx1 && idx2) test = new NGram([idx1,idx2]);
    } else {
        words = [NGramCountModel.START];
        var idx1 = this.ngcm.index['s'];
        if (idx1) test = new NGram([idx1]);
    }

    if (!test){
        this.emit(Controller.NEXTWORD,[]);
        return [];
    }

    var getWords = function(ngram, index){
        var str = [];
        _.each(ngram.keys,function(key){
            str.push(index[key]);
        });
        return str;
    };

    var options = [];

    var hashes = this.backoff.forwardLookup[test.hash()];

    var end = this.ngcm.index['s'];
    _.each(hashes,function(h){
        var item = (test.keys.length==2)? this.backoff.highOrderNGrams[h] : this.backoff.lowerOrderNGrams[1][h];
        var lastKey = item.ngram.keys[item.ngram.keys.length-1];
        if (lastKey != end){
            options.push(item);
        }
    },this);

    options.sort(function(a,b){
        return b.probability- a.probability;
    });

    _.each(options, function(item){
        item.words = getWords(item.ngram, this.ngcm.dictionary);
    }, this);

    this.emit(Controller.NEXTWORD,options);

    return options;

}

Controller.prototype.calcBackoff = function(){
    var knmfm2 = new KneserNeyModFixModel2(this.ngcm);
    this.backoff = knmfm2.calcBackoff();
}

Controller.prototype.init = function(callback){
    /* on init we want to
        1) stream phrases from db into a new count model
        2) calculate a new backoff model
     */
    var self = this;
    self.ngcm = new NGramCountModel();
    self.dict = spell();
    //var Message = this.conn.model('Message')

    var MessageSchema = this.conn.model('Message');
    MessageSchema.findAll(function(err,msgs){
        for (var m=0;m<msgs.length;m++){
            var msg = msgs[m];
            console.log(msg);
            self.ngcm.populate(msg.message);
            self.dict.load(msg.message, { reset: false } );
        }
        self.calcBackoff();
        callback();
    });
//    self.calcBackoff();
//    callback();
}

module.exports = {Controller:Controller};