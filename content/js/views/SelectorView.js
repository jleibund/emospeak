define([
    'jquery',
    'underscore',
    'backbone',
    'controller-proxy'
], function($, _, Backbone, Controller){

    var symbols = {
        0:'SPACE',
        1:'http://',
        2:'.',
        3:':',
        4:'/',
        5:'@',
        6:'https://'
    };

    var actions = {
        0:'Submit',
        1:'Backspace',
        2:'Clear',
        3:'Copy',
        4:'Say',
        5:'Go (URL)',
        6:'Search'
    };

    var actionMap = {
        0: Controller.events.SUBMIT,
        1: Controller.events.BACKSPACE,
        2: Controller.events.CLEAR,
        3: Controller.events.COPY,
        4: Controller.events.SAY,
        5: Controller.events.URL,
        6: Controller.events.SEARCH
    }

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
        tagName:'ul',
        events:{
            'click a.choice':'onClick'
        },
        onClick:function(e){
            e.preventDefault();
            if (this.mode != 'actions')
                this.controller.setMode(this.mode);
            var wordid = $(e.currentTarget).parent().attr('wordid')
            this.setSelection(wordid);
            this.pick();
        },
        render:function(){

            this.choices = this[this.mode];
            var str = (this.mode =='words')? '': '<li class="nav-header">'+this.mode+'</li>';
            var self = this;
//            if (this.mode == this.controller.getMode())
//                console.log('select:',this.selected, 'choices', this.choices);

            var idx = 0;
            _.each(this.choices, function(item){
                var sel = (idx == self.selected  && self.controller.getMode() == self.mode)? 'class="active"' : '';
                str += '<li wordid="'+idx+'" word="'+item+'" '+sel+'><a class="choice">'+item+'</a></li>';
                idx++;
            });

            this.$el.empty().append($(str));
            this.delegateEvents();

            // setup the copy action
            if (this.mode =='actions'){
                $('ul.actions').find('li[wordid="3"]').find('a.choice').zclip({
                    path:'js/libs/zclip/ZeroClipboard.swf',
                    setCSSEffects:false,
                    copy:function(){return $('input#output').val();}
                });
            }

            return this;
        },
        initialize: function(){
            this.mode = this.options && this.options.mode;

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
            if (this.choices && _.size(this.choices) > this.selected){
                var sel = this.choices[this.selected];


                // some exceptions..
                // replace space
                if (this.mode == 'symbols' && this.selected == 0) sel = ' ';


                if (this.mode != 'actions'){
                    this.controller.emit(Controller.events.SELECT,sel);
                } else {
                    console.log('action', actionMap[this.selected]);
                    this.controller.emit(actionMap[this.selected]);
                }
            }
        }
    });

    return SelectorView;
});