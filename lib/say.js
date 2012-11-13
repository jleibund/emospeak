var spawn = require('child_process').spawn
    , fs = require('fs')
    , util = require('util');

module.exports.say = function(message, callback, options){

    var args = [];
    if (options && options.voice){
        args.push('-v');
        args.push(options.voice);
    }
    if (options && options.rate){
        args.push('-r');
        args.push(options.rate)
    }
    args.push(message);
    var sp = spawn('say', args); //	say -o hi.wav --data-format=LEF32@8000 "hello"

    sp.on('exit', function (code, signal) {
        if (callback) callback(code, signal);
    });
};


//var randomNumber = Math.floor(Math.random() * 100000);
//var filename = 'file_' + randomNumber + '.wav';
//var filePath = process.cwd() + '/files/' + filename;
//var sp = spawn('say', ['-v', 'Victoria', '-o', filePath, '--data-format=LEF32@8000', message]); //	say -o hi.wav --data-format=LEF32@8000 "hello"


