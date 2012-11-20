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
        }
    }
});

requirejs([
    'jquery',
    'backbone',
    'views/CubeView'
], function($, Backbone, CubeView) {

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
            var cubeView = new CubeView();
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