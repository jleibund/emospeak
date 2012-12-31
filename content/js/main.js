
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
    'backbone',
    'views/CubeView',
    'views/FooterView',
    'views/SelectorView',
    'controller-proxy'
], function($, Backbone, CubeView, FooterView, SelectorView, Controller) {


    function up(e) {return e.keyCode === 38}
    function down(e) {return e.keyCode === 40}
    function left(e) {return e.keyCode ===37}
    function right(e) {return e.keyCode ===39}
    function push(e) {return e.metaKey}
    function pull(e) {return e.altKey}
    function q(e) {return e.keyCode ===81}
    function w(e) {return e.keyCode ===87}
    function a(e) {return e.keyCode ===65}
    function s(e) {return e.keyCode ===83}
    function z(e) {return e.keyCode ===90}
    function x(e) {return e.keyCode ===88}


    var Router = Backbone.Router.extend({
        routes: {
            "*actions": "main"
        },
        main: function(){

        //    var conn = mongoose.createConnection("mongodb://localhost/emospeak");
            var controller = this.controller = new Controller();
            var selectorView = this.selectorView = new SelectorView({controller:controller});
            var cubeView = this.cubeView = new CubeView({controller:controller});
            var footerView = this.footerView = new FooterView({controller:controller});


            controller.addListener(Controller.events.BLINK,function(e){cubeView.center()});
//            controller.addListener(Controller.events.LOOK_LEFT,function(e){cubeView.moveLeft()});
//            controller.addListener(Controller.events.LOOK_RIGHT,function(e){cubeView.moveRight()});

//            controller.addListener(Controller.events.WINK_LEFT,function(e){cubeView.movePush()});
//            controller.addListener(Controller.events.WINK_RIGHT,function(e){cubeView.movePull()});

            controller.addListener(Controller.events.LIFT,function(e){cubeView.moveUp()});
            controller.addListener(Controller.events.DROP,function(e){cubeView.moveDown()});
            controller.addListener(Controller.events.LEFT,function(e){cubeView.moveLeft()});
            controller.addListener(Controller.events.RIGHT,function(e){cubeView.moveRight()});
            controller.addListener(Controller.events.PUSH,function(e){cubeView.movePush()});
            controller.addListener(Controller.events.PULL,function(e){cubeView.movePull()});
            controller.addListener(Controller.events.ROTATE_FWD,function(e){cubeView.rotateFwd()});
            controller.addListener(Controller.events.ROTATE_BCK,function(e){cubeView.rotateBck()});
            controller.addListener(Controller.events.ROTATE_CW,function(e){cubeView.rotateCW()});
            controller.addListener(Controller.events.ROTATE_CCW,function(e){cubeView.rotateCCW()});
            controller.addListener(Controller.events.ROTATE_LEFT,function(e){cubeView.rotateLeft()});
            controller.addListener(Controller.events.ROTATE_RIGHT,function(e){cubeView.rotateRight()});
            controller.addListener(Controller.events.NEUTRAL,function(e){cubeView.center()});

            controller.addListener(Controller.events.NEXTWORD,function(e){console.log('e',e), selectorView.wordOptions(e)});
            controller.addListener(Controller.events.LIFT,function(e){ selectorView.moveUp()});
            controller.addListener(Controller.events.DROP,function(e){ selectorView.moveDown()});
            controller.addListener(Controller.events.PUSH,function(e){ selectorView.pick()});

            controller.addListener(Controller.events.MODE,function(e){ selectorView.onSetMode(e)});
            controller.addListener(Controller.events.WINK_RIGHT,function(e){selectorView.nextMode()});
            controller.addListener(Controller.events.WINK_LEFT,function(e){selectorView.prevMode()});

            controller.addListener(Controller.events.PULL, function(e){footerView.remove()});
            controller.addListener(Controller.events.SELECT,function(e){footerView.add(e)});
            controller.addListener(Controller.events.LOOK_RIGHT,function(e){ footerView.add(' ')});
            controller.addListener(Controller.events.BLINK,function(e){ footerView.say()});

            // what to do about clear, submitLine, etc?

            // defaults - yes and no
//            controller.addListener(Controller.events.PUSH,function(e){controller.say('Yes')});
//            controller.addListener(Controller.events.PULL,function(e){controller.say('No')});


            $("#container").html(cubeView.render().el).show();


            // test harness
//            var throttle = false;
//            window.addEventListener('keydown', function(e){
//                console.log('pressed: ', e.keyCode);
//
//                e.throttle = throttle;
//
//                if (up(e)) {
//                    controller.emit(Controller.events.LIFT,e);
//                } else if (down(e)){
//                    controller.emit(Controller.events.DROP,e);
//                } else if (left(e)){
//                    controller.emit(Controller.events.LEFT,e);
//                } else if (right(e)){
//                    controller.emit(Controller.events.RIGHT,e);
//                } else if (push(e)){
//                    controller.emit(Controller.events.PUSH,e);
//                } else if (pull(e)){
//                    controller.emit(Controller.events.PULL,e);
//                } else if (q(e)){
//                    controller.emit(Controller.events.ROTATE_FWD,e);
//                } else if (w(e)){
//                    controller.emit(Controller.events.ROTATE_BCK,e);
//                } else if (s(e)){
//                    controller.emit(Controller.events.ROTATE_CW,e);
//                } else if (a(e)){
//                    controller.emit(Controller.events.ROTATE_CCW,e);
//                } else if (z(e)){
//                    controller.emit(Controller.events.ROTATE_LEFT,e);
//                } else if (x(e)){
//                    controller.emit(Controller.events.ROTATE_RIGHT,e);
//                }
//
//                throttle = true;
//            });
//            window.addEventListener('keyup', function(e){
//                controller.emit(Controller.events.NEUTRAL);
//                throttle = false;
//            });

        }
    });
//    Backbone.history.start();

    var router = new Router();
    router.main();
    return router;
});