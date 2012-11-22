define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    var Controller = require('./lib/controller').Controller;

    var SelectorView = Backbone.View.extend({
        loaded:false,
        render:function(){

            this.table.empty();

            var str = '', idx = 0;
            var select = '<i class="icon-arrow-right">';
            _.each(this.items, function(item){
                var sel = (idx == this.selected)? select : '&nbsp';
                str += '<tr wordid="'+idx+'" word="'+item+'"><td>'+sel+'</td><td>'+item+'</td></tr>';
                idx++;
            },this);

            this.table.append($(str));

            return this;
        },
        init: function(controller){
            this.table = $('.table');
            this.items = [];
            this.controller = controller;
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

            this.setSelection(0);
            this.render();
        },
        setSelection: function(idx){
            if (!idx) idx = 0;
            if (idx < 0 || idx > this.items.length-1) return;

            this.selected = idx;
            this.render();
        },
        moveUp: function(){
            this.setSelection(this.selected-1);
        },
        moveDown: function(){
            this.setSelection(this.selected+1);
        },
        pick: function(){
//            console.log('pick', this.items[this.selected])
            if (this.items && this.items.length > 0)
                this.controller.emit(Controller.SELECT,this.items[this.selected]);
        }
    });

    return SelectorView;
});