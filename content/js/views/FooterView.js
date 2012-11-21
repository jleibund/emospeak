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


            var output = $('#output');

            output.bind('keypress',function(){
//                console.log(output.val());

                var val = output.val();
                var options = controller.nextWord(val);
//                console.log('val',val,'options2',options);
            });

            $('#submit').click(function(){
                controller.submitLine(output.val());
                output.val('');
            });

        }
    });

    return FooterView;
});