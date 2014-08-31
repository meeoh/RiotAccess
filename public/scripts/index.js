$(document).ready(function() {


    $('.home-content').hide();
    $('.home-content').fadeIn(2500);

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


    $('.run').on('click', function() {

        $('.response_box').empty();

        var f2p;
        if ($('.no').hasClass('active')) {        	
            f2p = false;
        }
        else if ($('.yes').hasClass('active')) {        	
        	f2p = true;
        }
        else {
        	$('.no, .yes').addClass('incorrect');
        	$('.yesnolabel').text("Please choose Yes or No");

        	return;
        }

        $.getJSON('https://na.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=2e4c2a5b-9c15-425f-80e3-7b54b2cf07d8', function(data) {

            var all_champs = data.data;



            var found = false;
            var apicall;

            if (f2p){
            	apicall = 'https://na.api.pvp.net/api/lol/na/v1.2/champion?freeToPlay=true&api_key=2e4c2a5b-9c15-425f-80e3-7b54b2cf07d8';
            }
            else{
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
    })




});
