define([
    'jquery',
    'underscore',
    'backbone',
    'event-type'
], function($, _, Backbone, EventType){

    var SelectorView = Backbone.View.extend({
        loaded:false,
        tagName:'ul',
        events:{
            'click a.choice':'onClick'
        },
        onClick:function(e){
            e.preventDefault();
            var wordid = $(e.currentTarget).parent().attr('wordid')
            this.setSelection(wordid);
            this.pick();
        },
        render:function(){

//            this.choices = this[this.mode];
            var str = '';
            var self = this;

            var idx = 0;
            _.each(this.words, function(item){
                if (item){
                    var sel = (idx == self.selected)? 'class="active"' : '';
                    str += '<li wordid="'+idx+'" word="'+item+'" '+sel+'><a class="choice">'+item.toUpperCase()+'</a></li>';
                    idx++;
                }
            });

            this.$el.empty().append($(str));
            this.delegateEvents();

            // setup the copy action
//            if (this.mode =='actions'){
//                $('ul.actions').find('li[wordid="3"]').find('a.choice').zclip({
//                    path:'js/libs/zclip/ZeroClipboard.swf',
//                    setCSSEffects:false,
//                    copy:function(){return $('input#output').val();}
//                });
//            }

            return this;
        },
        initialize: function(){
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
            this.words = items;
            this.render();
        },
        setSelection: function(idx){
//            if (!idx) idx = 0;
          // don't rotate around
          //  if (choices && idx > choices.length-1) idx=0;
//            if (!this.words || idx < 0) return;

            this.selected = idx;
            this.render();
        },
        setFirst: function(){
            if (this.words && this.words.length)
                this.setSelection(0);
        },
        setLast:function(){
            if (this.words && this.words.length)
                this.setSelection(this.words.length);
        },
        moveUp: function(){
            if (!this.selected){
                this.trigger(SelectorView.MOVEUP);
                this.setSelection(-1);
//                this.selected = 1;
            } else if (this.selected == -1  && this.words && this.words.length){
                this.setSelection(this.words.length-1);
//                this.selected = this.words.length;
            } else {
                this.setSelection(this.selected-1);
            }
        },
        moveDown: function(){
            if (this.words && this.words.length && this.selected == this.words.length-1){
                this.trigger(SelectorView.MOVEDOWN);
                this.setSelection(-1);
            } else {
                this.setSelection(this.selected+1);
            }
        },
        moveLeft: function(){
            this.trigger(SelectorView.MOVELEFT);
        },
        moveRight: function(){
            this.trigger(SelectorView.MOVERIGHT);
        },
        pick: function(){
            if (this.words && _.size(this.words) > this.selected){
                var sel = this.words[this.selected];

                this.trigger(SelectorView.SELECT, sel);
            }
        }
    });
    SelectorView.SELECT = 'selector-select';
    SelectorView.MOVEUP = 'selector-moveup';
    SelectorView.MOVEDOWN = 'selector-movedown';
    SelectorView.MOVELEFT = 'selector-moveleft';
    SelectorView.MOVERIGHT = 'selector-moveright';

    return SelectorView;
});