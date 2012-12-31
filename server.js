var express = require('express')
    , app = express()
    , http = require('http')
    , _ = require('underscore')
    , server = http.createServer(app)
    , io = require('socket.io').listen(app.listen(4000))
    , Controller = require('./lib/controller').Controller;

var powerThreshold = 0.45;
var debounceTime = 400;
var profile = '/Users/jpleibundguth/Library/Application Support/Emotiv/Profiles/jleibund.emu';

var controller = new Controller({voice:'Ralph', rate:260, powerThreshold:powerThreshold, profile:profile});

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(app.router);
    app.use(express.static(__dirname + '/content'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

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
    res.send({
        status:0,
        payload:controller.suggest(term)
    });
});



//process.on('SIGINT', function () {
//    controller.epoc.disconnect();
//    process.kill(process.pid);
//});

io.of('/events').on('connection',function(socket){

    _.each(Controller.events, function(event){
        var emit = function(data){
//            console.log('Emit: ',event);
            socket.emit(event,data)
        };
        if (!~event.indexOf('/CONTROL')){
            emit = _.debounce(emit,debounceTime,true);
        }

        controller.addListener(event, emit);
    });
});




//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
