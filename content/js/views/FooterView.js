define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    var natural = require('natural'),
        tokenizer = new natural.WordTokenizer();

    var FooterView = Backbone.View.extend({
        loaded:false,
        render:function(){

            return this;
        },
        init: function(controller){

            this.val = '';
            this.words = [];
            this.controller = controller;
            var output = $('#output');

            output.keyup(function(){
//                console.log(output.val());

                var val = output.val();
                if (this.val != val){
                    controller.nextWord(val);
                    this.val = val;
                    this.words = tokenizer.tokenize(val);
                }
//                console.log('val',val,'options2',options);
            });

            $('#submit').click(function(){
                controller.submitLine(output.val());
                controller.say(output.val());
                output.val('');
            });

        },
        add: function(text){
            // need to replace with something better and/or use unigram parsing here.
            var output = $('#output');
            console.log('add',text);
            if (text){
                var val = output.val()+' '+text;
                output.val(val);
                this.words = tokenizer.tokenize(val);

                console.log('words',this.words);

                this.controller.nextWord(val);
            }
        },
        remove: function(){
            // need to replace with something better and/or use unigram parsing here.
            var output = $('#output');
            console.log('remove');
            if (this.words.length>0){
                this.words.pop();
                var val = this.words.join(' ');
                output.val(val);
                this.controller.nextWord(val);
            }

        }
    });

    return FooterView;
});