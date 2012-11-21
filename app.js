var app = module.exports = require('appjs'), mongoose = require('mongoose'),
    Controller = require('./lib/controller').Controller;

var conn = mongoose.createConnection("mongodb://localhost/emospeak");
var controller = new Controller({connection:conn, profile:'test', voice:'Ralph', rate:240});

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
  window.require = require;

  function F12(e){ return e.keyIdentifier === 'F12' }
  function Command_Option_J(e){ return e.keyCode === 74 && e.metaKey && e.altKey }

    require('./lib/console');

    window.addEventListener('keydown', function(e){
    if (Command_Option_J(e)) {
      window.frame.openDevTools();
    } else if (e.keyCode == 48){
//        controller.fireEvent({data:'foobar'});
        sendMessageToServer('hello');
//        publisherClient.publish('updates','foobar');
    }
  });
});

window.on('close', function(){
  console.log("Window Closed");
});

