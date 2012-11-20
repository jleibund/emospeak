if (typeof define !== 'function') { var define = require('amdefine')(module) }
// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'views/CubeView'
], function($, _, Backbone, CubeView) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            // Define some URL routes
//            'projects': 'showProjects',
//            'users': 'showContributors',

            // Default
            '*actions': 'defaultAction'
        }
    });

    var initialize = function(){

        var app_router = new AppRouter;

        app_router.on('route:defaultAction', function (actions) {

            // We have no matching route, lets display the home page
            var cubeView = new CubeView();
            cubeView.init();
            cubeView.animate();

            // unlike the above, we don't call render on this view
            // as it will handle the render call internally after it
            // loads data
//            var footerView = new FooterView();

        });

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});