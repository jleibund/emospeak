define([
    'jquery',
    'underscore',
    'backbone',
    'controller-proxy'
], function($, _, Backbone, Controller){

    var ModeView = Backbone.View.extend({
        loaded:false,
        render:function(){
            return this;
        },
        initialize: function(){
            this.controller = this.options.controller;

            // setup mode button clicks
            var self = this;
            this.modeOrder = [];
            $('.btn-group > .btn-mini').each(function(){
                var id = $(this).attr('id');
                $(this).click(function(){
                    self.controller.setMode(id);
                });
                self.modeOrder.push(id);
            });


        },
        onSetMode:function(e){
            if (e.old) $('#'+ e.old).removeClass('btn-primary');
            $('#'+ e.mode).addClass('btn-primary');
//            if (!this.choices){
//                this.controller.nextWord('');
//            }
            this.selected = 0;
            this.render();
        },
        nextMode:function(){
            var cur = this.controller.getMode();
            var idx = _.indexOf(this.modeOrder, cur);
            if (idx < this.modeOrder.length-1) this.controller.setMode(this.modeOrder[idx+1]);
        },
        prevMode:function(){
            var cur = this.controller.getMode();
            var idx = _.indexOf(this.modeOrder, cur);
            if (idx > 0) this.controller.setMode(this.modeOrder[idx-1]);
        }
    });

    return ModeView;

});