define([
    'jquery',
    'underscore',
    'backbone',
    'socket',
    'eventemitter'
], function($, _, Backbone, io, EventEmitter){

    var Controller = Backbone.Model.extend({
        listeners: {},
        initialize: function(){
            this.ee = new EventEmitter();
            var socket = this.socket = io.connect('http://localhost:4000/events');
            var self = this;
            _.each(Controller.events, function(event){
                self.socket.on(event,function(data){
                    console.log('socket',event, data);

                    self.ee.emit(event,data);
                });
            })
        },
        addListener: function(event, cb){
            this.ee.addListener(event,cb);
            return this;
        },
        say: function(msg, cb){ this.call(msg,cb, 'say') },
        submitLine: function(msg, cb){ this.call(msg,cb, 'submitLine') },
        suggest: function(msg, cb){ this.call(msg,cb, 'suggest') },
        nextWord: function(msg, cb){ this.call(msg,cb, 'nextWord') },
        call: function(msg, cb, verb){
            $.getJSON('/'+verb+'?term=' + msg, function (obj, err) {
                if (cb) cb(obj.payload);
            });
            return this;
        },
        getMode: function(){
            return this.mode;
        },
        setMode: function(mode){
            var oldMode = this.mode;
            this.mode = mode;
            this.ee.emit(Controller.events.MODE,{old:oldMode, mode:mode});
        }
    });
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

    return Controller;

});