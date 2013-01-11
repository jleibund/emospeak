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
//            if (this.mode == this.controller.getMode())
//                console.log('select:',this.selected, 'choices', this.choices);

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
            this.selected = 0;
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
            this.selected = 0;
            this.render();
        },
        setSelection: function(idx){
            if (!idx) idx = 0;
          // don't rotate around
          //  if (choices && idx > choices.length-1) idx=0;
            if (!this.words || idx < 0) return;

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
            if (this.words && _.size(this.words) > this.selected){
                var sel = this.words[this.selected];

                this.trigger(SelectorView.SELECT, sel);
            }
        }
    });
    SelectorView.SELECT = 'selector-select';

    return SelectorView;
});