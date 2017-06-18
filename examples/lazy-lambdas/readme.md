## Lazy-Lambdas Example

Run setTimeout numerous times and average out the delta of the actual vs requested timeout.
If you request a timeout of 1000 milliseconds and fire repeatedly, how close to 1000 milliseconds
does the timeout fire on average?

This example is based on the `average` example, but it is written to be completely
immutable. It demonstrates how arrays can be lazy when they contain only lambdas. The
lazy behavior is evident in the delay between each line of console output.

#### Hint

Comment out the line containing `.awaitEach` and see the difference in behavior.