define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    var Controller = require('./lib/controller').Controller;

    var letters = {
        a:8.167,
        b:1.492,
        c:2.782,
        d:4.253,
        e:12.702,
        f:2.228,
        g:2.015,
        h:6.094,
        i:6.966,
        j:0.153,
        k:0.772,
        l:4.025,
        m:2.406,
        n:6.749,
        o:7.507,
        p:1.929,
        q:0.095,
        r:5.987,
        s:6.327,
        t:9.056,
        u:2.758,
        v:0.978,
        w:2.360,
        x:0.150,
        y:1.974,
        z:0.074
    };


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
            this.mode = 'word';
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