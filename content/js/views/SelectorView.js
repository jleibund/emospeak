define([
    'jquery',
    'underscore',
    'backbone',
    'controller-proxy'
], function($, _, Backbone, Controller){

//    var Controller = require('./lib/controller').Controller;

    var symbols = {
        1:'SPACE',
        2:':',
        3:'/',
        4:'@',
        5:'http://',
        6:'https://'
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

            this.choices = this[this.mode];
            var str = (this.mode =='words')? '': '<li class="nav-header">'+this.mode+'</li>', idx = 0;
            var self = this;
            if (this.mode == this.controller.getMode())
                console.log('select:',this.selected, 'choices', this.choices);

            _.each(this.choices, function(item){
//                var sel = (idx == self.selected)? select : '&nbsp;';
//                str += '<tr wordid="'+idx+'" word="'+item+'"><td>'+sel+'</td><td>'+item+'</td></tr>';
                var sel = (idx == self.selected  && self.controller.getMode() == self.mode)? 'class="active"' : '';
//                str += '<tr wordid="'+idx+'" word="'+item+'" '+sel+'><td>'+item+'</td></tr>';
//                str += '<li '+sel+' wordid="'+idx+'" word="'+item+'">'+item+'</li>';
                str += '<li wordid="'+idx+'" word="'+item+'" '+sel+'><a href="#">'+item+'</a></li>';
                idx++;
            });

            this.table.empty().append($(str));

            return this;
        },
        initialize: function(){

     //       this.listenTo(this.model, "change", this.render);

//            var id = this.options && this.options.element || 'table';
            this.mode = this.options && this.options.mode || 'words';
            this.table = $('.'+this.mode);
            console.log('table',this.table, 'mode', this.mode)
            this.selected = 0;
            this.controller = this.options.controller;
            this.c1=[];
            this.c2=[];
            this.c3=[];
            this.actions = actions;
            this.symbols = symbols;

            _.each(_.keys(letters),function(l){
                var prob = letters[l];
                if (prob >3) this.c1.push(l);
                else if (prob >1.5) this.c2.push(l);
                else this.c3.push(l);
            },this);

            var sortLetters = function(a,b){
                return letters[a] < letters[b];
            }

            this.c1 = this.c1.sort(sortLetters);
            this.c2 = this.c2.sort(sortLetters);
            this.c3 = this.c3.sort(sortLetters);

            this.vowels = _.keys(vowels).sort(sortLetters);
        },
        wordOptions:function(options){
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
            this.words = items;
   //         if (this.mode == mode){
                this.selected = 0;
                this.render();
   //         }
        },
        setSelection: function(idx){
            var choices = this.choices;
            if (!idx) idx = 0;
          // don't rotate around
          //  if (choices && idx > choices.length-1) idx=0;
            if (!choices || idx < 0) return;

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
            if (this.choices && this.choices.length > this.selected){
                var sel = this.choices[this.selected];

                // some exceptions..
                // replace space
                if (this.mode == 'symbols' && this.selected == 0) sel = ' ';

                this.controller.emit(Controller.events.SELECT,sel);
            }
        }
    });

    return SelectorView;
});