/**
 * Created by I305845 on 22/05/2016.
 */
/*
All Dates should be 2 hours before France time (UTC time)
 */
module.exports = {
    insertData: function (matches, teams) {
        // remove all:
        matches.remove().exec();
        teams.remove().exec();

        // insert matches data:
        new matches({
            matchID: 1,
            team1: 'France',
            team2: 'Romania',
            kickofftime: new Date("2016-05-10T19:14:00Z"),

            // fakes for testing:
            winner: 'France',
            team1score: '3',
            team2score: '1',
            goaldiff: '2',
            firstscore: 'Romania'
        }).save(function (err) {
        });
        new matches({
            matchID: 2,
            team1: 'Albania',
            team2: 'Switzerland',
            kickofftime: new Date("2016-06-11T11:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 3,
            team1: 'Wales',
            team2: 'Slovakia',
            kickofftime: new Date("2016-06-11T16:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 4,
            team1: 'England',
            team2: 'Russia',
            kickofftime: new Date("2016-06-11T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 5,
            team1: 'Turkey',
            team2: 'Croatia',
            kickofftime: new Date("2016-06-12T13:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 6,
            team1: 'Poland',
            team2: 'Northern Ireland',
            kickofftime: new Date("2016-06-12T16:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 7,
            team1: 'Germany',
            team2: 'Ukraine',
            kickofftime: new Date("2016-06-12T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 8,
            team1: 'Spain',
            team2: 'Czech Republic',
            kickofftime: new Date("2016-06-13T13:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 9,
            team1: 'Republic of Ireland',
            team2: 'Sweden',
            kickofftime: new Date("2016-06-13T16:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 10,
            team1: 'Belgium',
            team2: 'Italy',
            kickofftime: new Date("2016-06-13T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 11,
            team1: 'Austria',
            team2: 'Hungary',
            kickofftime: new Date("2016-06-14T16:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 12,
            team1: 'Portugal',
            team2: 'Iceland',
            kickofftime: new Date("2016-06-14T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 13,
            team1: 'Russia',
            team2: 'Slovakia',
            kickofftime: new Date("2016-06-15T13:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 14,
            team1: 'Romania',
            team2: 'Switzerland',
            kickofftime: new Date("2016-06-15T16:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 15,
            team1: 'France',
            team2: 'Albania',
            kickofftime: new Date("2016-06-15T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 16,
            team1: 'England',
            team2: 'Wales',
            kickofftime: new Date("2016-06-16T13:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 17,
            team1: 'Ukraine',
            team2: 'Northern Ireland',
            kickofftime: new Date("2016-06-16T16:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 18,
            team1: 'Germany',
            team2: 'Poland',
            kickofftime: new Date("2016-06-16T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 19,
            team1: 'Italy',
            team2: 'Sweden',
            kickofftime: new Date("2016-06-17T13:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 20,
            team1: 'Czech Republic',
            team2: 'Croatia',
            kickofftime: new Date("2016-06-17T16:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 21,
            team1: 'Spain',
            team2: 'Turkey',
            kickofftime: new Date("2016-06-17T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 22,
            team1: 'Belgium',
            team2: 'Republic of Ireland',
            kickofftime: new Date("2016-06-18T13:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 23,
            team1: 'Iceland',
            team2: 'Hungary',
            kickofftime: new Date("2016-06-18T16:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 24,
            team1: 'Portugal',
            team2: 'Austria',
            kickofftime: new Date("2016-06-18T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 25,
            team1: 'Romania',
            team2: 'Albania',
            kickofftime: new Date("2016-06-19T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 26,
            team1: 'Switzerland',
            team2: 'France',
            kickofftime: new Date("2016-06-19T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 27,
            team1: 'Russia',
            team2: 'Wales',
            kickofftime: new Date("2016-06-20T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 28,
            team1: 'Slovakia',
            team2: 'England',
            kickofftime: new Date("2016-06-20T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 29,
            team1: 'Ukraine',
            team2: 'Poland',
            kickofftime: new Date("2016-06-21T16:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 30,
            team1: 'Northern Ireland',
            team2: 'Germany',
            kickofftime: new Date("2016-06-21T16:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 31,
            team1: 'Czech Republic',
            team2: 'Turkey',
            kickofftime: new Date("2016-06-21T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 32,
            team1: 'Croatia',
            team2: 'Spain',
            kickofftime: new Date("2016-06-21T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 33,
            team1: 'Iceland',
            team2: 'Austria',
            kickofftime: new Date("2016-06-22T16:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 34,
            team1: 'Hungary',
            team2: 'Portugal',
            kickofftime: new Date("2016-06-22T16:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 35,
            team1: 'Italy',
            team2: 'Republic of Ireland',
            kickofftime: new Date("2016-06-22T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 36,
            team1: 'Sweden',
            team2: 'Belgium',
            kickofftime: new Date("2016-06-22T19:00:00Z")
        }).save(function (err) {
        });

        // playoffs
        new matches({
            matchID: 37,
            team1: 'A2',
            team2: 'C2',
            kickofftime: new Date("2016-06-25T13:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 38,
            team1: 'B1',
            team2: 'ACD3',
            kickofftime: new Date("2016-06-25T16:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 39,
            team1: 'D1',
            team2: 'BEF3',
            kickofftime: new Date("2016-06-25T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 40,
            team1: 'A1',
            team2: 'CDE3',
            kickofftime: new Date("2016-06-26T13:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 41,
            team1: 'C1',
            team2: 'ABF3',
            kickofftime: new Date("2016-06-26T16:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 42,
            team1: 'F1',
            team2: 'E2',
            kickofftime: new Date("2016-06-26T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 43,
            team1: 'E1',
            team2: 'D2',
            kickofftime: new Date("2016-06-27T16:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 44,
            team1: 'B2',
            team2: 'F2',
            kickofftime: new Date("2016-06-27T19:00:00Z")
        }).save(function (err) {
        });

        // Q-Finals
        new matches({
            matchID: 45,
            team1: 'W37',
            team2: 'W39',
            kickofftime: new Date("2016-06-30T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 46,
            team1: 'W38',
            team2: 'W42',
            kickofftime: new Date("2016-07-01T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 47,
            team1: 'W41',
            team2: 'W43',
            kickofftime: new Date("2016-07-02T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 48,
            team1: 'W40',
            team2: 'W44',
            kickofftime: new Date("2016-07-03T19:00:00Z")
        }).save(function (err) {
        });

        // S-Final
        new matches({
            matchID: 49,
            team1: 'W45',
            team2: 'W46',
            kickofftime: new Date("2016-06-10T19:00:00Z")
        }).save(function (err) {
        });
        new matches({
            matchID: 50,
            team1: 'W47',
            team2: 'W48',
            kickofftime: new Date("2016-07-07T19:00:00Z")
        }).save(function (err) {
        });
        // Final
        new matches({
            matchID: 51,
            team1: 'W49',
            team2: 'W50',
            kickofftime: new Date("2016-07-10T19:00:00Z")
        }).save(function (err) {
        });

        // insert teams data:
        new teams({
            teamID: 1,
            name: 'Champion',
            deadline: new Date("2016-06-10T19:00:00Z"),
            predictscore: 16

            // fakes for testing:
            ,team: 'France'

        }).save(function (err) {
        });
        new teams({
            teamID: 2,
            name: 'Runner up',
            deadline: new Date("2016-06-10T19:00:00Z"),
            predictscore: 8
        }).save(function (err) {
        });
        new teams({
            teamID: 3,
            name: 'A1',
            deadline: new Date("2016-06-10T19:00:00Z"),
            predictscore: 4
        }).save(function (err) {
        });
        new teams({
            teamID: 4,
            name: 'A2',
            deadline: new Date("2016-06-10T19:00:00Z"),
            predictscore: 4
        }).save(function (err) {
        });
        new teams({
            teamID: 5,
            name: 'B1',
            deadline: new Date("2016-06-10T19:00:00Z"),
            predictscore: 4
        }).save(function (err) {
        });
        new teams({
            teamID: 6,
            name: 'B2',
            deadline: new Date("2016-06-10T19:00:00Z"),
            predictscore: 4
        }).save(function (err) {
        });
        new teams({
            teamID: 7,
            name: 'C1',
            deadline: new Date("2016-06-10T19:00:00Z"),
            predictscore: 4
        }).save(function (err) {
        });
        new teams({
            teamID: 8,
            name: 'C2',
            deadline: new Date("2016-06-10T19:00:00Z"),
            predictscore: 4
        }).save(function (err) {
        });
        new teams({
            teamID: 9,
            name: 'D1',
            deadline: new Date("2016-06-10T19:00:00Z"),
            predictscore: 4
        }).save(function (err) {
        });
        new teams({
            teamID: 10,
            name: 'D2',
            deadline: new Date("2016-06-10T19:00:00Z"),
            predictscore: 4
        }).save(function (err) {
        });
        new teams({
            teamID: 11,
            name: 'E1',
            deadline: new Date("2016-06-10T19:00:00Z"),
            predictscore: 4
        }).save(function (err) {
        });
        new teams({
            teamID: 12,
            name: 'E2',
            deadline: new Date("2016-06-10T19:00:00Z"),
            predictscore: 4
        }).save(function (err) {
        });
        new teams({
            teamID: 13,
            name: 'E3',
            deadline: new Date("2016-06-10T19:00:00Z"),
            predictscore: 4
        }).save(function (err) {
        });
    }
};