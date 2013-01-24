var say = require('./say'), kn = require('kn'),
    events = require('events'),
    natural = require('natural'),
    tokenizer = new natural.WordTokenizer(),
    spell = require('spell'),
    fs = require('fs'),
    emojs = require('emojs'),
    EventEmitter = events.EventEmitter,
    _ = require('underscore'),
    json = require('jsonreq'),
    EventType = require('../shared/event-type'),
    NGramCountModel = kn.NGramCountModel,
    KneserNeyModFixModel2 = kn.KneserNeyModFixModel2,
    NGram = kn.NGram;


var Controller = function(options){
    this.options = options;
    this.initialize();
};

Controller.prototype  = new EventEmitter;
Controller.cogMap = {
    0x0001: EventType.NEUTRAL,
    0x0002: EventType.PUSH,
    0x0004: EventType.PULL,
    0X0008: EventType.LIFT,
    0X0010: EventType.DROP,
    0X0020: EventType.LEFT,
    0X0040: EventType.RIGHT,
    0X0080: EventType.ROTATE_LEFT,
    0X0100: EventType.ROTATE_RIGHT,
    0X0200: EventType.ROTATE_CW,
    0X0400: EventType.ROTATE_CCW,
    0X0800: EventType.ROTATE_FWD,
    0X1000: EventType.ROTATE_BCK,
    0X2000: EventType.DISAPPEAR
};


Controller.prototype.submitLine = function(msg){
    /* when we submit a new line, want to take the following steps
        2) save to the DB
        3) add to the counter
        4) calculate a new backoff model
    */
    if (msg && msg.length >0){
        this.ngcm.populate(msg);

        // take care of history
        if (!this.ngcm.history) this.ngcm.history = [];
        this.ngcm.history.push({date:new Date().getTime(), msg:msg});

        // take care of bigram parsing..
        this.parseBigrams(msg);
        this.genPrefix(msg);

        this.store();

        this.dict.load(msg, { reset: false } );
        this.calcBackoff();
        this.emit(EventType.SUBMIT_LINE,msg);
    }
};

Controller.prototype.parseBigrams = function(line){
    if (!line || !this.ngcm) return;

    if (!this.ngcm.bigramChars) this.ngcm.bigramChars = {};
    var bcs = this.ngcm.bigramChars;

    if (!bcs) bcs = {};
    for (var i= 0; i<line.length; i++){
        if (i < line.length-1){
            var a = line.charAt(i).toLowerCase();
            var b = line.charAt(i+1).toLowerCase();
            if (a.match(/[a-z]/) && b.match(/[a-z]/)){
                if (!bcs[a]) bcs[a] = [];
                if (!_.contains(bcs[a],b))
                    bcs[a].push(b);
            }
        }
    }
};
Controller.prototype.getBigramFor = function(letter){
    if (this.ngcm && this.ngcm.bigramChars)
        return this.ngcm.bigramChars[letter];
    return null;
};

Controller.prototype.genPrefix = function(text){
    if (!text || !this.ngcm) return;

    if (!this.ngcm.prefixMap)
        this.ngcm.prefixMap = {};
    var pm = this.ngcm.prefixMap;

    _.each(tokenizer.tokenize(text),function(word){
        var pre = '';
        for (var i=0; i<word.length-1;i++){
            pre += word.charAt(i);
            if (!pm[pre]) pm[pre]=[];
            var entry = (i == word.length-2) ? pre+word.charAt(i+1)+'*' : pre+word.charAt(i+1);
            if (!_.contains(pm[pre],entry)){
                pm[pre].push(entry);
                pm[pre].sort();
            }
        }
    });
}
Controller.prototype.getWords = function(prefix){
    if (!prefix && !this.ngcm || !this.ngcm.prefixMap) return [];
    var words = this.ngcm.prefixMap[prefix];
    if (!words) return [];
    var union = [];
    var terminals = _.filter(words,function(w){
        return ~w.indexOf('*');
    });
    var pres = _.difference(words,terminals);
    terminals = _.map(terminals, function(w){
        return w.substring(0, w.length-1);
    })
    union = _.union(union,terminals);
    if (pres && pres.length){
        var each = function(w){union = _.union(union,this.getWords(w));};
        _.each(pres,each,this);
    }
    return union;
}

Controller.prototype.store = function(cb){
    var stringVersion = JSON.stringify(this.ngcm);
    var response = cb || function(e){if (e) {console.log(e)} else {console.log('saved',storage)}};
    var storage = 'store.json'

    fs.exists(storage, function(exists){
        if (exists){
            fs.rename('store.json','store.json~', function(err){
                if (err) console.log(err);
                fs.writeFile(storage,stringVersion,response);
            });
        } else {
            fs.writeFile(storage,stringVersion,response);
        }
    })
};

Controller.prototype.say = function(msg, callback){
    if (msg && msg.length >0){
        say.say(msg, callback, {voice:this.voice, rate:this.rate});
        this.emit(EventType.SAY,msg);
    }
}

Controller.prototype.suggest = function(word, cb){

    var self = this;
    json.get('http://www.freebase.com/private/suggest?type=%2Fbase%2Fwordnet%2Fword&type_strict=any&prefix='+word, function(err, data){
        if (err){
            console.log('error',err);
        }
        var fb = [];
        var preLookup = self.getWords(word);
        if (preLookup && preLookup.length){
            _.each(preLookup, function(r){
                fb.push({words:['s',r]})
            })
        }

        _.each(data.result, function(r){
            fb.push({words:['s',r.name]})
        })
        self.emit(EventType.SUGGEST,fb);
        cb(fb);
    });
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
        this.emit(EventType.NEXTWORD,[]);
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

    this.emit(EventType.NEXTWORD,options);

    return options;

}

Controller.prototype.calcBackoff = function(){
    var knmfm2 = new KneserNeyModFixModel2(this.ngcm);
    this.backoff = knmfm2.calcBackoff();
}

Controller.prototype.getFavorites = function(){
    return this.ngcm.favorites;
}

Controller.prototype.addFavorite = function(fav){
    if (this.ngcm && fav){
        if (!this.ngcm.favorites) this.ngcm.favorites = [];
        if (!~this.ngcm.favorites.indexOf(fav)){
            this.ngcm.favorites.push(fav);
            this.parseBigrams(fav);
            this.genPrefix(fav);
            this.store();
        }
    }
}

Controller.prototype.removeFavorite = function(fav){
    if (this.ngcm && this.ngcm.favorites && this.ngcm.favorites.length && fav){
        this.ngcm.favorites.splice(this.ngcm.favorites.indexOf(fav),1);
        this.store();
    }
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
    this.epoc = new emojs.NodeEPOCDriver();
    this.ngcm = new NGramCountModel();
//    this.favorites = [];
    this.mode = null;

//    console.log('profile',this.profile)

    var self = this;
    self.ngcm = new NGramCountModel();
    self.ngcm.profile = this.options && this.options.profile || '';
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
            if (parsed.favorites) self.ngcm.favorites = parsed.favorites;
            if (parsed.profile || !self.ngcm.profile) self.ngcm.profile = parsed.profile;
            self.ngcm.index = parsed.index;
            self.ngcm.dictionary = parsed.dictionary;
            self.ngcm.order = parsed.order;
            self.ngcm.bigramChars = parsed.bigramChars;
            self.ngcm.prefixMap = parsed.prefixMap;
            self.calcBackoff();
            self.dict.load({corpus:corpus});

            self.connect();

            console.log('loaded store.json');
        });
        if (this.callback) this.callback();
    }
};
Controller.prototype.connect = function(){
    console.log('profile',this.ngcm.profile)
    if (this.ngcm.profile){
        var self = this;
        this.epoc.connect(this.ngcm.profile, function(e){
            //  console.log(e.time);
            if (e.blink) {
                self.emit(EventType.BLINK,e);
            } else if (e.lookLeft) {
                self.emit(EventType.LOOK_LEFT,e);
            } else if (e.lookRight){
                self.emit(EventType.LOOK_RIGHT,e);
    //                } else if (e.winkLeft){
    //                    self.emit(EventType.WINK_LEFT,e);
    //                } else if (e.winkRight) {
    //                    self.emit(EventType.WINK_RIGHT,e);
            }
    //                } else  if (e.cognitivAction == 1 || e.cognitivAction && e.cognitivPower > self.powerThreshold) {
    //                    self.emit(Controller.cogMap[e.cognitivAction],e);
    //                }

            if (e.gyroX != 0 || e.gyroY != 0 ){
                self.emit(EventType.GYRO_DELTA, {x:e.gyroX, y:e.gyroY});
            }

            if (e.cognitivAction == 1 || e.cognitivAction && e.cognitivPower > self.powerThreshold) {
                self.emit(Controller.cogMap[e.cognitivAction],e);
            }

    //        if (e.eyebrow) self.emit(EventType.EYEBROW,e);
    //        if (e.furrow) self.emit(EventType.FURROW,e);
    //        if (e.smile) self.emit(EventType.SMILE,e);
    //        if (e.clench) self.emit(EventType.CLENCH,e);
    //        if (e.smirkLeft) self.emit(EventType.SMIRK_LEFT,e);
    //        if (e.smirkRight) self.emit(EventType.SMIRK_RIGHT,e);
    //        if (e.laugh) self.emit(EventType.LAUGH,e);
    //        if (e.shortTermExcitement) console.log('Short Term Excitement: ', e.eyebrow);
    //        if (e.longTermExcitement) console.log('Long Term Excitement: ', e.eyebrow);
    //        if (e.engagementOrBoredom) console.log('Engagement or Boredom: ', e.eyebrow);

        });
    }
};
Controller.prototype.disconnect = function(cb){
    this.epoc.disconnect(cb);
};
Controller.prototype.reconnect = function(){
    var self = this;
    this.epoc.disconnect(function(){self.connect();});
};
Controller.prototype.getProfile = function(){
    if (!this.ngcm) return null;
    return this.ngcm.profile;
}
Controller.prototype.setProfile = function(profile){
    if (!this.ngcm) return null;
    this.ngcm.profile = profile;
}

module.exports = {Controller:Controller};