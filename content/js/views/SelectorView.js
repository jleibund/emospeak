define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    var SelectorView = Backbone.View.extend({
        loaded:false,
        render:function(){

            this.table.empty();

            var str = ''
            _.each(this.items, function(item){
                str += '<tr><td>&nbsp;</td><td>'+item+'</td></tr>';
            });
            console.log('table',this.table,'str',str);

            this.table.append($(str));

//            self.$el.html(jl.render().$el);

            //<i class="icon-arrow-right">

            return this;
        },
        init: function(controller){
            this.table = $('.table');
            this.items = [];
        },
        wordOptions:function(options){
            var items = [];
            if (options){
                _.each(options, function(opt){
//                    console.log('opt',opt);
                    if (opt && opt.words){
                        var word = opt.words[opt.words.length-1];
//                        console.log('word',word);
                        items.push(word);
                    }
                });
            }
            this.items = items;
            console.log('items',this.items);

            this.render();
        }
    });

    return SelectorView;
});