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
                    var style = (this.selected && this.selected == idx)? 'btn-primary' : 'btn-info';
                    html += '<button class="btn btn-small '+style+' favorite" type="button" data-word="'+w+'" data-index="'+idx+'">' +
                        '<strong>'+ w.toUpperCase()+'</strong><a href="#" data-word="'+w+
                        '" class="favorite-remove"><i class="icon-remove icon-white favorite-remove"></i></a></button> ';
                    idx++;
                }
            });
            this.$el.empty().append($(html));
            this.delegateEvents();
            this.favorites = $('.favorite');

            return this;
        },
        initialize: function(){
            this.words = [];
            this.model = new FavoriteModel();
//            this.setNavMap();
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
        setSelection: function(idx){
            this.selection = idx;
            if (this.favorites) this.favorites.removeClass('btn-primary').addClass('btn-info');
            if (idx != null) {
                var sel = $('button[data-index="'+idx+'"]');
                if (sel)
                    sel.removeClass('btn-info').addClass('btn-primary');
            }
        },
        setNavMap :function(){
            var navMap = this.navMap = {};
            var up = null;
            if (this.words && this.words.length){
                for (var i=0;i<this.words.length;i++){
                    navMap[i] = {up:null,down:null,left:(i==0)?null:i-1, right: (i==this.words.length-1)?null:i+1}
                }
            }
        },
        moveUp:function(){
            this.move('up', FavoriteView.MOVEUP);
        },
        moveDown:function(){
            this.move('down', FavoriteView.MOVEDOWN);
        },
        moveLeft:function(){
            this.move('left', FavoriteView.MOVELEFT);
        },
        moveRight:function(){
            this.move('right', FavoriteView.MOVERIGHT);
        },
        move: function(dir,evt){
            if (this.selection != -1 && this.navMap){
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
            this.setNavMap();
            this.render();
        },
        pick:function(){
            var curEl = $('.btn-primary');
            if (curEl) curEl.trigger('click');
        }
    });
    FavoriteView.SELECT = 'favorite-select';
    FavoriteView.MOVEUP = 'favorite-moveup';
    FavoriteView.MOVEDOWN = 'favorite-movedown';
    FavoriteView.MOVELEFT = 'favorite-moveleft';
    FavoriteView.MOVERIGHT = 'favorite-moveright';

    return FavoriteView;
});