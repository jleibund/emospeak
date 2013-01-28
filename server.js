var express = require('express')
    , app = express()
    , http = require('http')
    , _ = require('underscore')
    , server = http.createServer(app)
    , io = require('socket.io').listen(app.listen(4000))
    , Controller = require('./lib/controller').Controller
    , EventType = require('./shared/event-type');

var controller = new Controller();
var throttleTime = controller.getOptions().throttle;

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(app.router);
    app.use(express.static(__dirname + '/content'));
    app.use(express.static(__dirname + '/shared'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


app.get('/bigrams/:id', function(req,res,next){
    res.send({
        status:0,
        payload:controller.getBigramFor(req.params.id)
    });
})

app.get('/favorite', function(req,res,next){
    res.send({
        status:0,
        payload:controller.getFavorites()
    });
});

app.put('/favorite/:id', function(req,res,next){
    controller.addFavorite(req.params.id);
    res.send({
        status:0,
        payload:controller.getFavorites()
    });
});

app.delete('/favorite/:id', function(req,res,next){
    controller.removeFavorite(req.params.id);
    res.send({
        status:0,
        payload:controller.getFavorites()
    });
});

app.get('/options', function(req,res,next){
    res.send({
        status:0,
        payload:controller.getOptions()
    });
});
app.post('/options', function(req,res,next){
    controller.setOptions(req.body);
    controller.store(function(err){
        if (err) return next(err);
        controller.reconnect();
        setTimeout(function(){
            res.send({
                status:0,
                payload:req.body
            });
        },500);
    });
});



///////////////////////////////////////////////////////


app.get('/nextWord', function(req, res, next){
    var term = req.query.term;
    res.send({
        status:0,
        payload:controller.nextWord(term)
    });
});

app.get('/say', function(req, res, next){
    var term = req.query.term;
    controller.say(term, function(){
        res.send({
            status:0,
            payload:term
        });
    });
});

app.get('/submitLine', function(req, res, next){
    var term = req.query.term;
    controller.submitLine(term);
    res.send({
        status:0,
        payload:term
    });
});

app.get('/suggest', function(req, res, next){
    var term = req.query.term;
    controller.suggest(term, function(data){
        res.send({
            status:0,
            payload:data
        });
    })
});

app.get('/rezero', function(req, res, next){
    controller.rezero();
    res.send({
        status:0,
        payload:{}
    });
});


//process.on('SIGINT', function () {
//    controller.epoc.disconnect();
//    process.kill(process.pid);
//});

io.of('/events').on('connection',function(socket){

    _.each(EventType, function(event){
        var emit = function(data){
//            console.log('Emit: ',event);
            if (~event.indexOf('/GYRO') || ~event.indexOf('/CONTROL'))
                socket.emit(event,data)
            else
                socket.emit(event);
        };
        if (~event.indexOf('/CONTROL') && ~event.indexOf('/GYRO')){
            emit = _.throttle(emit,throttleTime);
        }

        controller.addListener(event, emit);
    });
});




//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
