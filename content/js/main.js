
requirejs.config({
    paths: {
        jquery: 'libs/jquery/jquery.min',
        underscore: 'libs/underscore/underscore.min',
        backbone: 'libs/backbone/backbone.min',
        three: 'libs/three/three.min',
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
    'views/SelectorView'
], function($, Backbone, CubeView, FooterView, SelectorView) {


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

    var mongoose = require('mongoose'),
        Controller = require('./lib/controller').Controller;


    var Router = Backbone.Router.extend({
        routes: {
            "*actions": "main"
        },
        main: function(){

        //    var conn = mongoose.createConnection("mongodb://localhost/emospeak");
            var controller = this.controller = new Controller({profile:'test', voice:'Ralph', rate:240});

            controller.addListener(Controller.LIFT,function(e){cubeView.moveUp()});
            controller.addListener(Controller.DROP,function(e){cubeView.moveDown()});
            controller.addListener(Controller.LEFT,function(e){cubeView.moveLeft()});
            controller.addListener(Controller.RIGHT,function(e){cubeView.moveRight()});
            controller.addListener(Controller.PUSH,function(e){cubeView.movePush()});
            controller.addListener(Controller.PULL,function(e){cubeView.movePull()});
            controller.addListener(Controller.ROTATE_FWD,function(e){cubeView.rotateFwd()});
            controller.addListener(Controller.ROTATE_BCK,function(e){cubeView.rotateBck()});
            controller.addListener(Controller.ROTATE_CW,function(e){cubeView.rotateCW()});
            controller.addListener(Controller.ROTATE_CCW,function(e){cubeView.rotateCCW()});
            controller.addListener(Controller.ROTATE_LEFT,function(e){cubeView.rotateLeft()});
            controller.addListener(Controller.ROTATE_RIGHT,function(e){cubeView.rotateRight()});
            controller.addListener(Controller.NEUTRAL,function(e){cubeView.center()});


            var cubeView = this.cubeView = new CubeView();
            cubeView.init();

            var footerView = this.footerView = new FooterView();
            footerView.init(controller);

            var selectorView = this.footerView = new SelectorView();
            selectorView.init(controller);
            selectorView.render();

            controller.addListener(Controller.NEXTWORD,function(e){selectorView.wordOptions(e)});
            controller.addListener(Controller.LIFT,function(e){selectorView.moveUp()});
            controller.addListener(Controller.DROP,function(e){selectorView.moveDown()});
            controller.addListener(Controller.RIGHT,function(e){selectorView.pick()});
            controller.addListener(Controller.LEFT,function(e){footerView.remove()});
            controller.addListener(Controller.SELECT,function(e){footerView.add(e)});

            // defaults - yes and no
            controller.addListener(Controller.PUSH,function(e){controller.say('Yes')});
            controller.addListener(Controller.PULL,function(e){controller.say('No')});


            $("#container").html(cubeView.render().el).show();

            controller.init(function(){
                console.log('inited!')
                controller.nextWord('');
            });

            // test harness
            window.addEventListener('keydown', function(e){
                console.log('pressed: ', e.keyCode);
                if (up(e)) {
                    controller.emit(Controller.LIFT);
                } else if (down(e)){
                    controller.emit(Controller.DROP);
                } else if (left(e)){
                    controller.emit(Controller.LEFT);
                } else if (right(e)){
                    controller.emit(Controller.RIGHT);
                } else if (push(e)){
                    controller.emit(Controller.PUSH);
                } else if (pull(e)){
                    controller.emit(Controller.PULL);
                } else if (q(e)){
                    controller.emit(Controller.ROTATE_FWD);
                } else if (w(e)){
                    controller.emit(Controller.ROTATE_BCK);
                } else if (a(e)){
                    controller.emit(Controller.ROTATE_CW);
                } else if (s(e)){
                    controller.emit(Controller.ROTATE_CCW);
                } else if (z(e)){
                    controller.emit(Controller.ROTATE_LEFT);
                } else if (x(e)){
                    controller.emit(Controller.ROTATE_RIGHT);
                }
            });
            window.addEventListener('keyup', function(e){
                controller.emit(Controller.NEUTRAL);
            });

        }
    });

    var router = new Router();
    router.main();
    return router;
});