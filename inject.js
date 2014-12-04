var Component = require('inject/receiver');

var TestInjector1 = require('inject/test/injector1');
var TestInjector2 = require('inject/test/injector2');
var TestInjector3 = require('inject/test/injector3');


var MyComponent = Component.extend({

}).inject();

//Alt Syntax:
var MyOtherComponent = Component.extend({
  inject: []
});