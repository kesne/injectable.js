# Injectable.js

Injectable.js is a lightweight library for feature injection with automatic super calls. It is meant as an alternative to multi-level class inheritence in JavaScript.

Feature Injection embraces the idea of small, composable functions called _injectors_. These _injectors_ receive data from the method invocation, perform operations, and optionally return new data to the next function. Injectable.js automatically calls through all of the injected functions with the same name in the order that they were injected. The _injectors_ are injected into _receivers_.

## TODO

Inject methods into the receiver that haven't been explicitly defined in the receiver but are in the injectors.

One base class and anything at all can be composed. Inject injectors into injectors, inject receivers into injectors, etc. No more two classes, just one Injectable class that you can both receive and inject. This should be easy because the Inject class is ultra light-weight.

Should we really call the create method the constructor function when technically it's not?

Performance probably isn't the best because we build the run chain on the fly when the function is executed. This really isn't the most ideal way to do this. We could pre-build the chain on a call to the constructor function and store that so that we don't have to worry about re-doing it all the time. But it'd be worth creating a benchmark between using standard calls through this.sup(); provided by chic and with features injected with automatic calls through.

## Usage

### Injector

Injectors provide base functionality. An injector should have no dependencies on other injectors.

#### `Injector.extend(properties:object);`

Extend the base Injector class to create a new injectable class. Special properties:

- `create:function` - The constructor function for the receiver. This will be called when a new instance of your receiver is called with `new Receiver();`.

#### `new Injector(alias:string, ...args);`

Accepts an alias which acts as the identifier in the receiver class to set exec order. The rest of the arguments be applied to your provided constructor.

### Receiver

Receivers accept injectors in a specific order to create injection chains that function calls will walk through.

#### `Receiver.extend(properties:object);`

Special properties:

- `create:function` - The constructor function for the receiver. This will be called when a new instance of your receiver is called with `new Receiver();`.
- `inject:array`

This function returns a class extending the base Receiver class.

#### `new Receiver(...args);`

All arguments will be passed to the constructor.

## Async Steps

It's possible for any step in the execution to happen asyncronously. To do this, you must return a promise. This will cause the execution of the function chain to wait until the promise is resolved, at which point it will continue. Passing data from a function that returns a promise to the next function in the chain can be done by resolving the promise with an array, which will then be applied to the next function in the chain, similar to the synchronous returning mechanism.

If a promise rejects, the execution will stop and the next functions in the chain will not execute.

The main Injectable.js file does _not_ export a promise library, but **es6-promise** is available to include with `var Promise = require('injectablejs/promise');`.
