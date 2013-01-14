
//requirejs.config({
//    paths: {
//        jquery: 'libs/jquery/jquery.min',
//        underscore: 'libs/underscore/underscore.min',
//        backbone: 'libs/backbone/backbone.min',
//        three: 'libs/three/three.min',
//        socket: 'libs/socket.io/socket.io',
//        eventemitter: 'libs/eventemitter/EventEmitter',
//        stats: 'libs/three/stats.min',
//        detector: 'libs/three/Detector',
//        templates: '../templates',
//        'backbone.localStorage': 'lib/backbone.localStorage'
//    },
//    shim: {
//        underscore: {
//            exports: '_'
//        },
//        backbone: {
//            deps: ['underscore', 'jquery'],
//            exports: 'Backbone'
//        },
//        socket: {
//            exports: 'io'
//        },
//        eventemitter: {
//            exports: 'EventEmitter'
//        },
//        'backbone.localStorage': {
//            deps: ['backbone'],
//            exports: 'Backbone'
//        },
//        stats: {
//            exports:'Stats'
//        },
//        detector:{
//            exports:'Detector'
//        },
//        three:{
//            exports:'THREE'
//        }
//    }
//});

define([
    'jquery',
    'underscore',
    'backbone',
    'views/CubeView',
    'views/FooterView',
    'views/SelectorView',
    'views/ModeView',
    'views/KeyboardView',
    'views/FavoriteView',
    'controller-proxy',
    'event-type'
], function($, _, Backbone, CubeView, FooterView, SelectorView, ModeView, KeyboardView, FavoriteView, Controller, EventType) {


//    function up(e) {return e.keyCode === 38}
//    function down(e) {return e.keyCode === 40}
//    function left(e) {return e.keyCode ===37}
//    function right(e) {return e.keyCode ===39}
//    function push(e) {return e.metaKey}
//    function pull(e) {return e.altKey}
//    function q(e) {return e.keyCode ===81}
//    function w(e) {return e.keyCode ===87}
//    function a(e) {return e.keyCode ===65}
//    function s(e) {return e.keyCode ===83}
//    function z(e) {return e.keyCode ===90}
//    function x(e) {return e.keyCode ===88}


    var Router = Backbone.Router.extend({
        routes: {
            "*actions": "main"
        },
        main: function(){


        //    var conn = mongoose.createConnection("mongodb://localhost/emospeak");
            var controller = this.controller = new Controller();
            var wordView  = new SelectorView({el:$('.words')});
//            var suggestView  = new SelectorView({controller:controller, mode:'suggested', el:$('.suggested')});
//            var selectorMap = this.selectorMap = {words:wordView};

            var footerView = this.footerView = new FooterView({controller:controller, el:$('.readout')});
            var keyboardView = this.keyboardView = new KeyboardView({el:$('.lt')});
            var favoriteView = this.favoriteView = new FavoriteView({el:$('.favorite-view')});

            keyboardView.on(KeyboardView.SUBMIT,function(e){footerView.add(e)});
            keyboardView.on(KeyboardView.CHANGE,function(e){controller.suggest(e)});
            keyboardView.on(KeyboardView.FAVORITE,function(e){favoriteView.save(e)});
            keyboardView.on(KeyboardView.CLEAR,function(e){footerView.nextWord()});
            favoriteView.on(FavoriteView.SELECT, function(e){footerView.add(e)});
            wordView.on(SelectorView.SELECT,function(e){controller.emit(EventType.SELECT,e)});

//            controller.addListener(EventType.BLINK,function(e){cubeView.center()});
//            controller.addListener(EventType.LIFT,function(e){cubeView.moveUp()});
//            controller.addListener(EventType.DROP,function(e){cubeView.moveDown()});
//            controller.addListener(EventType.LOOK_LEFT,function(e){cubeView.moveLeft()});
//            controller.addListener(EventType.LOOK_RIGHT,function(e){cubeView.moveRight()});
//            controller.addListener(EventType.LEFT,function(e){cubeView.moveLeft()});
//            controller.addListener(EventType.RIGHT,function(e){cubeView.moveRight()});
//            controller.addListener(EventType.PUSH,function(e){cubeView.movePush()});
//            controller.addListener(EventType.PULL,function(e){cubeView.movePull()});
//            controller.addListener(EventType.ROTATE_FWD,function(e){cubeView.rotateFwd()});
//            controller.addListener(EventType.ROTATE_BCK,function(e){cubeView.rotateBck()});
//            controller.addListener(EventType.ROTATE_CW,function(e){cubeView.rotateCW()});
//            controller.addListener(EventType.ROTATE_CCW,function(e){cubeView.rotateCCW()});
//            controller.addListener(EventType.ROTATE_LEFT,function(e){cubeView.rotateLeft()});
//            controller.addListener(EventType.ROTATE_RIGHT,function(e){cubeView.rotateRight()});
//            controller.addListener(EventType.NEUTRAL,function(e){cubeView.center()});

            controller.addListener(EventType.NEXTWORD,function(e){wordView.wordOptions(e)});
            controller.addListener(EventType.SUGGEST,function(e){wordView.wordOptions(e)});
//            controller.addListener(EventType.LIFT,function(e){ selectorMap[controller.getMode()].moveUp()});
//            controller.addListener(EventType.DROP,function(e){ selectorMap[controller.getMode()].moveDown()});
//            controller.addListener(EventType.PULL,function(e){ selectorMap[controller.getMode()].pick()});
            controller.addListener(EventType.BLINK,function(e){ wordView.pick()});

//            controller.addListener(EventType.MODE,function(e){ });

//            controller.addListener(EventType.MODE,function(e){modeView.onSetMode(e)});
//            controller.addListener(EventType.MODE,function(e){if (e.mode == 'words') footerView.nextWord()});
//            controller.addListener(EventType.MODE,function(e){selectorMap[controller.getMode()].setSelection(0)})
//            controller.addListener(EventType.MODE,function(e){_.each(_.values(selectorMap), function(view){view.setSelection(0)})});
//            controller.addListener(EventType.LOOK_RIGHT,function(e){modeView.nextMode()});
//            controller.addListener(EventType.LOOK_LEFT,function(e){modeView.prevMode()});

            controller.addListener(EventType.PUSH, function(e){footerView.remove(); });
            controller.addListener(EventType.SELECT,function(e){footerView.add(e)});
            controller.addListener(EventType.SELECT,function(e){keyboardView.onClear(e)});

//            controller.addListener(EventType.COPY, function(e){ footerView.copy(); })
            controller.addListener(EventType.CLEAR, function(e){ footerView.clear();  })
            controller.addListener(EventType.URL, function(e){ footerView.url(); })
            controller.addListener(EventType.SEARCH, function(e) { footerView.search() });
            controller.addListener(EventType.BACKSPACE, function(e){ footerView.remove();  })
            controller.addListener(EventType.SUBMIT, function(e){ footerView.submit(); footerView.say(); footerView.clear(); })
            controller.addListener(EventType.SAY, function(e){ footerView.say();  })

//            controller.addListener(EventType.LOOK_RIGHT,function(e){ footerView.add(' ')});
//            controller.addListener(EventType.BLINK,function(e){ footerView.say()});

            var delta = 11;
            this.curView = wordView;
            var self = this;
            wordView.on(SelectorView.MOVERIGHT,function(e){
                self.curView = keyboardView;
                keyboardView.setSelection('y');
                wordView.setSelection(-1);
            });
            keyboardView.on(KeyboardView.MOVELEFT, function(e){
                self.curView = wordView;
                wordView.setSelection(0);
                keyboardView.setSelection(null);
            });
            controller.addListener(EventType.GYRO_DELTA,function(e){

                // change this
                if (e.x > delta && self.curView)  self.curView.moveRight();
                else if (e.x < -delta && self.curView)  self.curView.moveLeft();

                if (e.y > delta && self.curView)  self.curView.moveUp();
                else if (e.y < -delta && self.curView)  self.curView.moveDown();
            });

            // what to do about clear, submitLine, etc?

            // defaults - yes and no
//            controller.addListener(EventType.PUSH,function(e){controller.say('Yes')});
//            controller.addListener(EventType.PULL,function(e){controller.say('No')});

//            $("#container").html(cubeView.render().el).show();

//            _.each(_.values(selectorMap), function(v){v.render()});
        }
    });

    var router = new Router();
    router.main();
    return router;
});