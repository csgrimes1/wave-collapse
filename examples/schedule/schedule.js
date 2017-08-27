'use strict';

const waveCollapse = require('../../index').defaultApi;
const assert = require('assert');

console.log('wc:', waveCollapse);

const towns = ['Hoopsville', 'Rip City', 'Bucketown', 'Rimcheck'];
const teams = waveCollapse.iterateOver(towns)
    .map((town, townIndex) => [1, 2, 3, 4, 5, 6]
        .map(teamNumber => Object.assign({town, townIndex, teamName: `${town} #${teamNumber}`})))
    .flatten()
    .reduce(waveCollapse.toArray)
    .value;

function distance (townIndex1, townIndex2) {
    const a = Math.min(townIndex1, townIndex2),
        b = Math.max(townIndex1, townIndex2),
        delta = b - a;

    return delta === 3 ? 1 : delta;
}

waveCollapse.permutation(teams)
    .with(teams)
    .filter((teamA, teamB) => {
        if (teamA.teamName === teamB.teamName) {
            console.log(`Skipping self vs. self game for ${teamA.teamName}.`);
            return false;
        }
        if (distance(teamA.townIndex, teamB.townIndex) > 1) {
            console.log(`Unscheduling ${teamA.teamName} vs. ${teamB.teamName} due to distance from ${towns[teamA.townIndex]} to ${towns[teamB.townIndex]}.`);
            return false;
        }
        return true;
    })
    .reduce(waveCollapse.toArray)
    .then(matchups => {
        matchups.forEach(matchup => {
            console.log(`${matchup[0].teamName} vs. ${matchup[1].teamName}`);
            assert.notEqual(matchup[0].teamName, matchup[1].teamName);
            const dist = distance(matchup[0].townIndex, matchup[1].townIndex);
            assert(dist <= 1);
        });
    });
