## Average Example

Run setTimeout numerous times and average out the delta of the actual vs requested timeout.
If you request a timeout of 10 milliseconds and fire repeatedly, how close to 10 milliseconds
does the timeout fire on average?

#### To run:

```bash
#1000 milliseconds, 5 rounds
node average 1000 5
```
