define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    var Controller = require('./lib/controller').Controller;

    var symbols = {
        1:':',
        2:'/',
        3:'@',
        4:'http://',
        5:'https://'
    };

    var actions = {
        1:'Submit',
        2:'Copy',
        3:'Repeat'
    };

    var letters = {
        b:1.492,
        c:2.782,
        d:4.253,
        f:2.228,
        g:2.015,
        h:6.094,
        j:0.153,
        k:0.772,
        l:4.025,
        m:2.406,
        n:6.749,
        p:1.929,
        q:0.095,
        r:5.987,
        s:6.327,
        t:9.056,
        v:0.978,
        w:2.360,
        x:0.150,
        y:1.974,
        z:0.074
    };

    var vowels = {
        a:8.167,
        e:12.702,
        i:6.966,
        o:7.507,
        u:2.758
    };


    var SelectorView = Backbone.View.extend({
        loaded:false,
        render:function(){

            this.table.empty();

            this.options = [];
            var mode = this.controller.getMode();
            this.options = this[mode];
//            if (mode == 'word'){
//                this.options = this.items;
//            } else if (mode == 'vowels'){
//                this.options = this.vowels;
//            } else if (mode == 'c1'){
//                this.options = this.c1;
//            } else {
//                this.options = this.letters;
//            }

            var str = '', idx = 0;
            var select = '<i class="icon-arrow-right">';
            _.each(this.options, function(item){
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
            this.c1=[];
            this.c2=[];
            this.c3=[];
            this.actions = actions;

            _.each(_.keys(letters),function(l){
                var prob = letters[l];
                if (prob >3) this.c1.push(l);
                else if (prob >1) this.c2.push(l);
                else this.c3.push(l);
            },this);

            var sortLetters = function(a,b){
                return letters[a] < letters[b];
            }

            this.c1 = this.c1.sort(sortLetters);
            this.c2 = this.c2.sort(sortLetters);
            this.c3 = this.c3.sort(sortLetters);

            this.vowels = _.keys(vowels).sort(sortLetters);

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

            this.controller.setMode('word');
        },
        onSetMode:function(e){
            $('#'+ e.old).removeClass('btn-primary');
            $('#'+ e.mode).addClass('btn-primary');
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
        },
        wordOptions:function(options){
            var items = [];
            if (options){
                _.each(options, function(opt){
                    if (opt && opt.words){
                        var word = opt.words[opt.words.length-1];
                        items.push(word);
                    }
                });
            }
            this.items = items;
            console.log('items',this.items);

            this.render();
        },
        setSelection: function(idx){
            if (!idx) idx = 0;
            if (!this.options || idx < 0 || idx > this.options.length-1) return;

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
            if (this.options && this.options.length > 0)
                this.controller.emit(Controller.SELECT,this.options[this.selected]);
        }
    });

    return SelectorView;
});