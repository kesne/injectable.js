var Component = require('inject/receiver');
var Injector = require('inject/injector');
var promise = require('inject/promise');


// SPEC FOR RECEIVERS

var TestInjector1 = require('inject/test/injector1');
var TestInjector2 = require('inject/test/injector2');
var TestInjector3 = require('inject/test/injector3');

//Alt Syntax:
var MyOtherComponent = Component.extend({
  //Provide the injectors in the default order.
  //Give them all aliases so that we can change the order in the future if we want to.
  inject: [new TestInjector1('1'), new TestInjector2('2'), new TestInjector3('3')],

  render: function(){
    //This should call through the 1, 2, and 3 injectors then execute this function.
    console.log('Should be called last');
  },

  //To break out of the normal execution chain provide an array which we'll use to execute the injected features in any given order.
  renderArr: [
    //Use reverse order:
    '3',
    '2',
    '1',
    //Add our function to the end of the chain:
    function(){
      //Do something.
    }
  ],


  dataRender: function(){
    //
  }
});

// Create a new instance of our component:
var instance = new MyOtherComponent();

// Call through our render chain:
instance.render();

//Use data render:
instance.dataRender('myData');


// SPEC FOR INJECTORS:

module.exports = Injector.extend({
  //Executes with the arguments passed.
  constructor: function(){

  },
  //Provide a render function.
  render: function(){

  },


  //Accept the string:
  dataRender: function(myString){
    //Return an array that will be applied to the next function:
    return [];
  },

  //To have a part of the chain async, return a promise or promise-like (thenable) object:
  asyncRender: function(){
    return promise(function(resolve, reject){
      resolve([args, to, be, applied]);

      //If you reject, we halt the chain
    });
  }
});



