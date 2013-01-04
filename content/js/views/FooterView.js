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
                    self.val = val;
                    self.words = val.split(' ');
                }
//                console.log('val',val,'options2',options);
            });

            $('#submit').click(function(){
                self.submit();
                self.say();
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
            if (text && text != ''){
                var mode = this.controller.getMode();
                var space = (mode =='words')? ' ':'';
                var val = output.val()+space+text;
                output.val(val);
                this.words = val.split(' ');

                console.log('words',this.words);

                this.controller.nextWord(val);
            }
        },
        nextWord: function(){
            var output = $('#output');
            this.controller.nextWord(output.val());
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
                this.controller.nextWord(val);
            } else {
                output.val(output.val().substring(0,output.val().length-1));
            }
            this.nextWord();
        }
    });

    return FooterView;
});