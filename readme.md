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
reduce, skip, and take* on lazy iterators. Furthermore, it adds promise support to the normal
map/reduce paradigm to make iteration asynchronous.

Cool. Lazy, asynchronous (or synchronous) iteration. Yawn (lazy yawn).

In addition to supporting lazy iteration, I wanted the library to be able to iterate over
unions. Scala has list comprehension support allowing you to permute lists together in a
union, and at each level of combination, you can filter with a predicate. The Scala syntax
is a little rough
on the eyes. This library supports the equivalent functionality in a simple, fluent
syntax. It's not as terse, but in the spirit of ECMAScript, it should be readable and
somewhat intuitive.

#### Why Do Series Iteration?

I mentioned that the API can iterate asynchronously over promisy iterables. As a careful
observer, you may ask why that is even useful. You can iterate over iterables containing
promises, and the act of iterating asynchrously, waiting on each to fullfill, seems like
it may be a solution in search of a problem. However, there are a number of
reasons such a solution could be useful:

1. Throttling simultaneous asynchronous operations to one.
2. Supporting iterables of promises other than array.
3. Ability to invoke the first callback faster than Promise.all, since we do
not wait on all promises to fulfill.
4. Common semantic to handle promisy and atomic (or mixed) iterables.

#### Installation

```bash
npm install --save wave-collapse
```

### API

The module exports (2) functions, `makeLazyApi` and `combination`. It also exports
`reducers` and `defaultApi`, the purpose of which we will describe below. 

Please see the [examples](https://github.com/csgrimes1/wave-collapse/tree/master/examples) for usage.

#### API Design

The API is built into composable, pluggable components. There are four types of
components used in this library:

1. *Transformers* are functions that handle the math of transforming iterable elements.
By *math*, I mean that every call to _map_, _filter_, _flatten_, _skip_, etc. takes one element from
the underlying iterable and transforms it to 0..n resulting elements. A *map*
operation is 1:1. A _filter_ operation is either 1:0 or 1:1. A _flatten_ operation
is 1:n. To further illustrate the mathiness of transformers, they operate
through function composition and never cause an iteration to start. They're _lazy_:
they wait for terminating functions called *reducers* to pull from the iterator.
2. *Reducers* are terminating functions that start consuming from an iteration,
then collect and summarize the results. Familiar reducers include *sum* and *average*,
but often the developer will provide their own reducer callback.
3. *Iterables and Iterators* are familiar from ECMAScript 6. This API makes
use of this built-in functionality. However, the API goes a step further. It
can iterate over promises serially, making asynchronous generator functions
possible. The API also adds familiar methods to iterators - _map_, _reduce_, _filter_,
_take_, _skip_, and _flatten_. Finally, iteration is _lazy_. Consumers pull from
generators, and generators don't have to work any longer when consumption
stops.
4. *Combination* refers to combining each element with each element in one or
more other sets. The feature works similar to the *for comprehension* in Scala,
and it also supports filtering. 

#### The defaultApi

```javascript 1.6
const waveCollapse = require('wave-collapse').defaultApi;
```

##### Iterators

###### iterator.map (transform)  where transform: (value, index) => result
Puts the return value into the output iterator.
###### iterator.filter (predicate) where predicate (value, index) => result
If result is truthy, then `value` is included in the output iterator. Otherwise,
it is excluded.
###### iterator.flatten ()
Emits the members of nested iterators in the output iterator.
###### iterator.take (number)
Stops the output iterator when `number` elements have been covered. This is useful
when iterating over an infinite generator.
###### iterator.takeWhile (predicate) where predicate (value, index) => result
Stops the output iterator when `predicate` returns an untruthy result.
###### iterator.skip (number)
Hides the first `number` elements of the iterator from the output iterator.
###### iterator.skipWhile (predicate) where predicate (value, index) => result
Hides elements from the output iterator until `predicate` returns an untruthy result.
Then, all elements are returned.
###### iterator.reduce (reducer, initialValue) where reducer (accum, current, index) => nextAccum
Forces iteration to start. For each element of the underlying iterator, this function
is called, and it accumulates a result. There are three common reducers available through
`defaultApi`: `sum`, `average`, and `toArray`'

Note that the reducer semantics are not sufficient to complete certain types of operations.
For example, `average` requires a `sum` followed by a post-processing step to divide the
sum by the number of elements. Therefore, if `reducer` has a property named `postAccum`,
it will be called as a function with the following signature:
```javascript 1.6
(accumulation, count) => finalResult
```

###### defaultApi.iterateOver (target) where target is Iterator or Iterable
Returns an iterator in a lazy state. This iterator is not semantically equal to
an ECMAScript `Iterator`, as it has a different interface. Rather, this iterator object
has transformer methods (like `map` and `filter`) that compose with each other without
starting consumption of `target`. Finally, when the user calls `reduce`, this is when
iteration effectively starts.

###### combinator.with(other) where other is Iterator or Iterable
Returns a `Combinator` that is the union of the context `Combinator` and `other`.

###### combinator.filter(predicate) where predicate: (a, b, c, ..., z) => result
The parameters `a, b, c`, etc. represent unique combinations of the lists in the context
`Combinator`. There will be one more parameter than the number of calls to `with` in the
call chain. When the predicate result is falsy, the combination will be excluded from
the output `Combinator`.

###### defaultApi.combinations (target) where target is Iterator or Iterable
Returns a `Combinator` object that can create unions with other lists.

#### REPL Fun

```bash
> const waveCollapse = require('wave-collapse').defaultApi;
>
> waveCollapse.iterateOver([1, 2, 3])
  .map(x => 2 * x)
  .reduce(waveCollapse.toArray)
  .then(result => console.log('result:', result));
result: [ 2, 4, 6 ]
CompletionMonad { synchronous: true, value: undefined, status: 0 }
>
> waveCollapse.iterateOver([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)])
  .map(x => 2 * x)
  .reduce(waveCollapse.toArray)
  .then(result => console.log('result:', result));
Promise { <pending> }
> result: [ 2, 4, 6 ]
>
>
> waveCollapse.combinations(['a','b','c'])
  .with([1,2])
  .reduce(waveCollapse.toArray)
  .then(result => console.log('result:', result));
result: [ [ 'a', 1 ],
  [ 'a', 2 ],
  [ 'b', 1 ],
  [ 'b', 2 ],
  [ 'c', 1 ],
  [ 'c', 2 ] ]
CompletionMonad { synchronous: true, value: undefined, status: 0 }
>
>
> waveCollapse.combinations(['a','b','c'])
  .with([1,2,3,4])
  .filter((letter,number) => number % 3 !==0)
  .reduce(waveCollapse.toArray)
  .then(result => console.log('result:', result));
result: [ [ 'a', 1 ],
  [ 'a', 2 ],
  [ 'a', 4 ],
  [ 'b', 1 ],
  [ 'b', 2 ],
  [ 'b', 4 ],
  [ 'c', 1 ],
  [ 'c', 2 ],
  [ 'c', 4 ] ]
CompletionMonad { synchronous: true, value: undefined, status: 0 }
>
>//Sum, but start the summing at 100...
> waveCollapse.iterateOver([3,4,5])
  .reduce(waveCollapse.sum, 100)
  .then(result => console.log('result:', result));
result: 112
CompletionMonad { synchronous: true, value: undefined, status: 0 }
>
> waveCollapse.iterateOver([3,4,5])
  .reduce(waveCollapse.average)
  .then(result => console.log('result:', result));
result: 4
CompletionMonad { synchronous: true, value: undefined, status: 0 }
>
>//Custom accumulator
> waveCollapse.iterateOver([3,4,5])
  .reduce((accum,current) => accum * current, 1)
  .then(result => console.log('result:', result));
result: 60
CompletionMonad { synchronous: true, value: undefined, status: 0 }
```

#### Further Reading 
* [Wiki](https://github.com/csgrimes1/wave-collapse/wiki)
