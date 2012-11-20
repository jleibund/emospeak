var app = module.exports = require('appjs'), mongoose = require('mongoose'), redis = require('redis')
    Controller = require('./lib/controller').Controller,
    WebSocketClient = require('websocket').client,
    publisherClient = redis.createClient();

//var conn = mongoose.createConnection("mongodb://localhost/emospeak");
var controller = new Controller({connection:null, profile:'test', voice:'Ralph', rate:240});


//var jsonSocket = new WebSocketClient();
//
//jsonSocket.on('connectFailed', function(error) {
//    console.log('Connect Error: ' + error.toString());
//});
//jsonSocket.on('connect',function(connection) {
//    console.log("JSON socket connected!");
//
//    connection.on('error', function(error) {
//        console.log("Connection Error: " + error.toString());
//    });
//    connection.on('close', function() {
//        console.log('echo-protocol Connection Closed');
//    });
//    connection.on('message', function(message) {
//        if (message.type === 'utf8') {
//            console.log("Received: '" + message.utf8Data + "'");
//        }
//    });
//
//    connection.sendUTF(JSON.stringify(["SET", "hello", "world"]));
//    connection.sendUTF(JSON.stringify(["GET", "hello"]));
//});
//jsonSocket.connect('ws://127.0.0.1:7379/','echo-protocol');

var io = require('socket.io').listen(80);

io.sockets.on('connection', function (socket) {
    socket.on('set nickname', function (name) {
        socket.set('nickname', name, function () { socket.emit('ready'); });
    });

    socket.on('msg', function () {
        socket.get('nickname', function (err, name) {
            console.log('Chat message by ', name);
        });
    });
});


//app.router.get('/stream', function(request,response, next){
////    response.setHeader('Content-Type','text/event-stream');
////    response.setHeader('Cache-Control','no-cache');
////    response.setHeader('Connection','keep-alive');
//
//    request.setTimeout(Infinity);
//
//    var msgCount = 0;
//    var subscriber = redis.createClient();
//    subscriber.subscribe('updates');
//    subscriber.on('error', function(err){console.log('redis error',err)});
//    subscriber.on('message',function(channel,message){
//        msgCount++;
//        console.log('sub received',message, 'msgCount',msgCount);
//        response.write(200,'text/event-stream','id:'+msgCount+'\ndata: '+ message+'\n\n');
//    },false);
//
//    response.write(200,'text/event-stream','\n');
//
//    request.on('close',function(){
//        subscriber.unsubscribe();
//        subscriber.quit();
//    })
//
//    console.log('Setup event stream')
//});

app.serveFilesFrom(__dirname + '/content');

var menubar = app.createMenu([{
  label:'&File',
  submenu:[
    {
      label:'E&xit',
      action: function(){
        window.close();
      }
    }
  ]
},{
  label:'&Window',
  submenu:[
    {
      label:'Fullscreen',
      action:function(item) {
        window.frame.fullscreen();
        console.log(item.label+" called.");
      }
    },
    {
      label:'Minimize',
      action:function(){
        window.frame.minimize();
      }
    },
    {
      label:'Maximize',
      action:function(){
        window.frame.maximize();
      }
    },{
      label:''//separator
    },{
      label:'Restore',
      action:function(){
        window.frame.restore();
      }
    }
  ]
}]);

menubar.on('select',function(item){
  console.log("menu item "+item.label+" clicked");
});

var trayMenu = app.createMenu([{
  label:'Show',
  action:function(){
    window.frame.show();
  }
},{
  label:'Minimize',
  action:function(){
    window.frame.hide();
  }
},{
  label:'Exit',
  action:function(){
    window.close();
  }
}]);

var statusIcon = app.createStatusIcon({
  icon:'./data/content/icons/32.png',
  tooltip:'AppJS Hello World',
  menu:trayMenu
});

var window = app.createWindow({
  width  : 400,
  height : 200,
  icons  : __dirname + '/content/icons'
});

window.on('create', function(){
  console.log("Window Created");
  window.frame.show();
  window.frame.center();
  window.frame.setMenuBar(menubar);
});

window.on('ready', function(){
  console.log("Window Ready");
  window.process = process;
  window.module = module;

  function F12(e){ return e.keyIdentifier === 'F12' }
  function Command_Option_J(e){ return e.keyCode === 74 && e.metaKey && e.altKey }

  window.addEventListener('keydown', function(e){
    if (Command_Option_J(e)) {
      window.frame.openDevTools();
    } else if (e.keyCode == 48){
//        controller.fireEvent({data:'foobar'});
        publisherClient.publish('updates','foobar');
    }
  });
});

window.on('close', function(){
  console.log("Window Closed");
});

