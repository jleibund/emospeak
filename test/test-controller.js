var Controller = require('../lib/controller').Controller,
    mongoose = require('mongoose');

var conn = mongoose.createConnection("mongodb://localhost/emospeak");

var c = new Controller({connection:conn, profile:'test', voice:'Ralph', rate:240});

c.cur = 'Chris was out fishing early Saturday morning';
c.submitLine(function(){
    c.cur = 'One of the boats in his vicinity was caught on a crab trap'
    c.submitLine(function(){
        c.cur = 'Chris realized he was passing close';
        c.submitLine(function(){
            c.init(function(){
                console.log('done with init');
                process.exit(0);
            });
        })
    })
});


