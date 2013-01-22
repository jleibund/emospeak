define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    var OptionsModel = Backbone.Model.extend({
        urlRoot:'/options'
    });

    var OptionsView = Backbone.View.extend({
        tagName:'div',
        events: {
            'click .save' : 'onSaveClick'
        },
        onSaveClick: function(e) {
            e.preventDefault();
            console.log('saveClick',this.profileFile.val());

//            var button = $(e.currentTarget);
            this.options.profile = this.profileFile.val();
            this.save();
            this.trigger(OptionsView.SAVE,this.options);
        },
        render:function(){
            this.delegateEvents();
            this.profileFile.val(this.options.profile);
            return this;
        },
        initialize: function(){
            this.options = {};
            this.profileFile = $('.profile');
//            this.saveBtn = $('.save');
            console.log('initialize');
            this.fetch();
        },
        fetch: function(){
            var self = this;
            var m = new OptionsModel();
            console.log('fetch');

            m.fetch({
                success:function(data){
                    self.onLoad(data.toJSON().payload)
                }
            });
        },
        save:function(){
            console.log('save');
            var self = this;
            var m = new OptionsModel();
            var prof = this.options.profile;
            if (prof && prof.length && prof != ''){
                m.save({profile:this.options.profile},{
                    success: function(data){
                        self.onLoad(data.toJSON().payload);
                    }
                });
            }
        },
        onLoad: function(data){
            console.log('load',data);

            this.options = data;
            this.render();
        }
    });
    OptionsView.SAVE = 'options-save';

    return OptionsView;
});