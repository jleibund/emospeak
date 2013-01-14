define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    var FooterView = Backbone.View.extend({
        loaded:false,
        tagName:'ul',
        events: {
            'click .kill-word' : 'onKillWord'
        },
        onKillWord: function(e) {
            e.preventDefault();
            var li = $(e.currentTarget);
            var word = li.attr('data-word');
            var idx = li.attr('data-index');
            console.log('clicked',word);
            this.words.splice(idx,1);
            this.render();
            this.nextWord();
        },
        render:function(){

            this.delegateEvents();
            var html = '';
            var idx = 0;
            _.each(this.words, function(w){
                if (w && w != '' && w != ' '){
                    html += '<li class="kill-word" data-word="'+w+'" data-index="'+idx+'"><a href="#" class="btn-info"><strong>'+ w.toUpperCase()+' &times;</strong></a></li>';
                    idx++;
                }
            });
            this.output.val(this.words.join(' '));
            this.$el.empty().append($(html));
            this.delegateEvents();

            return this;
        },
        initialize: function(){

            this.val = '';
            this.words = [];
            this.controller = this.options.controller;
            var output = this.output = $('#output');

            var self = this;
            output.keyup(function(e){
//                console.log(output.val());

                var val = output.val();
                self.words = val.split(' ');
                self.render();
                self.nextWord();
//                if (self.words && self.words.length);
//                    self.controller.suggest(self.words[self.words.length-1]);
            });

            $('.submit').click(function(){
                self.submit();
                self.say();
                self.clear();
            });
            $('.say').click(function(){
                self.say();
            });
            $('.clear').click(function(){
                self.clear();
            });
            $('.go').click(function(){
                self.url();
            });
            $('.search').click(function(){
                self.search();
            });

        },
        submit: function(){
            this.controller.submitLine(this.output.val());
        },
        clear: function(){
            this.words = [];
            this.nextWord()
            this.render();
        },
        url: function(){
            window.open(this.output.val(), '_blank');
            window.focus();
        },
        search: function(){
            window.open('http://www.google.com/search?q='+this.output.val(),'_blank');
            window.focus();
        },
        say: function(){
            this.controller.say(this.output.val());
        },
        add: function(text){
            // need to replace with something better and/or use unigram parsing here.
            var output = this.output;
            console.log('add',text);
            if (text && text != ''){
                this.words.push(text);
                console.log('words',this.words);
                this.nextWord();
            }
            this.render();
        },
        nextWord: function(){
//            var output = $('#output');

//            this.controller.nextWord(output.val());
            console.log(this.words.join(' '));
            this.controller.nextWord(this.words.join(' '));
        },
        remove: function(){
            // need to replace with something better and/or use unigram parsing here.
            this.words.pop();
            this.nextWord();
        },
        setSelection: function(idx){
            this.selected = idx;
            this.render();
        },
        moveUp: function(){
        },
        moveDown: function(){
        },
        moveLeft: function(){
        },
        moveRight: function(){
        },
        pick: function(){

        }
    });
    FooterView.SELECT = 'footer-select';
    FooterView.MOVEUP = 'footer-moveup';
    FooterView.MOVEDOWN = 'footer-movedown';
    FooterView.MOVELEFT = 'footer-moveleft';
    FooterView.MOVERIGHT = 'footer-moveright';

    return FooterView;
});