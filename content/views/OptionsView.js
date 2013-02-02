define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/optionsTemplate.html',
    'event-type'
], function($, _, Backbone, template, EventType){

    var OptionsModel = Backbone.Model.extend({
        urlRoot:'/options',
        defaults: {profile:'', voice:'Ralph',rate:240, throttle:2000, deltaX:9, deltaY:15, action:EventType.BLINK},
        parse:function (resp) {
            if (resp.status == 0) {
                return resp.payload;
            } else {
                $('.failed').show();
                console.log('error', resp, this);
            }
        }
    });

    var fields = ['profile','voice','throttle','rate','deltaX', 'deltaY', 'action'];
    var numeric = ['throttle','rate','deltaX', 'deltaY'];

    var OptionsView = Backbone.View.extend({
        tagName:'div',
        events: {
            'click .save' : 'onSaveClick',
            'click .close' : 'onDismissAlert'
        },
        onDismissAlert: function(e){
            e.preventDefault();
            this.saveAlert.hide();
            this.failAlert.hide();
        },
        onSaveClick: function(e) {
            e.preventDefault();

            _.each(fields, function(f){
                var val = $('.'+f).val();
                if (_.contains(numeric,f)) val -= 0;
                this.model.set(f,val);
            },this);

            this.model.save({}, {
                success: _.bind(function(model, res){
                    this.saveAlert.show();
                    this.trigger(OptionsView.SAVE,this.options);
                },this),
                failure:_.bind(function(model,res){
                    this.failAlert.show();
                },this)
            });
        },
        render: function() {

            this.$el.html(this.template(this.model.attributes));
            $('select.voice>option[value="'+this.model.get('voice')+'"]').attr('selected', true);

//            if (!this.saveAlert){
//            }
            this.saveAlert = $('.saved');
            this.failAlert = $('.failed');
            this.action = $('.action');
            this.saveAlert.hide();
            this.failAlert.hide();

            var html = '';
            _.each(this.actionOptions, function(o){
                var name = o.substring(o.lastIndexOf('/')+1);
                html+='<option value="'+o+'">'+name+'</option>';
            });
            this.action.html(html);
            $('select.action>option[value="'+this.model.get('action')+'"]').attr('selected', true);

            return this;
        },
        initialize: function(){
            this.template = _.template(template)
            this.model = new OptionsModel();
            this.listenTo(this.model, 'change', this.render);

            this.listenTo(this.model, 'error', function(){
                if (this.failAlert) this.failAlert.show();
            });
            this.actionOptions = _.filter(EventType, function(t){
                return (~t.indexOf('/EXP'))
            }).sort();
            this.model.fetch();
            this.render();
        }
    });
    OptionsView.SAVE = 'options-save';

    return OptionsView;
});