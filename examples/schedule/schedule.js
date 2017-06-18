'use strict';

const waveCollapse = require('../../index');
const assert = require('assert');

const towns = ['Hoopsville', 'Rip City', 'Bucketown', 'Rimcheck'];
const teams = waveCollapse.createIterator(towns)
    .map((town, townIndex) => [1, 2, 3, 4, 5, 6]
        .map(teamNumber => Object.assign({town, townIndex, teamName: `${town} #${teamNumber}`})))
    .flatten()
    .collect(() => true)
    .value;

function distance (townIndex1, townIndex2) {
    const a = Math.min(townIndex1, townIndex2),
        b = Math.max(townIndex1, townIndex2),
        delta = b - a;

    return delta === 3 ? 1 : delta;
}

waveCollapse.createPermutation(teams)
    .with(teams)
    .filter((teamA, teamB) => {
        if (teamA.teamName === teamB.teamName) {
            return false;
        }
        if (distance(teamA.townIndex, teamB.townIndex) > 1) {
            return false;
        }
        return true;
    })
    .visit()
    .collect((matchup) => console.log(`${matchup[0].teamName} vs. ${matchup[1].teamName}`) || true);