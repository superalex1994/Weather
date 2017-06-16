/**
 * Created by Alex on 6/12/17.
 */

$(function(){
    var searchHistory = [];
    var geocoder = new google.maps.Geocoder();
    var apicall = 'https://api.darksky.net/forecast/1b01c4d5b209f51a9f168138c75a1b5b/';

    function getCoordinates (address, callback){
        var coordinates;
        geocoder.geocode({ address: address}, function (results, status) {
            coords_obj = results[0].geometry.location;
            coordinates = [coords_obj.lat(),coords_obj.lng()];
            callback(coordinates);
        });
    }

    function getDatetimeFromUNIX(timestamp){
        return new Date(timestamp * 1000);
    }

    function displayCurrentWeather(current_data){
        var degree = Math.round(parseFloat(current_data.temperature));
        $('.circle').show();
        $('#currentTemp').text(degree + '\u2109');
        $('#currentSummary').text(current_data.summary);
    }

    function displayFutureWeather(daily_data, days){
        $('#future').show();
        for (var i = 0; i < days; i++) {
            var dayDiv = 'futureDay' + (i + 1);
            var hiTempDiv = 'futureHiTemp' + (i + 1);
            var lowTempDiv = 'futureLowTemp' + (i + 1);
            var sumDiv = 'futureSum' + (i + 1);

            var time = getDatetimeFromUNIX(daily_data[i].time);
            var dayOfWeek = time.toDateString().split(' ')[0];
            var hiTemp = daily_data[i].temperatureMax;
            var lowTemp = daily_data[i].temperatureMin;
            var sum = daily_data[i].summary;

            $('#' + dayDiv).text(dayOfWeek);
            $('#' + hiTempDiv).text(hiTemp + '\u2109');
            $('#' + lowTempDiv).text(lowTemp + '\u2109');
            $('#' + sumDiv).text(sum)
        }
    }

    $(document).ready(function() {

        $('#submitButton').click(function(){
            var address = $('#searchTxt').val();
            getCoordinates(address, function(coords) {
                var json_url = apicall + coords[0] + ',' + coords[1];
                $.ajax({
                    url: json_url,
                    dataType: 'jsonp',
                    success: function(data){
                        searchHistory.push(address);
                        displayCurrentWeather(data.currently);
                        displayFutureWeather(data.daily.data, 5);
                    }
                });

            })
        })

    })

});
