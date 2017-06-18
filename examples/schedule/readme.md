### Schedule Example

There are 4 basketball leagues in 4 towns. The towns appear on the map as
follows:

```text
Hoopsville      Rip City




Rimcheck        Bucketown
```

Consider Hoopsvile to be adjacent to Rimcheck and Rip City but *not*
adjacent to Bucketown. In building schedules, we want each team in
each league to play the teams in each adjacent league one time.

Each league has 6 teams. The teams will be named using this formula
in Javascript:

```javascript
`${town} #${index}`
```

Each team plays everyone in its own league, and again, each team in
the adjacent leagues. List all possible games for the schedule.