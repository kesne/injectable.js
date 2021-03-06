var Class = require('chic').Class;
var Injector = require('./injector');

var Receiver = Class.extend({
  init: function(){
    //Call the create constructor:
    if(this.create) this.create.apply(this, args);
  },
  //Sets up the call to the run chain:
  _exec: function(key, provided){
    return function(){
      //We were provide a specific call chain, so use that instead of the default:
      var chain;
      if(typeof provided === 'object'){
        //Build a custom chain:
        chain = this._buildChain(key, provided);
      }else{
        //Use the default call chain:
        chain = this._buildChain(key, this._injected.defaultCallChain, provided);
      }
      //Run chain we've built:
      return this._runChain(arguments, chain);
    }
  },
  //Turns mixed arrays of aliases and functions into a purely functional array:
  _buildChain: function(fnName, order, end){
    var chain = [];
    for(var i = 0; i < order.length; i++){
      if(typeof order[i] === 'string' && this._injected.alias[order[i]] && this._injected.alias[order[i]][fnName]){
        //Inject the function from the alias injector:
        chain.push(this._injected.alias[order[i]][fnName]);
      }else if(order[i] instanceof Injector && order[i][fnName]){
        //It's just a function, so just push it to the chain:
        chain.push(order[i][fnName]);
      }else if(typeof order[i] === 'function'){
        //It's just a function, so just push it to the chain:
        chain.push(order[i]);
      }
    }
    if(end) chain.push(end);
    return chain;
  },
  //Runs the injectors in order:
  _runChain: function(args, chain, i){
    if(!i) i = 0;
    var nArgs = chain[i].apply(this, args);
    //Allow for promise resolution:
    if(nArgs && nArgs.then && typeof nArgs.then === 'function'){
      var self = this;
      return nArgs.then(function(nArgs){
        if(typeof nArgs === 'undefined') nArgs = args;
        if(i < chain.length - 1) self._runChain(nArgs, chain, i+1);
      }, function(){
        // Don't call next chain method.
        //TODO: Handle Error?
      });
    }else{
      //Go to the next link:
      if(i < chain.length - 1){
        if(typeof nArgs === 'undefined') nArgs = args;
        return this._runChain(nArgs, chain, i+1)
      }else{
        return nArgs;
      };
    }
  }
});

var injectProto = function(R, fnName, provided){
  if(!R.prototype[fnName]){
    R.prototype[fnName] = function(){
      return this._exec(fnName, provided).apply(this, arguments);
    };
  }
};

//Alias chic:
Receiver._extend = Receiver.extend;

//Don't inject these functions:
var noInject = ['create', 'constructor', 'init'];

//Note: We're not using native extension from chic because that wouldn't work with our ordered exec.
Receiver.extend = function(proto){
  //Get a new class:
  var R = Receiver._extend({});
  //Keep a reference to the prototype to avoid re-typing R.prototype. Better for code minification.
  var RProto = R.prototype;

  //Extract the injectors:
  var injectors = proto.inject || [];
  //Clean from the prototype:
  delete proto.inject;

  //Set up the injected object:
  RProto._injected = {
    //The default call chain
    defaultCallChain: injectors,
    //Where the aliases for the injects will be stored:
    alias: {}
  };

  //Generate a prototype that allows for feature injection:
  for(var fnName in proto){
    if(proto.hasOwnProperty(fnName)){
      injectProto(R, fnName, proto[fnName]);
    }
  }

  //Set up the aliases as key/value in the _injexted object:
  for(var i = 0; i < injectors.length; i++){
    RProto._injected.alias[injectors[i]._alias] = injectors[i];

    //Inject the functionality from the injectors:
    for(var injectFnName in injectors[i]){
      if(typeof injectors[i][injectFnName] === 'function' && noInject.indexOf(injectFnName) === -1){
        //Inject the function but don't give a provided end of the chain:
        injectProto(R, injectFnName);
      }
    }
  }

  return R;
};

module.exports = Receiver;