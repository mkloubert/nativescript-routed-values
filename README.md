[![npm](https://img.shields.io/npm/v/nativescript-routed-values.svg)](https://www.npmjs.com/package/nativescript-routed-values)
[![npm](https://img.shields.io/npm/dt/nativescript-routed-values.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-routed-values)

# NativeScript Routed Values

A [NativeScript](https://nativescript.org/) module for implementing routed value graphs.

## License

[MIT license](https://raw.githubusercontent.com/mkloubert/nativescript-routed-values/master/LICENSE)

## Platforms

* Android
* iOS

## Installation

Run

```bash
tns plugin add nativescript-routed-values
```

inside your app project to install the module.

## What are "routed values"?

The idea is that you can build graphs of values.

You define one or more root element that can have one or more child that also can handle one or more child and so on.

For example:

```
        A1
    /       \
   B1         B2
  /  \      /    \
C1   C2    C3    C4
```

Here you have the root element `A1` that has the children `B1` and `B2`.

`B1` itself has the children `C1` and `C2`.

`B2` is the parent of `C3` and `C4`.

The code of that graph looks like this:

```typescript
import {RoutedNumber} from "nativescript-routed-values";

// the root element
var A1 = new RoutedNumber();

// the children of A1
var B1 = new RoutedNumber();
var B2 = new RoutedNumber();
A1.addChildren(B1, B2);

// the children of B1
var C1 = new RoutedNumber();
var C2 = new RoutedNumber();
B1.addChildren(C1, C2);

// the children of B2
var C3 = new RoutedNumber();
var C4 = new RoutedNumber();
B2.addChildren(C3, C4);
```

Now if you change the value of `A1` it will notify that value to all its children.

And these children will notify value changes to their children and so on.

By default the highest values wins.

You can set the value by using the `innerValue` property:

```typescript
A1.innerValue = 5979;
```

The effect is that `A1` will raise a change event for the `value` property of itself and their children `B1` and `B2`.

`B1` and `B2` will also raise change events for their children.

### Other direction

You also can use the "other" direction, what means that the lower value "wins".

In that case you have to set `Descending` value of the `RouterStradegy` enum

```typescript
enum RouterStradegy {
    /**
     * Take the value from parent (if greater)
     */
    Ascending,

    /**
     * Take the value from parent (if smaller)
     */
    Descending,
}
```

in the constructor of a routed value.

```typescript
import {RoutedNumber, RouterStradegy} from "nativescript-routed-values";

var A1 = new RoutedNumber(RouterStradegy.Descending);
```

## Example

### Data binding

The graph above is realized as [demo app](https://github.com/mkloubert/nativescript-routed-values/tree/master/demo).

<img src="https://raw.githubusercontent.com/mkloubert/nativescript-routed-values/master/demo.gif" width="320">

The values of the left side are the routed values provides by `value` property.

The values of the right side are the "real" / inner values provides by `innerValue` property.

To increase a value simply tap on it.

## Classes

### TrafficLight

This represents a "traffic light" and uses the following enum:

```typescript
TraficLightState {
    /**
     * None (gray)
     **/
    None = 0,

    /**
     * OK (green)
     **/
    OK = 1,

    /**
     * Warning (yellow)
     **/
    Warning = 2,

    /**
     * Error (red)
     **/
    Error = 3,

    /**
     * Fatal error (yellow / red)
     **/
    FatalError = 4,
}
```

### RoutedValue<T>

This is the generic version of a routed value and can be used for all comparable value types, especially for enums:

```typescript
import {RoutedValue} from "nativescript-routed-values";

enum MyEnum {
    Value1 = 1,
    Value2 = 2,
    Value3 = 3,
}

var v = new RoutedValue<MyEnum>(RouterStradegy.Descending);
```
