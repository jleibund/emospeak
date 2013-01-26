define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/optionsTemplate.html'
], function($, _, Backbone, template){

    var OptionsModel = Backbone.Model.extend({
        urlRoot:'/options',
        parse:function (resp) {
//            this.limit = resp.limit;
//            this.skip = resp.skip;
//            this.count = resp.count;
            if (resp.status == 0) {
                return resp.payload;
            } else {
                $('.failed').show();
                console.log('error', resp, this);
            }
        }
    });

    var fields = ['profile','voice','throttle','rate','deltaX', 'deltaY'];
    var numeric = ['throttle','rate','deltaX', 'deltaY'];

    var OptionsView = Backbone.View.extend({
        tagName:'div',
        events: {
            'click .save' : 'onSaveClick'
        },
      //  template: _.template(template),
        onSaveClick: function(e) {
            e.preventDefault();

            _.each(fields, function(f){
                var val = $('.'+f).val();
                if (_.contains(numeric,f)) val -= 0;
                this.model.set(f,val);
            },this);

            this.model.save();
            this.saveAlert.show();
//            alert('Options saved!');
            this.trigger(OptionsView.SAVE,this.options);
        },
        render: function() {
            if (!this.saveAlert){
                this.saveAlert = $('.saved');
                this.failAlert = $('.failed');
//                this.saveAlert.hide();
//                this.failAlert.hide();
//                $('.alert').alert('close');
                this.listenTo(this.model, 'error', function(){this.failAlert.show()});
            }

            this.$el.html(this.template(this.model.attributes));
            $('select>option[value="'+this.model.get('voice')+'"]').attr('selected', true);
            return this;
        },
        initialize: function(){
            this.template = _.template(template)
            this.model = new OptionsModel();
            this.listenTo(this.model, 'change', this.render);
//            this.listenTo(this.model, 'save', function(){alert('Options saved!')});
//            this.sync('read',this.model);
            this.model.fetch();
        }
    });
    OptionsView.SAVE = 'options-save';

    return OptionsView;
});