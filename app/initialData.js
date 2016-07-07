/**
 * Created by I305845 on 22/05/2016.
 */
/*
 All Dates should be 2 hours before France time (UTC time)
 */
var Q = require('q');
module.exports = {

    insertData: function (matches, teams) {
        var deferred = Q.defer();

        // remove all:
        matches.remove().exec().then(function () {
            teams.remove().exec().then(function () {

                Q.all([
                    // insert matches data:
                    new matches({
                        matchID: 1,
                        team1: 'France',
                        team2: 'Romania',
                        kickofftime: new Date("2016-06-10T19:00:00Z"),
                        winner: 'France',
                        team1score: 2,
                        team2score: 1,
                        goaldiff: 1,
                        firstscore: 'France'

                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 2,
                        team1: 'Albania',
                        team2: 'Switzerland',
                        kickofftime: new Date("2016-06-11T13:00:00Z"),
                        winner: 'Switzerland',
                        team1score: 0,
                        team2score: 1,
                        goaldiff: 1,
                        firstscore: 'Switzerland'

                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 3,
                        team1: 'Wales',
                        team2: 'Slovakia',
                        kickofftime: new Date("2016-06-11T16:00:00Z"),
                        winner: 'Wales',
                        team1score: 2,
                        team2score: 1,
                        goaldiff: 1,
                        firstscore: 'Wales'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 4,
                        team1: 'England',
                        team2: 'Russia',
                        kickofftime: new Date("2016-06-11T19:00:00Z"),
                        winner: 'Draw',
                        team1score: 1,
                        team2score: 1,
                        goaldiff: 0,
                        firstscore: 'England'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 5,
                        team1: 'Turkey',
                        team2: 'Croatia',
                        kickofftime: new Date("2016-06-12T13:00:00Z"),
                        winner: 'Croatia',
                        team1score: 0,
                        team2score: 1,
                        goaldiff: 1,
                        firstscore: 'Croatia'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 6,
                        team1: 'Poland',
                        team2: 'Northern Ireland',
                        kickofftime: new Date("2016-06-12T16:00:00Z"),
                        winner: 'Poland',
                        team1score: 1,
                        team2score: 0,
                        goaldiff: 1,
                        firstscore: 'Poland'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 7,
                        team1: 'Germany',
                        team2: 'Ukraine',
                        kickofftime: new Date("2016-06-12T19:00:00Z"),
                        winner: 'Germany',
                        team1score: 2,
                        team2score: 0,
                        goaldiff: 2,
                        firstscore: 'Germany'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 8,
                        team1: 'Spain',
                        team2: 'Czech Republic',
                        kickofftime: new Date("2016-06-13T13:00:00Z"),
                        winner: 'Spain',
                        team1score: 1,
                        team2score: 0,
                        goaldiff: 1,
                        firstscore: 'Spain'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 9,
                        team1: 'Republic of Ireland',
                        team2: 'Sweden',
                        kickofftime: new Date("2016-06-13T16:00:00Z"),
                        winner: 'Draw',
                        team1score: 1,
                        team2score: 1,
                        goaldiff: 0,
                        firstscore: 'Republic of Ireland'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 10,
                        team1: 'Belgium',
                        team2: 'Italy',
                        kickofftime: new Date("2016-06-13T19:00:00Z"),
                        winner: 'Italy',
                        team1score: 0,
                        team2score: 2,
                        goaldiff: 2,
                        firstscore: 'Italy'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 11,
                        team1: 'Austria',
                        team2: 'Hungary',
                        kickofftime: new Date("2016-06-14T16:00:00Z"),
                        winner: 'Hungary',
                        team1score: 0,
                        team2score: 2,
                        goaldiff: 2,
                        firstscore: 'Hungary'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 12,
                        team1: 'Portugal',
                        team2: 'Iceland',
                        kickofftime: new Date("2016-06-14T19:00:00Z"),
                        winner: 'Draw',
                        team1score: 1,
                        team2score: 1,
                        goaldiff: 0,
                        firstscore: 'Portugal'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 13,
                        team1: 'Russia',
                        team2: 'Slovakia',
                        kickofftime: new Date("2016-06-15T13:00:00Z"),
                        winner: 'Slovakia',
                        team1score: 1,
                        team2score: 2,
                        goaldiff: 1,
                        firstscore: 'Slovakia'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 14,
                        team1: 'Romania',
                        team2: 'Switzerland',
                        kickofftime: new Date("2016-06-15T16:00:00Z"),
                        winner: 'Draw',
                        team1score: 1,
                        team2score: 1,
                        goaldiff: 0,
                        firstscore: 'Romania'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 15,
                        team1: 'France',
                        team2: 'Albania',
                        kickofftime: new Date("2016-06-15T19:00:00Z"),
                        winner: 'France',
                        team1score: 2,
                        team2score: 0,
                        goaldiff: 2,
                        firstscore: 'France'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 16,
                        team1: 'England',
                        team2: 'Wales',
                        kickofftime: new Date("2016-06-16T13:00:00Z"),
                        winner: 'England',
                        team1score: 2,
                        team2score: 1,
                        goaldiff: 1,
                        firstscore: 'Wales'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 17,
                        team1: 'Ukraine',
                        team2: 'Northern Ireland',
                        kickofftime: new Date("2016-06-16T16:00:00Z"),
                        winner: 'Northern Ireland',
                        team1score: 0,
                        team2score: 2,
                        goaldiff: 2,
                        firstscore: 'Northern Ireland'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 18,
                        team1: 'Germany',
                        team2: 'Poland',
                        kickofftime: new Date("2016-06-16T19:00:00Z"),
                        winner: 'Draw',
                        team1score: 0,
                        team2score: 0,
                        goaldiff: 0,
                        firstscore: 'None'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 19,
                        team1: 'Italy',
                        team2: 'Sweden',
                        kickofftime: new Date("2016-06-17T13:00:00Z"),
                        winner: 'Italy',
                        team1score: 1,
                        team2score: 0,
                        goaldiff: 1,
                        firstscore: 'Italy'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 20,
                        team1: 'Czech Republic',
                        team2: 'Croatia',
                        kickofftime: new Date("2016-06-17T16:00:00Z"),
                        winner: 'Draw',
                        team1score: 2,
                        team2score: 2,
                        goaldiff: 0,
                        firstscore: 'Croatia'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 21,
                        team1: 'Spain',
                        team2: 'Turkey',
                        kickofftime: new Date("2016-06-17T19:00:00Z"),
                        winner: 'Spain',
                        team1score: 3,
                        team2score: 0,
                        goaldiff: 3,
                        firstscore: 'Spain'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 22,
                        team1: 'Belgium',
                        team2: 'Republic of Ireland',
                        kickofftime: new Date("2016-06-18T13:00:00Z"),
                        winner: 'Belgium',
                        team1score: 3,
                        team2score: 0,
                        goaldiff: 3,
                        firstscore: 'Belgium'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 23,
                        team1: 'Iceland',
                        team2: 'Hungary',
                        kickofftime: new Date("2016-06-18T16:00:00Z"),
                        winner: 'Draw',
                        team1score: 1,
                        team2score: 1,
                        goaldiff: 0,
                        firstscore: 'Iceland'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 24,
                        team1: 'Portugal',
                        team2: 'Austria',
                        kickofftime: new Date("2016-06-18T19:00:00Z"),
                        winner: 'Draw',
                        team1score: 0,
                        team2score: 0,
                        goaldiff: 0,
                        firstscore: 'None'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 25,
                        team1: 'Romania',
                        team2: 'Albania',
                        kickofftime: new Date("2016-06-19T19:00:00Z"),
                        winner: 'Albania',
                        team1score: 0,
                        team2score: 1,
                        goaldiff: 1,
                        firstscore: 'Albania'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 26,
                        team1: 'Switzerland',
                        team2: 'France',
                        kickofftime: new Date("2016-06-19T19:00:00Z"),
                        winner: 'Draw',
                        team1score: 0,
                        team2score: 0,
                        goaldiff: 0,
                        firstscore: 'None'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 27,
                        team1: 'Russia',
                        team2: 'Wales',
                        kickofftime: new Date("2016-06-20T19:00:00Z"),
                        winner: 'Wales',
                        team1score: 0,
                        team2score: 3,
                        goaldiff: 3,
                        firstscore: 'Wales'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 28,
                        team1: 'Slovakia',
                        team2: 'England',
                        kickofftime: new Date("2016-06-20T19:00:00Z"),
                        winner: 'Draw',
                        team1score: 0,
                        team2score: 0,
                        goaldiff: 0,
                        firstscore: 'None'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 29,
                        team1: 'Ukraine',
                        team2: 'Poland',
                        kickofftime: new Date("2016-06-21T16:00:00Z"),
                        winner: 'Poland',
                        team1score: 0,
                        team2score: 1,
                        goaldiff: 1,
                        firstscore: 'Poland'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 30,
                        team1: 'Northern Ireland',
                        team2: 'Germany',
                        kickofftime: new Date("2016-06-21T16:00:00Z"),
                        winner: 'Germany',
                        team1score: 0,
                        team2score: 1,
                        goaldiff: 1,
                        firstscore: 'Germany'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 31,
                        team1: 'Czech Republic',
                        team2: 'Turkey',
                        kickofftime: new Date("2016-06-21T19:00:00Z"),
                        winner: 'Turkey',
                        team1score: 0,
                        team2score: 2,
                        goaldiff: 2,
                        firstscore: 'Turkey'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 32,
                        team1: 'Croatia',
                        team2: 'Spain',
                        kickofftime: new Date("2016-06-21T19:00:00Z"),
                        winner: 'Croatia',
                        team1score: 2,
                        team2score: 1,
                        goaldiff: 1,
                        firstscore: 'Spain'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 33,
                        team1: 'Iceland',
                        team2: 'Austria',
                        kickofftime: new Date("2016-06-22T16:00:00Z"),
                        winner: 'Iceland',
                        team1score: 2,
                        team2score: 1,
                        goaldiff: 1,
                        firstscore: 'Iceland'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 34,
                        team1: 'Hungary',
                        team2: 'Portugal',
                        kickofftime: new Date("2016-06-22T16:00:00Z"),
                        winner: 'Draw',
                        team1score: 3,
                        team2score: 3,
                        goaldiff: 0,
                        firstscore: 'Hungary'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 35,
                        team1: 'Italy',
                        team2: 'Republic of Ireland',
                        kickofftime: new Date("2016-06-22T19:00:00Z"),
                        winner: 'Republic of Ireland',
                        team1score: 0,
                        team2score: 1,
                        goaldiff: 1,
                        firstscore: 'Republic of Ireland'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 36,
                        team1: 'Sweden',
                        team2: 'Belgium',
                        kickofftime: new Date("2016-06-22T19:00:00Z"),
                        winner: 'Belgium',
                        team1score: 0,
                        team2score: 1,
                        goaldiff: 1,
                        firstscore: 'Belgium'
                    }).save(function (err) {
                    }),

                    // playoffs
                    new matches({
                        matchID: 37,
                        team1: 'Switzerland',
                        team2: 'Poland',
                        kickofftime: new Date("2016-06-25T13:00:00Z"),
                        winner: 'Draw',
                        team1score: 1,
                        team2score: 1,
                        goaldiff: 0,
                        firstscore: 'Poland'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 38,
                        team1: 'Wales',
                        team2: 'Northern Ireland',
                        kickofftime: new Date("2016-06-25T16:00:00Z"),
                        winner: 'Wales',
                        team1score: 1,
                        team2score: 0,
                        goaldiff: 1,
                        firstscore: 'Wales'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 39,
                        team1: 'Croatia',
                        team2: 'Portugal',
                        kickofftime: new Date("2016-06-25T19:00:00Z"),
                        winner: 'Draw',
                        team1score: 0,
                        team2score: 0,
                        goaldiff: 0,
                        firstscore: 'None'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 40,
                        team1: 'France',
                        team2: 'Republic of Ireland',
                        kickofftime: new Date("2016-06-26T13:00:00Z"),
                        winner: 'France',
                        team1score: 2,
                        team2score: 1,
                        goaldiff: 1,
                        firstscore: 'Republic of Ireland'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 41,
                        team1: 'Germany',
                        team2: 'Slovakia',
                        kickofftime: new Date("2016-06-26T16:00:00Z"),
                        winner: 'Germany',
                        team1score: 3,
                        team2score: 0,
                        goaldiff: 3,
                        firstscore: 'Germany'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 42,
                        team1: 'Hungary',
                        team2: 'Belgium',
                        kickofftime: new Date("2016-06-26T19:00:00Z"),
                        winner: 'Belgium',
                        team1score: 0,
                        team2score: 4,
                        goaldiff: 4,
                        firstscore: 'Belgium'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 43,
                        team1: 'Italy',
                        team2: 'Spain',
                        kickofftime: new Date("2016-06-27T16:00:00Z"),
                        winner: 'Italy',
                        team1score: 2,
                        team2score: 0,
                        goaldiff: 0,
                        firstscore: 'Italy'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 44,
                        team1: 'England',
                        team2: 'Iceland',
                        kickofftime: new Date("2016-06-27T19:00:00Z"),
                        winner: 'Iceland',
                        team1score: 1,
                        team2score: 2,
                        goaldiff: 1,
                        firstscore: 'Iceland'
                    }).save(function (err) {
                    }),

                    // Q-Finals
                    new matches({
                        matchID: 45,
                        team1: 'Poland',
                        team2: 'Portugal',
                        kickofftime: new Date("2016-06-30T19:00:00Z"),
                        winner: 'Draw',
                        team1score: 1,
                        team2score: 1,
                        goaldiff: 0,
                        firstscore: 'Poland'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 46,
                        team1: 'Wales',
                        team2: 'Belgium',
                        kickofftime: new Date("2016-07-01T19:00:00Z"),
                        winner: 'Wales',
                        team1score: 3,
                        team2score: 1,
                        goaldiff: 2,
                        firstscore: 'Belgium'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 47,
                        team1: 'Germany',
                        team2: 'Italy',
                        kickofftime: new Date("2016-07-02T19:00:00Z"),
                        winner: 'Draw',
                        team1score: 1,
                        team2score: 1,
                        goaldiff: 0,
                        firstscore: 'Germany'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 48,
                        team1: 'France',
                        team2: 'Iceland',
                        kickofftime: new Date("2016-07-03T19:00:00Z"),
                        winner: 'France',
                        team1score: 5,
                        team2score: 2,
                        goaldiff: 3,
                        firstscore: 'France'
                    }).save(function (err) {
                    }),

                    // S-Final
                    new matches({
                        matchID: 49,
                        team1: 'Portugal',
                        team2: 'Wales',
                        kickofftime: new Date("2016-07-06T19:00:00Z"),
                        winner: 'Portugal',
                        team1score: 2,
                        team2score: 0,
                        goaldiff: 2,
                        firstscore: 'Portugal'
                    }).save(function (err) {
                    }),
                    new matches({
                        matchID: 50,
                        team1: 'Germany',
                        team2: 'France',
                        kickofftime: new Date("2016-07-07T19:00:00Z"),
                        winner: 'France',
                        team1score: 0,
                        team2score: 2,
                        goaldiff: 2,
                        firstscore: 'France'
                    }).save(function (err) {
                    }),
                    // Final
                    new matches({
                        matchID: 51,
                        team1: 'Portugal',
                        team2: 'France',
                        kickofftime: new Date("2016-07-10T19:00:00Z")
                    }).save(function (err) {
                    }),

                    // insert teams data:
                    new teams({
                        teamID: 1,
                        name: 'Champion',
                        desc: 'Champion',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 16

                    }).save(function (err) {
                    }),
                    new teams({
                        teamID: 2,
                        name: 'Runner up',
                        desc: 'Runner up',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 8
                    }).save(function (err) {
                    }),
                    new teams({
                        teamID: 3,
                        name: 'A1',
                        desc: 'Winner of group A',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 4,
                        team: 'France'
                    }).save(function (err) {
                    }),
                    new teams({
                        teamID: 4,
                        name: 'A2',
                        desc: 'Runner up of group A',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 4,
                        team: 'Switzerland'
                    }).save(function (err) {
                    }),
                    new teams({
                        teamID: 5,
                        name: 'B1',
                        desc: 'Winner of group B',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 4,
                        team: 'Wales'
                    }).save(function (err) {
                    }),
                    new teams({
                        teamID: 6,
                        name: 'B2',
                        desc: 'Runner up of group B',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 4,
                        team: 'England'
                    }).save(function (err) {
                    }),
                    new teams({
                        teamID: 7,
                        name: 'C1',
                        desc: 'Winner of group C',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 4,
                        team: 'Germany'
                    }).save(function (err) {
                    }),
                    new teams({
                        teamID: 8,
                        name: 'C2',
                        desc: 'Runner up of group C',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 4,
                        team: 'Poland'
                    }).save(function (err) {
                    }),
                    new teams({
                        teamID: 9,
                        name: 'D1',
                        desc: 'Winner of group D',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 4,
                        team: 'Croatia'
                    }).save(function (err) {
                    }),
                    new teams({
                        teamID: 10,
                        name: 'D2',
                        desc: 'Runner up of group D',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 4,
                        team: 'Spain'
                    }).save(function (err) {
                    }),
                    new teams({
                        teamID: 11,
                        name: 'E1',
                        desc: 'Winner of group E',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 4,
                        team: 'Italy'
                    }).save(function (err) {
                    }),
                    new teams({
                        teamID: 12,
                        name: 'E2',
                        desc: 'Runner up of group E',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 4,
                        team: 'Belgium'
                    }).save(function (err) {
                    }),
                    new teams({
                        teamID: 13,
                        name: 'F1',
                        desc: 'Winner of group F',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 4,
                        team: 'Hungary'
                    }).save(function () {

                    }),
                    new teams({
                        teamID: 14,
                        name: 'F2',
                        desc: 'Runner up of group F',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 4,
                        team: 'Iceland'
                    }).save(function () {

                    }),

                    new teams({
                        teamID: 15,
                        name: '3rd #1',
                        desc: '1st of 3rd place table',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 4,
                        team: 'Slovakia'
                    }).save(function () {

                    }),

                    new teams({
                        teamID: 16,
                        name: '3rd #2',
                        desc: '2nd of 3rd place table',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 4,
                        team: 'Republic of Ireland'
                    }).save(function () {

                    }),

                    new teams({
                        teamID: 17,
                        name: '3rd #3',
                        desc: '3rd of 3rd place table',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 4,
                        team: 'Portugal'
                    }).save(function () {

                    }),

                    new teams({
                        teamID: 18,
                        name: '3rd #4',
                        desc: '4th of 3rd place table',
                        deadline: new Date("2016-06-10T19:00:00Z"),
                        predictscore: 4,
                        team: 'Northern Ireland'
                    }).save(function () {

                    }),


                    // *****
                    // Fakes
                    // *****

                    // Test match:
                    new matches({
                        matchID: 52,
                        team1: 'T1',
                        team2: 'T2',
                        kickofftime: new Date("2016-05-01T19:00:00Z"),
                        winner: 'T1',
                        team1score: '2',
                        team2score: '1',
                        goaldiff: '1',
                        firstscore: 'T2'

                    }).save(function (err) {
                    }),

                    new teams({
                        teamID: 19,
                        name: 'Test',
                        desc: 'Test',
                        deadline: new Date("2016-05-01T19:00:00Z"),
                        predictscore: 0,
                        team: 'T1'
                    }).save(function () {

                    })

                ]).spread(function () {
                    deferred.resolve({});
                })
            })
        });

        return deferred.promise;
    }
};