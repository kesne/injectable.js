var Class = require('chic').Class;

var Injector = Class.extend({
  init: function(alias){
    this._alias = alias || 'anonymous';
    //First argument is the alias.
    var args = Array.prototype.splice.call(arguments, 0);
    args.shift();
    if(this.create) this.create.apply(this, args);
  }
});

module.exports = Injector;