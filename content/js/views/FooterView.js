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
        init: function(controller){

            this.val = '';
            this.words = [];
            this.controller = controller;
            var output = this.output = $('#output');

            var self = this;
            output.keyup(function(){
//                console.log(output.val());

                var val = output.val();
                if (self.val != val){
                    controller.nextWord(val);
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
        },
        say: function(){
            this.controller.say(this.output.val());
        },
        add: function(text){
            // need to replace with something better and/or use unigram parsing here.
            var output = $('#output');
            console.log('add',text);
            if (text && text != ''){
                var mode = this.controller.getMode();
                var space = (mode =='word')? ' ':'';
                var val = output.val()+space+text;
                output.val(val);
                this.words = val.split(' ');

                console.log('words',this.words);

                this.controller.nextWord(val);
            }
        },
        remove: function(){
            // need to replace with something better and/or use unigram parsing here.
            var mode = this.controller.getMode();
            var output = $('#output');
            console.log('remove');
            if (mode == 'word' && this.words.length>0){
                this.words.pop();
                var val = this.words.join(' ');
                output.val(val);
                this.controller.nextWord(val);
            } else {
                output.val(output.val().substring(0,output.val().length-1));
            }
        }
    });

    return FooterView;
});