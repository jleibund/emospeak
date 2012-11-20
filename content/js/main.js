//var requirejs = require('requirejs');
//
//requirejs.config({
//    //Pass the top-level main.js/index.js require
//    //function to requirejs so that node modules
//    //are loaded relative to the top-level JS file.
//    nodeRequire: require,
//    paths: {
//        jquery: 'libs/jquery/jquery.min',
//        underscore: 'libs/underscore/underscore.min',
//        backbone: 'libs/backbone/backbone.min',
//        templates: '../templates'
//    }
//});
//
//requirejs([
//    // Load our app module and pass it to our definition function
//    './app'
//], function(App){
//    // The "app" dependency is passed in as "App"
//    // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
//    App.initialize();
//});


requirejs.config({
    paths: {
        jquery: 'libs/jquery/jquery.min',
        underscore: 'libs/underscore/underscore.min',
        backbone: 'libs/backbone/backbone.min',
        socket: 'socket.io',
        three: 'libs/three/three.min',
        stats: 'libs/three/stats.min',
        detector: 'libs/three/Detector',
        templates: '../templates',
        'backbone.localStorage': 'lib/backbone.localStorage'
    },
    shim: {
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backbone.localStorage': {
            deps: ['backbone'],
            exports: 'Backbone'
        },
        socket: {
            exports: 'io'
        }
    }
});

requirejs([
    'jquery',
    'backbone',
    'socket',
    'views/CubeView'
], function($, Backbone, io, CubeView) {

    var Router = Backbone.Router.extend({
        routes: {
            "*actions": "main"
        },
        main: function(){
//            var tasks = new Todo.Collection();
//            var view = new MasterView({collection: tasks});
//            tasks.fetch({
//                success: function(tasks){
//                    $("#container").html(view.render().el).show();
//                }
//            });

            // setup an event source
//            var source = this.source = new EventSource('/stream');
//
//
//            source.addEventListener('open', function(e){console.log('connection open')},false);
//            source.addEventListener('error', function(e){if (e.readyState == EventSource.CLOSED) console.log('connection closed')},false);
//            source.addEventListener('message',function(e){
//                console.log(e);
//            }, false);

//            var jsonSocket = new WebSocket('ws://127.0.0.1:7379/.json');
//            console.log('jsonsocket',jsonSocket);
//            jsonSocket.onmessage = function(e){
//                console.log('received', e);
//            }

//            var socket = io.connect('http://localhost');
//
//            socket.on('connect', function () {
//                socket.emit('set nickname', prompt('What is your nickname?'));
//                socket.on('ready', function () {
//                    console.log('Connected !');
//                    socket.emit('msg', prompt('What is your message?'));
//                });
//            });

            var cubeView = this.cubeView = new CubeView();
            console.log('cubeview',cubeView);
            cubeView.init();
//            cubeView.animate();
            $("#container").html(cubeView.render().el).show();
        }
    });



    var router = new Router();
    router.main();
    return router;
});