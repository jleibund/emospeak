define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    var FavoriteModel = Backbone.Model.extend({
        urlRoot:'/favorite'
    });

    var FavoriteView = Backbone.View.extend({
        tagName:'ul',
        events: {
            'click .favorite' : 'onFavoriteClick',
            'click .favorite-remove' : 'onFavoriteRemove'
        },
        onFavoriteClick: function(e) {
            e.preventDefault();
            var li = $(e.currentTarget);
            var word = li.attr('data-word');
            var idx = li.attr('data-index');
            this.trigger(FavoriteView.SELECT,word);
        },
        onFavoriteRemove: function(e) {
            e.preventDefault();
            var li = $(e.currentTarget);
            var word = li.attr('data-word');
            var idx = li.attr('data-index');
            this.remove(word);
        },
        render:function(){

            this.delegateEvents();
            var html = '';
            var idx = 0;
            _.each(this.words, function(w){
                if (w && w != '' && w != ' '){
                    html += '<button class="btn btn-small btn-info favorite" type="button" data-word="'+w+'" data-index="'+idx+'">' +
                        '<strong>'+ w.toUpperCase()+'</strong><a href="#" data-word="'+w+
                        '" class="favorite-remove"><i class="icon-remove icon-white favorite-remove"></i></a></button> ';
                    idx++;
                }
            });
            this.$el.empty().append($(html));
            this.delegateEvents();

            return this;
        },
        initialize: function(){
            this.words = [];
            this.model = new FavoriteModel();
            this.fetch();
        },
        fetch: function(){
            var self = this;
            this.model.fetch({
                success:function(data){
                    self.onLoad(data.toJSON().payload)
                }
            });
        },
        save:function(word){
            var self = this;
            this.model.save({favorite:word}, {
                success: function(model, res){
                    self.fetch();
                }
            });
        },
        remove:function(word){
            var self = this;
            var m = new FavoriteModel({favorite:word});
            m.destroy({
                success: function(model, res){
                    self.fetch();
                }
            });
        },
        onLoad: function(data){
            this.words = data;
            this.render();
        }
    });
    FavoriteView.SELECT = 'favorite-select';

    return FavoriteView;
});