var mongoose = require('mongoose'),
    Controller = require('../lib/controller').Controller
    ;


var db = mongoose.createConnection('mongodb://localhost/emospeak');

var schema = mongoose.Schema({ name: 'string' });
var Cat = db.model('Cat', schema);

var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err) {
    if (err) // ...
        console.log('meow');
});

var c = new Controller({profile:'test', voice:'Ralph', rate:240});

c.init(function(){
    c.submitLine('Chris was out fishing early Saturday morning')
    c.submitLine('One of the boats in his vicinity was caught on a crab trap');
    c.submitLine('Chris realized he was passing close');
    c.submitLine('Hello');
    c.submitLine('Kristin how do you do');
    c.nextWord('Kristin');
});

process.exit(0);


