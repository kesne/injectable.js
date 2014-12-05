var Receiver = require('./receiver');
var Injector = require('./injector');
var Promise = require('./promise');

// SPEC FOR INJECTORS:

var InjectMe = Injector.extend({
  //Executes with the arguments passed.
  create: function(){
    console.log('I was constructed!');
  },
  //Provide a render function.
  render: function(){
    console.log('hit render!');
  },

  renderOrder: function(){
    console.log('render order first...');
  },


  dataPass: function(first, second, third){
    console.log('data passing! got:', first, second, third);
    return [third, second, first];
  },

  promise: function(){
    return new Promise(function(resolve, reject){
      console.log('starting with promise');
      setTimeout(function(){
        console.log('resolving promise');
        resolve(['promise', 'resolved', 'with', 'these', 'arguments']);
      }, 1000);
    });
  }
});



//Alt Syntax:
var MyReceiver = Receiver.extend({
  //Provide the injectors in the default order.
  //Give them all aliases so that we can change the order in the future if we want to.
  inject: [new InjectMe('injectedMe')],

  render: function(){
    //This should call through the 1, 2, and 3 injectors then execute this function.
    console.log('Should be called last');
  },

  renderOrder: ['injectedMe', function(){
    console.log('called after injector still...');
  }, 'injectedMe'],

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

  noParent: function(){
    console.log('should be called alone...');
  },

  dataPass: function(first, second, third){
    console.log('data passing twice! got:', first, second, third);
  },

  promise: function(){
    console.log('called after the first!');
  }
});

// Create a new instance of our component:
var instance = new MyReceiver();

// Call through our render chain:
instance.render();
console.log('\n\n');
instance.renderOrder();
console.log('\n\n');
instance.noParent();
console.log('\n\n');
instance.dataPass('one', 'two', 'three');
console.log('\n\n');
instance.promise('');



