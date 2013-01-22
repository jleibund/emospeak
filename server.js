var express = require('express')
    , app = express()
    , http = require('http')
    , _ = require('underscore')
    , server = http.createServer(app)
    , io = require('socket.io').listen(app.listen(4000))
    , Controller = require('./lib/controller').Controller
    , EventType = require('./shared/event-type');

var powerThreshold = 0.45;
var throttleTime = 2000;
var afterCount = 4;

var controller = new Controller({voice:'Ralph', rate:260, powerThreshold:powerThreshold});


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
        payload:{profile:controller.getProfile()}
    });
});
app.post('/options', function(req,res,next){
    var obj = req.body;
    controller.setProfile(obj.profile);
    controller.store(function(err){
        if (err) return next(err);
        console.log('storeddd')
        controller.reconnect();
        setTimeout(function(){
            res.send({
                status:0,
                payload:{profile:controller.getProfile()}
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
