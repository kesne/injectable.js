# Inject.js

Inject is a library developed for the Juno core. It is meant to solve the problem of multi-level class extending in JS with the idea of feature injection.

## TODO

Inject methods into the receiver that haven't been explicitly defined in the receiver but are in the injectors.

Async injector methods.

Inject Receivers into other Receivers?

One base class and anything at all can be composed? Inject injectors into injectors, inject receivers into injectors, etc.

## API

### Injector

Injectors provide base functionality. An injector should have no dependencies on other injectors.

#### `Injector.extend(properties:object);`

Extend the base Injector class to create a new injectable class.

#### `new Injector(alias:string, ...args);`

Accepts an alias which acts as the identifier in the receiver class to set exec order. The rest of the arguments get applied to your provided constructor.

### Receiver

Receivers accept injectors in a specific order to create injection chains that function calls will walk through.

#### `Receiver.extend(properties:object);`

Special properties:

- `init:function` - The constructor function for the receiver. This will be called when a new instance of your receiver is called with `new Receiver();`.
- `inject:array`

This function returns a class extending the base Receiver class.

#### `new Receiver(...args);`

All arguments will be passed to the constructor.

## Async

It's possible for any step in the execution to happen asyncronously. To do this, you must return a promise. This will cause the execution of the function chain to wait until the promise is resolved, at which point it will continue. Passing data from a function that returns a promise to the next function in the chain can be done by resolving the promise with an array, which will then be applied to the next function in the chain, similar to the synchronous returning mechanism.

If a promise rejects, the execution will stop and the next functions in the chain will not execute.

Inject.js does _not_ export a promise library, by default but **es6-promise** is available to include with `var Promise = require('injectjs/promise');`.
