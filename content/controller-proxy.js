define([
    'jquery',
    'underscore',
    'backbone',
    'socket.io',
    'events',
    'event-type'
], function($, _, Backbone, io, events, EventType){

    var Controller = Backbone.Model.extend({
        listeners: {},
        initialize: function(){
            this.ee = new events.EventEmitter();
            this.connect = this.options && this.options.connect || 'http://localhost:4000/events';
            var socket = this.socket = io.connect(this.connect);
            var self = this;
//            this.lastEvent = Controller.events.NEUTRAL;
//            this.inTimeout = false;
//            this.timeout = this.options && this.options.timeout || 1000;

//                    _.each(Controller.events, function(event){
            _.each(EventType, function(event){

                var emit = function(data){
                   // console.log('socket',event, data);
//                    var doubles = Controller.doubles[event];
//                    if (!doubles || doubles && !self.inTimeout && self.lastEvent != event){
                        self.ee.emit(event,data);
//                        self.inTimeout = true;
//                        setTimeout(function(){self.inTimeout = false;},self.timeout);
//                    }

//                    self.lastEvent = event;
                };


                self.socket.on(event, emit);
            })
            socket.on('connect', function () {
                self.nextWord('');
                self.suggest('');
            });
//            socket.on('disconnect', function () {
//            });
        },
        addListener: function(event, cb){
            this.ee.addListener(event, cb);
            return this;
        },
        emit: function(event, e){ this.ee.emit(event,e)},
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
            this.ee.emit(EventType.MODE,{old:oldMode, mode:mode});
//            this.ee.emit(Controller.events.MODE,{old:oldMode, mode:mode});
        }
    });

//    Controller.doubles = [Controller.events.BLINK, Controller.events.NEUTRAL];

//    Controller.doubles = [Controller.events.BLINK, Controller.events.LOOK_LEFT,
//        Controller.events.LOOK_RIGHT, Controller.events.WINK_LEFT, Controller.events.WINK_RIGHT,
//        Controller.events.LIFT, Controller.events.DROP, Controller.events.NEUTRAL];

    return Controller;

});