define([
    'jquery',
    'underscore',
    'backbone',
    'views/OptionsView',
    'event-type'
], function($, _, Backbone, OptionsView, EventType) {

    var Router = Backbone.Router.extend({
        routes: {
            "*actions": "main"
        },
        main: function(){

            var optionsView = this.optionsView  = new OptionsView({el:$('.options')});
        }
    });

    var router = new Router();
    router.main();
    return router;

});