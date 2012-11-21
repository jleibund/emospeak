var Stream = require('stream');

function ConsoleStream(con){
    Stream.call(this);
    this.readable = false;
    this.writable = true;
    this.isRaw = false;
    this._console = con;
}

ConsoleStream.prototype = {
    __proto__: Stream.prototype,
    write: function write(buff, encoding) {
        if (!this.writable) {
            this.emit('error', new Error('Tried to write to a closed ConsoleStream'));
            return false;
        }

        if (buff instanceof Buffer) {
            buff = buff.toString(encoding || 'utf8');
        }
        this._console.log(buff + '');
        return true;
    },
    end: function end(buff, encoding){
        if (buff) {
            this.write(buff, encoding);
        }
        this.destroy();
    },
    destroy: function destroy(){
        if (this.writable) {
            this.writable = false;
            this._console = null;
            this.emit('close');
        }
    },
    destroySoon: function destroySoon(){
        this.destroy();
    }
};

var stderr = process.stderr;
var stdout = process.stdout;

var consoleStream = new ConsoleStream(window.console);
var desc = { configurable: true,
    enumerable: true,
    get: function(){ return consoleStream } };

Object.defineProperties(process, {
    stderr: desc,
    stdout: desc
});