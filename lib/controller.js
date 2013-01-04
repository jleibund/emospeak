var say = require('./say'), kn = require('kn'),
    events = require('events'),
    natural = require('natural'),
    spell = require('spell'),
    fs = require('fs'),
    emojs = require('emojs'),
    EventEmitter = events.EventEmitter,
    _ = require('underscore'),
    json = require('jsonreq'),
    NGramCountModel = kn.NGramCountModel,
    KneserNeyModFixModel2 = kn.KneserNeyModFixModel2,
    NGram = kn.NGram;

// connect to emotiv


var Controller = function(options){
//    this.cur = (options)? options.cur : null;
    this.options = options;
    this.initialize();
};

Controller.prototype  = new EventEmitter;
Controller.events = {};
Controller.events.NEUTRAL = '/COG/NEUTRAL';
Controller.events.PUSH = '/COG/PUSH';
Controller.events.PULL = '/COG/PULL';
Controller.events.DROP = '/COG/DROP';
Controller.events.LIFT = '/COG/LIFT';
Controller.events.LEFT = '/COG/LEFT';
Controller.events.RIGHT = '/COG/RIGHT';
Controller.events.ROTATE_LEFT = '/COG/ROTATE_LEFT';
Controller.events.ROTATE_RIGHT = '/COG/ROTATE_RIGHT';
Controller.events.ROTATE_CW = '/COG/ROTATE_CLOCKWISE';
Controller.events.ROTATE_CCW = '/COG/ROTATE_COUNTER_CLOCKWISE';
Controller.events.ROTATE_FWD = '/COG/ROTATE_FORWARD';
Controller.events.ROTATE_BCK = '/COG/ROTATE_REVERSE';
Controller.events.DISAPPEAR = '/COG/DISAPPEAR';
Controller.events.BLINK = '/EXP/BLINK';
Controller.events.LOOK_LEFT = '/EXP/LOOK_LEFT';
Controller.events.LOOK_RIGHT = '/EXP/LOOK_RIGHT';
Controller.events.SMIRK_LEFT = '/EXP/SMIRK_LEFT';
Controller.events.SMIRK_RIGHT = '/EXP/SMIRK_RIGHT';
Controller.events.WINK_LEFT = '/EXP/WINK_LEFT';
Controller.events.WINK_RIGHT = '/EXP/WINK_RIGHT';
Controller.events.EYEBROW = '/EXP/EYEBROW';
Controller.events.SMILE = '/EXP/SMILE';
Controller.events.LAUGH = '/EXP/LAUGH';
Controller.events.FURROW = '/EXP/FURROW';
Controller.events.SUBMIT_LINE = '/CONTROL/SUBMIT';
Controller.events.SAY = '/CONTROL/SAY';
Controller.events.NEXTWORD = '/CONTROL/NEXTWORD';
Controller.events.SELECT = '/CONTROL/SELECT';
Controller.events.MODE = '/CONTROL/MODE';
Controller.events.SUGGEST = '/CONTROL/SUGGEST';
Controller.events.GYRO_DELTA = '/GYRO/DELTA';
Controller.cogMap = {
    0x0001: Controller.events.NEUTRAL,
    0x0002: Controller.events.PUSH,
    0x0004: Controller.events.PULL,
    0X0008: Controller.events.LIFT,
    0X0010: Controller.events.DROP,
    0X0020: Controller.events.LEFT,
    0X0040: Controller.events.RIGHT,
    0X0080: Controller.events.ROTATE_LEFT,
    0X0100: Controller.events.ROTATE_RIGHT,
    0X0200: Controller.events.ROTATE_CW,
    0X0400: Controller.events.ROTATE_CCW,
    0X0800: Controller.events.ROTATE_FWD,
    0X1000: Controller.events.ROTATE_BCK,
    0X2000: Controller.events.DISAPPEAR
};


Controller.prototype.submitLine = function(msg){
    /* when we submit a new line, want to take the following steps
        2) save to the DB
        3) add to the counter
        4) calculate a new backoff model
    */
    var profile = this.profile;
    if (msg && msg.length >0){
        this.ngcm.populate(msg);

        var stringVersion = JSON.stringify(this.ngcm);
        fs.writeFile('store.json.tmp', stringVersion , function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
                fs.renameSync('store.json','store.json~');
                fs.renameSync('store.json.tmp','store.json');
            }
        });

        this.dict.load(msg, { reset: false } );
        this.calcBackoff();
//        var Message = mongoose.model('Message');
//        var MessageSchema = this.conn.model('Message');
//        var newMsg = new MessageSchema({message:msg, created:new Date(), profile:profile});
//        newMsg.save(function(err){
//            if (err) console.log('issue trying to save msg = ',msg,err);
//        });
        this.emit(Controller.events.SUBMIT_LINE,msg);
    }
}

Controller.prototype.say = function(msg, callback){
    if (msg && msg.length >0){
        say.say(msg, callback, {voice:this.voice, rate:this.rate});
        this.emit(Controller.events.SAY,msg);
    }
}

//Controller.prototype.getMode = function(mode){
//    return this.mode;
//}
//
//Controller.prototype.setMode = function(mode){
//    console.log('changing mode:',mode)
//    var oldMode = this.mode;
//    this.mode = mode;
//    this.emit(Controller.MODE,{old:oldMode, mode:mode});
//}

Controller.prototype.suggest = function(word, cb){
//    var suggest = this.dict.suggest(word);
//    console.log(suggest)
//    if (suggest){
//        this.emit(Controller.events.SUGGEST,suggest);
//        return suggest;
//
//    } else {
    var self = this;
        json.get('http://www.freebase.com/private/suggest?type=%2Fbase%2Fwordnet%2Fword&type_strict=any&prefix='+word, function(err, data){
            if (err){
                console.log('error',err);
            }
            var fb = [];
            _.each(data.result, function(r){
                fb.push({words:['s',r.name]})
                console.log(r.name);
            })
            self.emit(Controller.events.SUGGEST,fb);
            cb(fb);
        });
//    }
}

Controller.prototype.nextWord = function(msg){
    var self = this;
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
        this.emit(Controller.events.NEXTWORD,[]);
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

    this.emit(Controller.events.NEXTWORD,options);

    return options;

}

Controller.prototype.calcBackoff = function(){
    var knmfm2 = new KneserNeyModFixModel2(this.ngcm);
    this.backoff = knmfm2.calcBackoff();
}

Controller.prototype.initialize = function(){
    /* on init we want to
        1) stream phrases from db into a new count model
        2) calculate a new backoff model
     */
    this.voice = this.options && this.options.voice;
    this.rate = this.options && this.options.rate;
    this.backoff = this.options && this.options.backoff;
    this.powerThreshold = this.options && this.options.powerThreshold || 0.2;
    this.callback = this.options && this.options.callback;
    this.profile = this.options && this.options.profile;
    this.epoc = new emojs.NodeEPOCDriver();
    this.ngcm = new NGramCountModel();
    this.mode = null;

    console.log('profile',this.profile)

    var self = this;
    self.ngcm = new NGramCountModel();
    self.dict = spell();
    //var Message = this.conn.model('Message')

    if (fs.existsSync('store.json')){
        fs.readFile('store.json',function(err,data){
            if (err) throw err;
            var parsed = JSON.parse(data);
            var corpus = {};
            _.each(parsed.data,function(order){
                var cur = {};
                self.ngcm.data.push(cur);
                _.each(_.keys(order), function(d){
                    var obj = order[d];
                    cur[d] = {ngram:new NGram(obj.ngram.keys), count:obj.count};

                    // for all of the unigrams, load into our spell dictionary too
                    if (!order){
                        corpus[parsed.dictionary[obj.ngram.keys[0]]] = obj.count;
                    }
                });
            });
            self.ngcm.index = parsed.index;
            self.ngcm.dictionary = parsed.dictionary;
            self.ngcm.order = parsed.order;
            self.calcBackoff();
            self.dict.load({corpus:corpus});

            console.log('loaded store.json');


            self.epoc.connect(self.profile, function(e){
              //  console.log(e.time);
                if (e.blink) {
                    self.emit(Controller.events.BLINK,e);
                } else if (e.lookLeft) {
                    self.emit(Controller.events.LOOK_LEFT,e);
                } else if (e.lookRight){
                    self.emit(Controller.events.LOOK_RIGHT,e);
//                } else if (e.winkLeft){
//                    self.emit(Controller.events.WINK_LEFT,e);
//                } else if (e.winkRight) {
//                    self.emit(Controller.events.WINK_RIGHT,e);
                }
//                } else  if (e.cognitivAction == 1 || e.cognitivAction && e.cognitivPower > self.powerThreshold) {
//                    self.emit(Controller.cogMap[e.cognitivAction],e);
//                }

                if (e.gyroX != 0 || e.gyroY != 0 ){
                    self.emit(Controller.events.GYRO_DELTA, {x:e.gyroX, y:e.gyroY});
                }

                if (e.cognitivAction == 1 || e.cognitivAction && e.cognitivPower > self.powerThreshold) {
                    self.emit(Controller.cogMap[e.cognitivAction],e);
                }

//        if (e.eyebrow) self.emit(Controller.events.EYEBROW,e);
//        if (e.furrow) self.emit(Controller.events.FURROW,e);
//        if (e.smile) self.emit(Controller.events.SMILE,e);
//        if (e.clench) self.emit(Controller.events.CLENCH,e);
//        if (e.smirkLeft) self.emit(Controller.events.SMIRK_LEFT,e);
//        if (e.smirkRight) self.emit(Controller.events.SMIRK_RIGHT,e);
//        if (e.laugh) self.emit(Controller.events.LAUGH,e);
//        if (e.shortTermExcitement) console.log('Short Term Excitement: ', e.eyebrow);
//        if (e.longTermExcitement) console.log('Long Term Excitement: ', e.eyebrow);
//        if (e.engagementOrBoredom) console.log('Engagement or Boredom: ', e.eyebrow);

            });
        });
        if (this.callback) this.callback();

    }

//    var MessageSchema = this.conn.model('Message');
//    MessageSchema.findAll(function(err,msgs){
//        for (var m=0;m<msgs.length;m++){
//            var msg = msgs[m];
//            console.log(msg);
//            self.ngcm.populate(msg.message);
//            self.dict.load(msg.message, { reset: false } );
//        }
//        self.calcBackoff();
//        callback();
//    });
}

module.exports = {Controller:Controller};