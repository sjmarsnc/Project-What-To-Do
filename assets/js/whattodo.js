$(document).ready(function () {
     $('.datepicker').datepicker(); 
})

document.addEventListener('DOMContentLoaded', function () {
var checkbox = document.querySelector('input[type="checkbox"]');

    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            imperialUnit();
            console.log ("Imperial")
        } else {
            metricUnit();
        console.log("Metric");
        }
    });
});

var APIKey = "92ce17e1323ad237fdf4a085b335d5bf";
      
     var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Raleigh&units=imperial&appid=" + APIKey;
     var metricqueryURL = "https://api.openweathermap.org/data/2.5/weather?q=Raleigh&units=metric&appid=" + APIKey;

function imperialUnit() {
     $.ajax({
     url: queryURL,
     method: "GET"
     })
     
     .then(function(response) {

     console.log(queryURL);

     console.log(response);

     $("#wind").text("Wind Speed: " + response.wind.speed + " mph");
     $("#humidity").text("Humidity: " + response.main.humidity + "%");
     $("#temperature").text("Temperature: " + response.main.temp + "F");
     });
}

function metricUnit() {
    $.ajax({
    url: metricqueryURL,
    method: "GET"
    })
    
    .then(function(response) {

    console.log(queryURL);

    console.log(response);

    $("#wind").text("Wind Speed: " + response.wind.speed + " m/s");
    $("#humidity").text("Humidity: " + response.main.humidity + "%");
    $("#temperature").text("Temperature: " + response.main.temp + "c");
    });
}