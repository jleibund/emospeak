define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    var actions = ['say','go','search','submit','clear'];

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
                _.throttle(self.nextWord(),500);
//                if (self.words && self.words.length);
//                    self.controller.suggest(self.words[self.words.length-1]);
            });
            this.submitButton = $('.submit');
            this.sayButton = $('.say');
            this.goButton = $('.go');
            this.clearButton = $('.clear');
            this.searchButton = $('.search');

            this.submitButton.click(function(){
                self.submit();
                self.say();
                self.clear();
            });
            this.sayButton.click(function(){
                self.say();
            });
            this.clearButton.click(function(){
                self.clear();
            });
            this.goButton.click(function(){
                self.url();
            });
            this.searchButton.click(function(){
                self.search();
            });
            this.setNavMap();
            this.render();
        },
        submit: function(){
            this.controller.submitLine(this.output.val());
        },
        clear: function(){
            this.words = [];
            this.setNavMap();
            this.nextWord();
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
            this.setNavMap();
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
            this.setNavMap();
            this.nextWord();
        },
        setSelection: function(idx){
            this.selection = idx;
            if (this.wordElements) this.wordElements.removeClass('btn-primary').addClass('btn-info');
            this.resetActions();
            if (idx != null) {
                if (_.contains(actions,idx)){
                    $('.'+idx).removeClass('btn-success').removeClass('btn-danger').addClass('btn-primary');
                } else {
                    $('button[data-index="'+idx+'"]').removeClass('btn-info').addClass('btn-primary');
                }
            }
        },
        setNavMap :function(){
            var navMap = this.navMap = {};
            var up = null;
            if (this.words && this.words.length){
                for (var i=0;i<this.words.length;i++){
                    navMap[i] = {up:null,down:'say',left:(i==0)?null:i-1, right: (i==this.words.length-1)?null:i+1}
                }
                up = 0;
            }
            // add in the buttons
            navMap['say'] = {up:up, down:null, left:null, right:'submit'};
            navMap['submit'] = {up:up, down:null, left:'say', right:'go'};
            navMap['go'] = {up:up, down:null, left:'submit', right:'search'};
            navMap['search'] = {up:up, down:null, left:'go', right:'clear'};
            navMap['clear'] = {up:up, down:null, left:'search', right:null};
            this.wordElements = $('.kill-word');
        },
        moveUp:function(){
            this.move('up', FooterView.MOVEUP);
        },
        moveDown:function(){
            this.move('down', FooterView.MOVEDOWN);
        },
        moveLeft:function(){
            this.move('left', FooterView.MOVELEFT);
        },
        moveRight:function(){
            this.move('right', FooterView.MOVERIGHT);
        },
        move: function(dir,evt){
            if (this.selection){
                var nav = this.navMap[this.selection];
                var next = nav && nav[dir];
                if (!next){
                    this.setSelection(this.selection);
                    this.trigger(evt,this.selection);
                } else {
                    this.setSelection(next);
                }
            }
        },
        resetActions: function(){
            this.sayButton.removeClass('btn-primary').addClass('btn-success');
            this.goButton.removeClass('btn-primary').addClass('btn-success');
            this.submitButton.removeClass('btn-primary').addClass('btn-success');
            this.searchButton.removeClass('btn-primary').addClass('btn-success');
            this.clearButton.removeClass('btn-primary').addClass('btn-danger');
        },
        pick:function(){
            var curEl = $('.btn-primary');
            if (curEl) curEl.trigger('click');
        }
    });
    FooterView.SELECT = 'footer-select';
    FooterView.MOVEUP = 'footer-moveup';
    FooterView.MOVEDOWN = 'footer-movedown';
    FooterView.MOVELEFT = 'footer-moveleft';
    FooterView.MOVERIGHT = 'footer-moveright';

    return FooterView;
});