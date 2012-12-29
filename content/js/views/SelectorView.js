define([
    'jquery',
    'underscore',
    'backbone',
    'controller-proxy'
], function($, _, Backbone, Controller){

//    var Controller = require('./lib/controller').Controller;

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


            this.choices = [];
            var mode = this.controller.getMode();
            this.choices = this[mode];

            if (!mode) this.controller.setMode('word');

            var str = '', idx = 0;
//            var select = '<i class="icon-arrow-right">';
            var select = '*';
            var self = this;

            console.log('select:',this.selected, 'choices', this.choices);

            _.each(this.choices, function(item){
                var sel = (idx == self.selected)? select : '&nbsp;';
                str += '<tr wordid="'+idx+'" word="'+item+'"><td>'+sel+'</td><td>'+item+'</td></tr>';
                idx++;
            });

            this.table.empty().append($(str));

            return this;
        },
        initialize: function(){
            console.log('initialize',this.options);
            this.table = $('.table');
            this.selected = 0;
            this.items = [];
            this.controller = this.options.controller;
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

        },
        onSetMode:function(e){
            if (e.old) $('#'+ e.old).removeClass('btn-primary');
            $('#'+ e.mode).addClass('btn-primary');
            if (!this.choices){
                this.controller.nextWord('');
            }
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
            console.log('wordOptions',options)
            var items = [];
            var mode = this.controller.getMode();
            if (options){
                _.each(options, function(opt){
                    if (opt && opt.words){
                        var word = opt.words[opt.words.length-1];
                        items.push(word);
                    }
                });
            }
            this.word = items;
            if (mode =='word') this.selected = 0;
            this.render();
        },
        setSelection: function(idx){
            if (!idx) idx = 0;
            if (!this.choices || idx < 0 || idx > this.choices.length-1) return;

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
            if (this.choices && this.choices.length > this.selected)
                this.controller.emit(Controller.events.SELECT,this.choices[this.selected]);
        }
    });

    return SelectorView;
});