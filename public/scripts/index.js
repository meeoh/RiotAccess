$(document).ready(function() {

    $('.home-content').hide();
    $('.home-content').fadeIn(2500);
    $('.response').hide();

    $('.all_champ_prompt').on('click', function() {
        $('.response_box').empty();
        $('.champ_by_id_response').fadeOut(500);
        $('.all_champ_response').fadeIn(1000);
    });


    $('.champ_id_prompt').on('click', function() {
        $('.champ_id_response_box').empty();
        $('.input_box').val('');
        $('.all_champ_response').fadeOut(1000);
        $('.champ_by_id_response').fadeIn(1000);

    });

    $('.yes').on('click', function() {
        $('.no, .yes').removeClass('incorrect');
        $('.yesnolabel').empty();
        $(this).addClass('active');
        $('.no').removeClass('active');

    });

    $('.no').on('click', function() {
        $('.no, .yes').removeClass('incorrect');
        $('.yesnolabel').empty()
        $(this).addClass('active');
        $('.yes').removeClass('active');

    });

    var allchamps;

    $('.champ_by_id_run').on('click', function() {

        var userChamp = $('.input_box').val();

        userChamp = userChamp.toLowerCase();

        if (userChamp == "wukong") {
            userChamp = "monkeyking";
        }

        var id = false,
            champ_name;

        $.getJSON('https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=2e4c2a5b-9c15-425f-80e3-7b54b2cf07d8', function(data) {

            var all_champs = data.data;

            for (var hero in all_champs) {
                if (userChamp == all_champs[hero].key.toLowerCase()) {
                    id = all_champs[hero].id;
                    champ_name = all_champs[hero].name;
                    console.log(id);
                    break;
                }
            }

            if (!id) {
                $('.input_box').addClass('incorrect');
                $('.champ_id_label').text("Please enter a valid champion name");
                return;
            }

            $.getJSON('https://na.api.pvp.net/api/lol/na/v1.2/champion/' + id + '?api_key=2e4c2a5b-9c15-425f-80e3-7b54b2cf07d8', function(res) {
                $('.champ_id_label').empty();
                $('.champ_id_response_box').empty();

                $('.input_box').removeClass('incorrect');

                allchamps = data;
                var champ = "<h1> Champion: " + champ_name + "</h1><h4>Enabled In Ranked: " + res.rankedPlayEnabled + "</h4>" + "<h4>Enabled For Bots To Play: " +
                    res.botEnabled + "</h4>" + "<h4>Active: " + res.active + "</h4>" + "<h4>Free to play: " + res.freeToPlay + "</h4>";

                $('.champ_id_response_box').append(champ);
            });
        });
    });


    $('.run').on('click', function() {

        $('.response_box').empty();

        var f2p;
        if ($('.no').hasClass('active')) {
            f2p = false;
        } else if ($('.yes').hasClass('active')) {
            f2p = true;
        } else {
            $('.no, .yes').addClass('incorrect');
            $('.yesnolabel').text("Please choose Yes or No");

            return;
        }

        $.getJSON('https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=2e4c2a5b-9c15-425f-80e3-7b54b2cf07d8', function(data) {

            var all_champs = data.data;
            var found = false;
            var apicall;

            if (f2p) {
                apicall = 'https://na.api.pvp.net/api/lol/na/v1.2/champion?freeToPlay=true&api_key=2e4c2a5b-9c15-425f-80e3-7b54b2cf07d8';
            } else {
                apicall = 'https://na.api.pvp.net/api/lol/na/v1.2/champion?api_key=2e4c2a5b-9c15-425f-80e3-7b54b2cf07d8';
            }

            $.getJSON(apicall, function(data) {



                var champs = data.champions;


                for (i = 0; i < champs.length; ++i) {


                    for (var hero in all_champs) {
                        if (champs[i].id == all_champs[hero].id) {
                            var champ_name = all_champs[hero].name;
                            break;
                        }
                    }

                    var champ = "<h1> Champion: " + champ_name + "</h1><h4>Enabled In Ranked: " + champs[i].rankedPlayEnabled + "</h4>" + "<h4>Enabled For Bots To Play: " +
                        champs[i].botEnabled + "</h4>" + "<h4>Active: " + champs[i].active + "</h4>" + "<h4>Free to play: " + champs[i].freeToPlay + "</h4>";

                    $('.response_box').append(champ);

                }
            });

        });
    });


    $('.game_run').on('click', function() {

        var summ_name = $('.input_box_game').val();
        var riot_summ_name;

        $.getJSON('https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + summ_name + '?api_key=2e4c2a5b-9c15-425f-80e3-7b54b2cf07d8', function(data) {

            riot_summ_name = data[summ_name].name;
            var summ_id = data[summ_name].id;
            console.log(summ_id);

            $.getJSON('https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/' + summ_id + '/recent?api_key=2e4c2a5b-9c15-425f-80e3-7b54b2cf07d8', function(res) {


                //fellowPlayers Section
                var playersList = "<ul>";

                console.log(res.games[0].fellowPlayers[0].championId);



                for (j = 0; j < res.games[0].fellowPlayers.length; ++j) {

                    var currentGame = res.games[0];

                    playersList = playersList + "<li><p>ChampId:" + currentGame.fellowPlayers[j].championId + "</p>" +
                        "<p>teamId: " + currentGame.fellowPlayers[j].teamId + "</p>" +
                        "<p>summonerId: " + currentGame.fellowPlayers[j].summonerId + "</p></li>";

                }

                playersList = playersList + "</ul>";

                console.log(playersList);

                $('.fellowplayers_content').append(playersList).hide().slideDown();


                //Stats Section
                var statsList,
                    stats = res.games[0].stats;

                statsList = "<p>Total Damage Dealt To Champions: " + stats.totalDamageDealtToChampions + "</p>" +
                    "<p>Assists: " + stats.assists + "</p>" +
                    "<p>Inihibitors Killed: " + stats.barracksKilled + "</p>" +
                    "<p>Champions Killed: " + stats.championsKilled + "</p>" +
                    "<p>Comat Player Score: " + stats.combatPlayerScore + "</p>" +
                    "<p>Consumables Purchased: " + stats.consumablesPurchased + "</p>" +
                    "<p>Damage Dealt By Player: " + stats.damageDealtPlayer + "</p>" +
                    "<p>Double Kills: " + stats.doubleKills + "</p>" +
                    "<p>First Blood: " + stats.firstBlood + "</p>" +
                    "<p>Net Worth: " + stats.gold + "</p>" +
                    "<p>Gold Earned: " + stats.goldEarned + "</p>" +
                    "<p>Gold Spent: " + stats.goldSpent + "</p>" +
                    "<p>Items Purchased: " + stats.itemsPurchased + "</p>" +
                    "<p>Killing Sprees: " + stats.killingSprees + "</p>" +
                    "<p>Largest Critical Strike: " + stats.largestCriticalStrike + "</p>" +
                    "<p>Largest Killing Spree: " + stats.largestKillingSpree + "</p>" +
                    "<p>Largest Multi Kill: " + stats.largestMultiKill + "</p>" +
                    "<p>Tier 3 Items Created: " + stats.legendaryItemsCreated + "</p>" +
                    "<p>Level: " + stats.level + "</p>" +
                    "<p>Magic Damage Dealt By Player: " + stats.magicDamageDealtPlayer + "</p>" +
                    "<p>Magic Damage Dealt To Champions: " + stats.magicDamageDealtToChampions + "</p>" +
                    "<p>Magic Damage Taken: " + stats.magicDamageTaken + "</p>" +
                    "<p>Minions Denied: " + stats.minionsDenied + "</p>" +
                    "<p>Minions Killed: " + stats.minionsKilled + "</p>" +
                    "<p>Neutral Minions Killed: " + stats.neutralMinionsKilled + "</p>" +
                    "<p>Neutral Minions Killed Enemy Jungler: " + stats.neutralMinionsKilledEnemyJungle + " times</p>" +
                    "<p>Neutral Minions Killed Friendly Jungler " + stats.neutralMinionsKilledYourJungle + " times</p>" +
                    "<p>Nexus Killing Blow: " + stats.nexusKilled + "</p>" +
                    "<p>Node Captures: " + stats.nodeCapture + "</p>" +
                    "<p>Node Capture Assists: " + stats.nodeCaptureAssist + "</p>" +
                    "<p>Node Neutralize: " + stats.nodeNeutralize + "</p>" +
                    "<p>Node Neutralize Assist: " + stats.nodeNeutralizeAssist + "</p>" +
                    "<p>Number Of Deaths: " + stats.numDeaths + "</p>" +
                    "<p>Number Of Items Bought: " + stats.numItemsBought + "</p>" +
                    "<p>Objective Player Score: " + stats.objectivePlayerScore + "</p>" +
                    "<p>PentaKills: " + stats.pentaKills + "</p>" +
                    "<p>Physical Damabe Dealt By Player: " + stats.physicalDamageDealtPlayer + "</p>" +
                    "<p>Physical Damage Dealt To Champions: " + stats.physicalDamageDealtToChampions + "</p>" +
                    "<p>Physical Damage Taken: " + stats.physicalDamageTaken + "</p>" +
                    "<p>QuadraKills: " + stats.quadraKills + "</p>" +
                    "<p>Sight Wards Bought: " + stats.sightWardsBought + "</p>" +
                    "<p>Super Monsters Killed: " + stats.superMonsterKilled + "</p>" +
                    "<p>Team: " + stats.team + "</p>" +
                    "<p>Team Objective: " + stats.teamObjective + "</p>" +
                    "<p>Time Played: " + stats.timePlayed + "</p>" +
                    "<p>Total Damage Dealt: " + stats.totalDamageDealt + "</p>" +
                    "<p>Total Damage Dealt To Champions: " + stats.totalDamageDealtToChampions + "</p>" +
                    "<p>Total Damage Taken: " + stats.totalDamageTaken + "</p>" +
                    "<p>Total heal: " + stats.totalHeal + "</p>" +
                    "<p>Total Player Score: " + stats.totalPlayerScore + "</p>" +
                    "<p>Total Score Rank: " + stats.totalScoreRank + "</p>" +
                    "<p>Total Time Crowd Control Dealt: " + stats.totalTimeCrowdControlDealt + "</p>" +
                    "<p>Total Units Healed: " + stats.totalUnitsHealed + "</p>" +
                    "<p>TripleKills: " + stats.tripleKills + "</p>" +
                    "<p>True Damage Dealt By Player: " + stats.trueDamageDealtPlayer + "</p>" +
                    "<p>True Damage Dealt To Champions: " + stats.trueDamageDealtToChampions + "</p>" +
                    "<p>True Damage Taken: " + stats.trueDamageTaken + "</p>" +
                    "<p>Turrets Killed: " + stats.turretsKilled + "</p>" +
                    "<p>Victory Point Total: " + stats.victoryPointTotal + "</p>" +
                    "<p>Vision Wards Bought: " + stats.visionWardsBought + "</p>" +
                    "<p>Wards Killed: " + stats.wardKilled + "</p>" +
                    "<p>Wards Placed: " + stats.wardPlaced + "</p>" +
                    "<p>Win: " + stats.win + "</p>";






                $('.stats_content').append(statsList).hide().slideDown();


                //General Section
                var general = res.games[0],
                    generalList;

                 generalList = "<p>Champion: " + general.championId + "</p>" +
                 "<p>Create Date: " + general.createDate + "</p>" +
                 "<p>Game Id: " + general.gameId + "</p>" +
                 "<p>Game Mode: " + general.gameMode + "</p>" +
                 "<p>Game Type: " + general.gameType + "</p>" +
                 "<p>Ip Earned: " + general.ipEarned + "</p>" +
                 "<p>Level: " + general.level + "</p>" +
                 "<p>Map Id: " + general.mapId + "</p>" +
                 "<p>Summoner Spell 1: " + general.spell1 + "</p>" +
                 "<p>Summoner Spell 2: " + general.spell2 + "</p>" +                 
                 "<p>Type: " + general.subType + "</p>" +
                 "<p>TeamId: " + general.teamId    + "</p>" ;

                 $('.general_content').append(generalList).hide().slideDown();


                 








            });


        });





    });


});
