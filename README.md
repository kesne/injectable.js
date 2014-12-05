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

#### `Injector(alias:string, ...args);`

Accepts an alias which acts as the identifier in the receiver class to set exec order. The rest of the arguments get applied to your provided constructor.

### Receiver

Receivers accept injectors in a specific order to create injection chains that function calls will walk through.

#### `Receiver.extend(properties:object);`