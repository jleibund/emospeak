
requirejs.config({
    paths: {
        jquery: 'libs/jquery/jquery.min',
        underscore: 'libs/underscore/underscore.min',
        backbone: 'libs/backbone/backbone.min',
        three: 'libs/three/three.min',
        socket: 'libs/socket.io/socket.io',
        eventemitter: 'libs/eventemitter/EventEmitter',
        stats: 'libs/three/stats.min',
        detector: 'libs/three/Detector',
        templates: '../templates',
        'backbone.localStorage': 'lib/backbone.localStorage'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        socket: {
            exports: 'io'
        },
        eventemitter: {
            exports: 'EventEmitter'
        },
        'backbone.localStorage': {
            deps: ['backbone'],
            exports: 'Backbone'
        },
        stats: {
            exports:'Stats'
        },
        detector:{
            exports:'Detector'
        },
        three:{
            exports:'THREE'
        }
    }
});

requirejs([
    'jquery',
    'underscore',
    'backbone',
    'views/CubeView',
    'views/FooterView',
    'views/SelectorView',
    'views/ModeView',
    'controller-proxy'
], function($, _, Backbone, CubeView, FooterView, SelectorView, ModeView, Controller) {


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
            var wordView  = new SelectorView({controller:controller, mode:'words', el:$('.words')});
            var suggestView  = new SelectorView({controller:controller, mode:'suggested', el:$('.suggested')});
            var vowelView = new SelectorView({controller:controller, mode:'vowels', el:$('.vowels')});
            var c1View = new SelectorView({controller:controller, mode:'c1', el:$('.c1')});
            var c2View = new SelectorView({controller:controller, mode:'c2', el:$('.c2')});
            var c3View = new SelectorView({controller:controller, mode:'c3', el:$('.c3')});
            var symbolView = new SelectorView({controller:controller, mode:'symbols', el:$('.symbols')});
            var actionView = new SelectorView({controller:controller, mode:'actions', el:$('.actions')});
            var selectorMap = this.selectorMap = {words:wordView, suggested:suggestView, vowels:vowelView, c1:c1View, c2:c2View, c3:c3View, symbols:symbolView, actions:actionView};

            var cubeView = this.cubeView = new CubeView({controller:controller});
            var footerView = this.footerView = new FooterView({controller:controller});
            var modeView = this.modeView = new ModeView({controller:controller});

            controller.addListener(Controller.events.BLINK,function(e){cubeView.center()});
            controller.addListener(Controller.events.LIFT,function(e){cubeView.moveUp()});
            controller.addListener(Controller.events.DROP,function(e){cubeView.moveDown()});
            controller.addListener(Controller.events.LOOK_LEFT,function(e){cubeView.moveLeft()});
            controller.addListener(Controller.events.LOOK_RIGHT,function(e){cubeView.moveRight()});
//            controller.addListener(Controller.events.LEFT,function(e){cubeView.moveLeft()});
//            controller.addListener(Controller.events.RIGHT,function(e){cubeView.moveRight()});
            controller.addListener(Controller.events.PUSH,function(e){cubeView.movePush()});
            controller.addListener(Controller.events.PULL,function(e){cubeView.movePull()});
            controller.addListener(Controller.events.ROTATE_FWD,function(e){cubeView.rotateFwd()});
            controller.addListener(Controller.events.ROTATE_BCK,function(e){cubeView.rotateBck()});
            controller.addListener(Controller.events.ROTATE_CW,function(e){cubeView.rotateCW()});
            controller.addListener(Controller.events.ROTATE_CCW,function(e){cubeView.rotateCCW()});
            controller.addListener(Controller.events.ROTATE_LEFT,function(e){cubeView.rotateLeft()});
            controller.addListener(Controller.events.ROTATE_RIGHT,function(e){cubeView.rotateRight()});
            controller.addListener(Controller.events.NEUTRAL,function(e){cubeView.center()});

            controller.addListener(Controller.events.NEXTWORD,function(e){wordView.wordOptions(e)});
            controller.addListener(Controller.events.SUGGEST,function(e){suggestView.wordOptions(e)});
//            controller.addListener(Controller.events.LIFT,function(e){ selectorMap[controller.getMode()].moveUp()});
//            controller.addListener(Controller.events.DROP,function(e){ selectorMap[controller.getMode()].moveDown()});
//            controller.addListener(Controller.events.PULL,function(e){ selectorMap[controller.getMode()].pick()});
            controller.addListener(Controller.events.BLINK,function(e){ selectorMap[controller.getMode()].pick()});

//            controller.addListener(Controller.events.MODE,function(e){ });

            controller.addListener(Controller.events.MODE,function(e){modeView.onSetMode(e)});
            controller.addListener(Controller.events.MODE,function(e){if (e.mode == 'words') footerView.nextWord()});
//            controller.addListener(Controller.events.MODE,function(e){selectorMap[controller.getMode()].setSelection(0)})
            controller.addListener(Controller.events.MODE,function(e){_.each(_.values(selectorMap), function(view){view.setSelection(0)})});
//            controller.addListener(Controller.events.LOOK_RIGHT,function(e){modeView.nextMode()});
//            controller.addListener(Controller.events.LOOK_LEFT,function(e){modeView.prevMode()});

            controller.addListener(Controller.events.PUSH, function(e){footerView.remove(); });
            controller.addListener(Controller.events.SELECT,function(e){footerView.add(e)});

//            controller.addListener(Controller.events.COPY, function(e){ footerView.copy(); })
            controller.addListener(Controller.events.CLEAR, function(e){ footerView.clear();  })
            controller.addListener(Controller.events.URL, function(e){ footerView.url(); })
            controller.addListener(Controller.events.SEARCH, function(e) { footerView.search() });
            controller.addListener(Controller.events.BACKSPACE, function(e){ footerView.remove();  })
            controller.addListener(Controller.events.SUBMIT, function(e){ footerView.submit(); footerView.say(); footerView.clear(); })
            controller.addListener(Controller.events.SAY, function(e){ footerView.say();  })

//            controller.addListener(Controller.events.LOOK_RIGHT,function(e){ footerView.add(' ')});
//            controller.addListener(Controller.events.BLINK,function(e){ footerView.say()});

            var delta = 8;
            controller.addListener(Controller.events.GYRO_DELTA,function(e){
//                console.log('gyro',e)

                if (e.x > delta) modeView.nextMode();
                else if (e.x < -delta) modeView.prevMode();
                if (e.y > delta) selectorMap[controller.getMode()].moveUp();
                else if (e.y < -delta) selectorMap[controller.getMode()].moveDown();
            });

            // what to do about clear, submitLine, etc?

            // defaults - yes and no
//            controller.addListener(Controller.events.PUSH,function(e){controller.say('Yes')});
//            controller.addListener(Controller.events.PULL,function(e){controller.say('No')});

            $("#container").html(cubeView.render().el).show();

            _.each(_.values(selectorMap), function(v){v.render()});
            controller.setMode('words');
        }
    });

    var router = new Router();
    router.main();
    return router;
});