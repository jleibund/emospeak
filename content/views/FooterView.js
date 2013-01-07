define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    var FooterView = Backbone.View.extend({
        loaded:false,
        render:function(){

            return this;
        },
        initialize: function(){

            this.val = '';
            this.words = [];
            this.controller = this.options.controller;
            var output = this.output = $('#output');

            var self = this;
            output.keyup(function(){
//                console.log(output.val());

                var val = output.val();
                if (self.val != val){
                    self.controller.nextWord(val);
                    var last = val.split(' ');
                    self.controller.suggest(last && last[last.length-1]);
                    self.val = val;
                    self.words = val.split(' ');
                }
//                console.log('val',val,'options2',options);
            });

            $('#submit').click(function(){
                self.submit();
                self.say();
                self.clear();
            });

        },
        submit: function(){
            this.controller.submitLine(this.output.val());
        },
        clear: function(){
            this.output.val('');
            this.nextWord('')
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
            var mode = this.controller.getMode();
            if (text && text != ''){
                var space = (mode =='words' || mode == 'suggested')? ' ':'';
                var val = output.val()+space+text;
                var suggested = (mode == 'suggested');
                if (suggested){
                    this.words.pop();
                    val = this.words.join(' ')+' '+text;
                }
                output.val(val);
                this.words = val.split(' ');
                console.log('words',this.words);
                this.nextWord();
            }
            this.prevMode = mode;
        },
        nextWord: function(){
            var output = $('#output');
            this.controller.nextWord(output.val());
            this.controller.suggest(this.words && this.words[this.words.length-1]);
        },
        remove: function(){
            // need to replace with something better and/or use unigram parsing here.
            var mode = this.controller.getMode();
            var output = $('#output');
            console.log('remove');
            if (mode == 'words' && this.words.length>0){
                this.words.pop();
                var val = this.words.join(' ');
                output.val(val);
//                this.nextWord();
//                this.controller.nextWord(val);
            } else {
                output.val(output.val().substring(0,output.val().length-1));
            }
            this.nextWord();
        }
    });

    return FooterView;
});