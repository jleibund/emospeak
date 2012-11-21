
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
    'views/CubeView'
], function($, Backbone, CubeView) {

    var fs   = require('fs'),
        path = require('path'),
        cwd  = process.cwd();

    fs.readdirSync(cwd).forEach(function(child){
        console.log('child', path.resolve(cwd, child));
    });

    addEventListener('app-ready', function(e){

//        window.dispatchEvent(new Event('app-done'));
    });

    var Router = Backbone.Router.extend({
        routes: {
            "*actions": "main"
        },
        main: function(){


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