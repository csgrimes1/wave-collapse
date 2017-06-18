## Wave Collapse  [![Build Status](https://travis-ci.org/csgrimes1/wave-collapse.svg?branch=master)](https://travis-ci.org/csgrimes1/wave-collapse)

#### Purpose

The name is a reference to *wave function collapse* in quantum physics.
At the quantum level, an wave/particle entity such as an electron exists in a state of
*superposition* - all possible states - until it interacts with an *observer*. The
observer's attempt to measure the entity cause it to collapse into a distinct
state.

This is analogous to lazy iteration in software. The next item in a sequence can exist
in an undefined state until the consumer of an iteration -- the observer -- wishes to
seek its value.

ECMAScript has very limited support for lazy iteration. It supports *generators*, but
you can only run map/reduce operations on arrays. This library lets you run *map, filter,
reduce, skip, and take* on lazy iterators. Furthermore, it adds *awaitEach* to the normal
map/reduce paradigm to make iteration asynchronous.

Cool. Lazy, asynchronous (or synchronous) iteration. Yawn (lazy yawn).

In addition to supporting lazy iteration, I wanted the library to be able to iterate over
unions. Scala has list comprehension support allowing you to permute lists together in a
union, and at each level of combination, you can filter. The syntax is a little rough
on the eyes. This library supports the equivalent functionality in a simple, fluent
syntax. It's not as terse, but in the spirit of ECMAScript, it should be readable and
somewhat intuitive.

#### Installation

```bash
npm install --save wave-collapse
```

### API

The module exports (2) functions, `createIterator` and `createPermutation`. Please see
the [examples](./examples) for usage.
