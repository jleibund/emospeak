define([
    'jquery',
    'backbone'
], function($, Backbone) {

    var letters = {
        b:1.492,
        c:2.782,
        d:4.253,
        f:2.228,
        g:2.015,
        h:6.094,
        j:0.153,
        k:0.772,
        l:4.025,
        m:2.406,
        n:6.749,
        p:1.929,
        q:0.095,
        r:5.987,
        s:6.327,
        t:9.056,
        v:0.978,
        w:2.360,
        x:0.150,
        y:1.974,
        z:0.074,
        a:8.167,
        e:12.702,
        i:6.966,
        o:7.507,
        u:2.758,
        1:2,
        2:2,
        3:2,
        4:2,
        5:2,
        6:2,
        7:2,
        8:2,
        9:2,
        0:2,
        'http://':1,
        'https://':1,
        '/':2,
        '@':2,
        '.':2,
        ',':2,
        '!':2,
        '?':2,
        '\"':2,
        '.com':1,
        '-':2,
        '\'':2
    };

    var bgs = {
        th:.52,       en:0.55,       ng:.18,
        he:.28 ,      ed:.53,       of:.16,
        in:.94  ,     to:.52 ,      al:.09,
        er:.94   ,    it:.50  ,     de:.09,
        an:.82    ,   ou:.50   ,    se:.08,
        re:.68     ,  ea:.47    ,   le:.08,
        nd:.63      , hi:.46     ,  sa:.06,
        at:.59       ,is:.46,       si:.05,
        on:.57,       or:.43 ,      ar:.04,
        nt:.56 ,      ti:.34  ,     ve:.04,
        ha:.56  ,     as:.33   ,    ra:.04,
        es:.56   ,    te:.27    ,   ld:.02,
        st:.55    ,   et:.19     ,  ur:.02
    };

    var words = [
        'the'
        ,'be'
        ,'to'
        ,'of'
        ,'and'
        ,'in'
        ,'that'
        ,'have'
        ,'it'
        ,'for'
        ,'not'
        ,'on'
        ,'with'
        ,'he'
        ,'as'
        ,'you'
        ,'do'
        ,'at'
        ,'this'
        ,'but'
        ,'his'
        ,'by'
        ,'from'
        ,'they'
        ,'we'
        ,'say'
        ,'her'
        ,'she'
        ,'or'
        ,'an'
        ,'will'
        ,'my'
        ,'one'
        ,'all'
        ,'would'
        ,'there'
        ,'their'
        ,'what'
        ,'so'
        ,'up'
        ,'out'
        ,'if'
        ,'about'
        ,'who'
        ,'get'
        ,'which'
        ,'go'
        ,'me'
        ,'when'
        ,'make'
        ,'can'
        ,'like'
        ,'time'
        ,'no'
        ,'just'
        ,'him'
        ,'know'
        ,'take'
        ,'people'
        ,'into'
        ,'year'
        ,'your'
        ,'good'
        ,'some'
        ,'could'
        ,'them'
        ,'see'
        ,'other'
        ,'than'
        ,'then'
        ,'now'
        ,'look'
        ,'only'
        ,'come'
        ,'its'
        ,'over'
        ,'think'
        ,'also'
        ,'back'
        ,'after'
        ,'use'
        ,'two'
        ,'how'
        ,'our'
        ,'work'
        ,'first'
        ,'well'
        ,'way'
        ,'even'
        ,'new'
        ,'want'
        ,'because'
        ,'any'
        ,'these'
        ,'give'
        ,'day'
        ,'most'
        ,'us'
        ,'last'
        ,'had'
    ];

    var choices = [
        ['j','u','r','v','m','c','','1','2','3','','/','?','http://'],
        ['q','f','o','a','i','l','','4','5','6','','@','!','https://'],
        ['y','s','t','h','n','k','','7','8','9','','.',',','.com'],
        ['x','w','g','e','d','','','','0','','','\"',"\'"],
        ['','','p','b','z']
    ];

    var actions = ['lt-done','lt-favorite','lt-clear','lt-back'];

    var KeyboardDict = Backbone.Model.extend({
        urlRoot:'/bigrams'
    });

    var Keyboard = Backbone.View.extend({
        tagName:'table',
        events: {
            'click .letter' : 'onClick',
            'click .lt-done' : 'onDone',
            'click .lt-clear' : 'onClear',
            'click .lt-back' : 'onBack',
            'click .lt-favorite' : 'onFavorite'
        },
        btnOff:'btn-inverse',
        btnSuggest:'btn-success',
        btnHighlight:'btn-primary',
        onClick: function(e){
            e.preventDefault();

            var l = $(e.currentTarget).attr('data-letter');
            this.changeLetter(this.output.data('data')+l)
        },
        changeLetter: function(word){
            var out = this.output;
            out.data('data',word);
            var l = (word && word.length) ? word.charAt(word.length-1) : null;

            if (this.letters)
                this.letters.removeClass(this.btnSuggest).addClass(this.btnOff);

            if (l){
                this.onBigrams(bgs,l);
                var self = this;
                var kbm = new KeyboardDict({id:l});
                kbm.fetch({
                    success:function(data){
                        self.onLetters(data.toJSON().payload,l)
                    }
                })
                this.onDictionary(words,l);
            }
            this.trigger(Keyboard.CHANGE,this.output.data('data'));

            this.render();
        },
        onFavorite: function() {
            this.trigger(Keyboard.FAVORITE,this.output.data('data'));
        },
        onDictionary: function(data,l){
            var found = false;
            _.each(data, function(w){
                var idx = w.indexOf(l);
                if (~idx && idx < w.length-1 && w[idx+1] != l){
                    $('button[data-letter="'+w[idx+1]+'"]').removeClass(this.btnOff).addClass(this.btnSuggest);
                    found = true;
                }
            },this)
            return found;
        },
        onLetters: function(data,l){
            var found = false;
            _.each(data, function(letter){
                    $('button[data-letter="'+letter+'"]').removeClass(this.btnOff).addClass(this.btnSuggest);
            },this)
            return found;
        },
        onBigrams: function(data,l){
            var found = false;
            _.each(_.keys(data), function(bg){
                if (!bg.indexOf(l)){
                    // highlight the other letter
                    var o = bg[1];
                    $('button[data-letter="'+o+'"]').removeClass(this.btnOff).addClass(this.btnSuggest);
                }
            },this);
            return found;
        },
        onDone: function(){
            if (this.letters)
                this.letters.removeClass(this.btnSuggest).removeClass(this.btnHighlight).addClass(this.btnOff);
            this.trigger(Keyboard.SUBMIT,this.output.data('data'));
            this.output.data('data','');
            this.render();
        },
        onBack: function(){
            if (this.letters)
                this.letters.removeClass(this.btnSuggest).removeClass(this.btnHighlight).addClass(this.btnOff);
            var data = this.output.data('data');
            var word = data.slice(0,data.length-1);
            this.output.data('data',word);
            if (word && word.length>0) {
                this.changeLetter(word);
            } else {
                this.trigger(Keyboard.CLEAR);
                this.render();
            }

        },
        onClear: function() {
            if (this.letters)
                this.letters.removeClass(this.btnSuggest).removeClass(this.btnHighlight).addClass(this.btnOff);
            this.output.data('data','');
            this.trigger(Keyboard.CLEAR);
            this.render();
        },
        moveUp:function(){
            this.move('up', Keyboard.MOVEUP);
        },
        moveDown:function(){
            this.move('down', Keyboard.MOVEDOWN);
        },
        moveLeft:function(){
            this.move('left', Keyboard.MOVELEFT);
        },
        moveRight:function(){
            this.move('right', Keyboard.MOVERIGHT);
        },
        move:function(dir, evt, def){
            if (this.selection){
                var nav = this.navMap[this.selection];
                var next = nav && nav[dir];
                if (!next){
                    this.setSelection(this.selection);
                    this.trigger(evt,this.selection);
                } else {
                    this.setSelection(next);
                }
            }
//            else {
//                // we are coming in from below somewhere = go for the middle
//                this.setSelection(def);
//            }
        },
        pick:function(){
            var curEl = $('.'+this.btnHighlight);
            if (curEl) curEl.trigger('click');
        },
        initialize : function(){
            var elements = '';

            var navMap = this.navMap = {};

            // last left, right, up, down, row and col counters
            var lu = {}, row=0, col=0;
            _.each(choices, function(cList){
                var ll = -1;
                _.each(cList, function(c){
                    var navc = {up:null, down:null, left:null, right:null};
                    if (c != ''){
                        // fix the last one for right
                        if (ll !=-1){
                            var ch = choices[row][ll];
                            if (navMap[ch]){
                                navMap[ch].right = c;
                                navc.left = ch;
                            }
                        }
                        ll = col;

                        if (lu[col]){
                            var ch2 = choices[row-1][col];
                            if (navMap[ch2]) {
                                navMap[ch2].down = c;
                                navc.up = ch2;
                            }
                        }
                        lu[col] = row+1;
                        navMap[c] = navc;
                    }
                    col++;
                    if (col == cList.length) {
                        col = 0;
                        ll = -1;
                    }
                });
                elements += this.makeElement(cList,row++);

            },this);
            navMap['lt-done'] = {up:'x',down:null, left:null, right:'lt-back'};
            navMap['lt-back'] = {up:'p',down:null, left:'lt-done', right:'lt-clear'};
            navMap['lt-clear'] = {up:'\"',down:null, left:'lt-back', right:'lt-favorite'};
            navMap['lt-favorite'] = {up:'\'',down:null, left:'lt-clear', right:null};
            navMap['x'].down = 'lt-done';
            navMap['w'].down = 'lt-done';
            navMap['p'].down = 'lt-done';
            navMap['b'].down = 'lt-done';
            navMap['z'].down = 'lt-done';
            navMap['0'].down = 'lt-done';
            navMap['\"'].down = 'lt-done';
            navMap['\''].down = 'lt-done';

//            console.log('navmap', navMap);

            var self = this;

            this.elements = elements;
            this.table = $('.lt-table');
            this.doneButton = $('.lt-done');
            this.backButton = $('.lt-back');
            this.clearButton = $('.lt-clear');
            this.favoiteButton = $('.lt-favorite');
            this.output = $('.lt-output').data('data','');
            this.output.keyup(function(e){
                var word = self.output.val()
                self.output.data('data',word);
                if (word && word.length>0) {
                    self.changeLetter(word);
                } else {
                    self.trigger(Keyboard.CLEAR);
                    self.render();
                }
            });
            this.table.html(this.elements);
            this.render();

        }, render : function(){
//            this.$el.empty().append(this.elements);
            this.delegateEvents();
            this.output.val(this.output.data('data'));
            if (!this.letters){
                this.letters = $('.letter');
//                this.letters.filter(function(){
//                    return $(this).attr('data-prob') > 2;
//                }).css('border','thin solid blue')
            }

            return this;
        },
        setSelection: function(letter){
//            if (!this.selection && letter){
//                this.trigger(Keyboard.MOVEIN, letter);
//            } else if (this.selection && !letter){
//                this.trigger(Keyboard.MOVEOUT, this.selection);
//            }
            this.selection = letter;
            if (this.letters) this.letters.removeClass(this.btnHighlight).removeClass(this.btnSuggest).addClass(this.btnOff);
            this.resetActions();
            if (letter) {
                if (_.contains(actions,letter)){
                    $('.'+letter).removeClass('btn-success').removeClass('btn-danger').addClass(this.btnHighlight);
                } else {
                    $('button[data-letter="'+letter+'"]').removeClass(this.btnSuggest).removeClass(this.btnOff).addClass(this.btnHighlight);
                }
            }
        },
        resetActions: function(){
            this.doneButton.removeClass(this.btnHighlight).addClass('btn-success');
            this.favoiteButton.removeClass(this.btnHighlight).addClass('btn-success');
            this.backButton.removeClass(this.btnHighlight).addClass('btn-danger');
            this.clearButton.removeClass(this.btnHighlight).addClass('btn-danger');
        },
        makeElement : function(ltrs, row){

            var el = '<tr>';
            var col = 0;
            _.each(ltrs, function(l){
                var btnSize = 'letter btn-large';
                if (letters[l] < 6) btnSize = 'letter';
                if (letters[l] < 2) btnSize = 'letter btn-mini';
                btnSize = 'btn '+this.btnOff + " " +btnSize;
//style="width:57px;"
                if (l=='') el += '<td>&nbsp;</td>'
                else {
                    el += '<td align="center"><button data-row="'+row+'" data-col="'+col+'" data-prob="'+letters[l]+
                        '" data-letter="'+l+'"  class="'+btnSize+'"><strong>'+l.toUpperCase()+'</strong></button></td>';
                }
                col++;
            },this);
            return el+'</tr>';
        }
    });
    Keyboard.SUBMIT = 'keyboard-submit';
    Keyboard.CHANGE = 'keyboard-change';
    Keyboard.CLEAR = 'keyboard-clear';
    Keyboard.FAVORITE = 'keyboard-favorite';
    Keyboard.MOVEUP = 'keyboard-moveup';
    Keyboard.MOVEDOWN = 'keyboard-movedown';
    Keyboard.MOVELEFT = 'keyboard-moveleft';
    Keyboard.MOVERIGHT = 'keyboard-moveright';
    Keyboard.MOVEOUT = 'keyboard-out';
    Keyboard.MOVEIN = 'keyboard-out';

    return Keyboard;
});
