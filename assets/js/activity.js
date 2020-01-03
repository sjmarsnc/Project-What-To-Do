var projectAPIKey = "200651509-b2d4e44c77d481408ef6c9b2624e924c";
var activity = pageActivity;

function displayResults() {
  $("#result-dump").empty();
  $("#weather-dump").empty();

  var city = $(".cityInput").val().trim();

  if (city === '') {
    // Get the modal
  var modal = document.getElementById("myModal");
  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  modal.style.display = "block";
  span.onclick = function() {
    modal.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  }

  var weatherAPIKey = "1e2baac35502ada6a2f1228a812729b7";
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + weatherAPIKey;

  // calling weather api to get lon and lat for hiking call
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    var maxResults = $(".trailRange").val();
    var maxDistance = $(".mileRange").val();
    //testing

//============== forcast day 0 =============================

//forcast 0 title
var forcast0 = $("<div id='forcastDiv'>")
var day0 = moment().add(0, 'days').format("l");
var date0 = $("<h4>").text(day0);
forcast0.append(date0);
//forcast0 icon
var iconCode = response.weather[0].icon; 
var iconURL = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
var forcastIcon0 =$("<p> <img src=" + iconURL + "></p>");
forcast0.append(forcastIcon0);
//forcast0 temperature
var temp0 = ((response.main.temp - 273.15) * 1.8 + 32).toFixed(1);
var forcastTemp0 = $("<p>").text("Temp: " + temp0 + " °F");
forcast0.append(forcastTemp0);
//forcast0 humidity
var humidity0 = response.main.humidity;
var forcastHumidity0 = $("<p>").text("Humidity: " + humidity0 + "%");
forcast0.append(forcastHumidity0);
//appending forcast0 to div
$("#weather-dump").append(forcast0);

    //testing
    if (activity !== 'camping') {
      var qualityRadio = document.getElementById("qualityInput");
      var qualityParm;
      // need to handle camping which doesn't have quality 
      if (qualityRadio.checked) { qualityParm = 'quality'; }
      else { qualityParm = 'distance'; }
    }

    if (activity === 'hiking') {
      queryURL = "https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + lon +
        "&sort=" + qualityParm + "&maxDistance=" + maxDistance + "&maxResults=" + maxResults + "&key=" + projectAPIKey;
    }
    else if (activity === 'biking') {
      queryURL = "https://www.mtbproject.com/data/get-trails?lat=" + lat + "&lon=" + lon +
        "&sort=" + qualityParm + "&maxDistance=" + maxDistance + "&maxResults=" + maxResults + "&key=" + projectAPIKey;
    }
    else if (activity === 'camping') {
      queryURL = "https://www.hikingproject.com/data/get-campgrounds?lat=" + lat + "&lon=" + lon +
        "&sort=distance&maxDistance=" + maxDistance + "&maxResults=" + maxResults + "&key=" + projectAPIKey;
    }

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);
      if (activity === 'camping') {
        buildResults(response.campgrounds);
      }
      else {
        buildResults(response.trails);
      }
    });

    //creating variables to get the 5 day forcast
var countryCode = response.sys.country;
console.log(countryCode);
var queryForcast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "," + countryCode + "&appid=" + weatherAPIKey;
$.ajax({
  url: queryForcast,
  method: "GET"
}).then(function(response) {
   var forcastArr = [];
//getting 1 time slot of the 8 time slots per day, in the response.list, and putting it in the forcastArr     
    for (var i = 0; i < response.list.length; i++) {
     if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
   forcastArr.push(response.list[i]);
    }
}

//==========================================================
//            making forcast divs
//==========================================================
//============== forcast day 1 =============================

//forcast 1 title
var forcast1 = $("<div id='forcastDiv'>")
var day1 = moment().add(1, 'days').format("l");
var date1 = $("<h4>").text(day1);
forcast1.append(date1);
//forcast1 icon
var forcastIconCode1 = forcastArr[0].weather[0].icon;
var forcastIconURL1 = "https://openweathermap.org/img/wn/" + forcastIconCode1 + "@2x.png";
var forcastIcon1 =$("<p> <img src=" + forcastIconURL1 + "></p>");
forcast1.append(forcastIcon1);
//forcast1 temperature
var temp1 = ((forcastArr[0].main.temp - 273.15) * 1.8 + 32).toFixed(1);
var forcastTemp1 = $("<p>").text("Temp: " + temp1 + " °F");
forcast1.append(forcastTemp1);
//forcast1 humidity
var humidity1 = forcastArr[0].main.humidity;
var forcastHumidity1 = $("<p>").text("Humidity: " + humidity1 + "%");
forcast1.append(forcastHumidity1);
//appending forcast1 to div
$("#weather-dump").append(forcast1);
//=============== forcast day two ==========================
var forcast2 = $("<div id='forcastDiv' class='bg-primary'>")
var day2 = moment().add(2, 'days').format("l");
var date2 = $("<h4>").text(day2);
forcast2.append(date2);
//forcast2 icon
var forcastIconCode2 = forcastArr[1].weather[0].icon;
var forcastIconURL2 = "https://openweathermap.org/img/wn/" + forcastIconCode2 + "@2x.png";
var forcastIcon2 =$("<p> <img src=" + forcastIconURL2 + "></p>");
forcast2.append(forcastIcon2);
//forcast2 temperature
var temp2 = ((forcastArr[1].main.temp - 273.15) * 1.8 + 32).toFixed(1);
var forcastTemp2 = $("<p>").text("Temp: " + temp2 + " °F");
forcast2.append(forcastTemp2);
//forcast2 humidity
var humidity2 = forcastArr[1].main.humidity;
var forcastHumidity2 = $("<p>").text("Humidity: " + humidity2 + "%");
forcast2.append(forcastHumidity2);
//appending forcast2 to div
$("#weather-dump").append(forcast2);
//=============== forcast day three ==========================
var forcast3 = $("<div id='forcastDiv' class='bg-primary'>")
var day3 = moment().add(3, 'days').format("l");
var date3 = $("<h4>").text(day3);
forcast3.append(date3);
//forcast3 icon
var forcastIconCode3 = forcastArr[2].weather[0].icon;
var forcastIconURL3 = "https://openweathermap.org/img/wn/" + forcastIconCode3 + "@2x.png";
var forcastIcon3 =$("<p> <img src=" + forcastIconURL3 + "></p>");
forcast3.append(forcastIcon3);
//forcast3 temperature
var temp3 = ((forcastArr[2].main.temp - 273.15) * 1.8 + 32).toFixed(1);
var forcastTemp3 = $("<p>").text("Temp: " + temp3 + " °F");
forcast3.append(forcastTemp3);
//forcast3 humidity
var humidity3 = forcastArr[2].main.humidity;
var forcastHumidity3 = $("<p>").text("Humidity: " + humidity3 + "%");
forcast3.append(forcastHumidity3);
//appending forcast3 to div
$("#weather-dump").append(forcast3);
//=============== forcast day four ==========================
var forcast4 = $("<div id='forcastDiv' class='bg-primary'>")
var day4 = moment().add(4, 'days').format("l");
var date4 = $("<h4>").text(day4);
forcast4.append(date4);
//forcast4 icon
var forcastIconCode4 = forcastArr[3].weather[0].icon;
var forcastIconURL4 = "https://openweathermap.org/img/wn/" + forcastIconCode4 + "@2x.png";
var forcastIcon4 =$("<p> <img src=" + forcastIconURL4 + "></p>");
forcast4.append(forcastIcon4);
//forcast4 temperature
var temp4 = ((forcastArr[3].main.temp - 273.15) * 1.8 + 32).toFixed(1);
var forcastTemp4 = $("<p>").text("Temp: " + temp4 + " °F");
forcast4.append(forcastTemp4);
//forcast4 humidity
var humidity4 = forcastArr[3].main.humidity;
var forcastHumidity4 = $("<p>").text("Humidity: " + humidity4 + "%");
forcast4.append(forcastHumidity4);
//appending forcast4 to div
$("#weather-dump").append(forcast4);
//=============== forcast day five ==========================
var forcast5 = $("<div id='forcastDiv' class='bg-primary'>")
var day5 = moment().add(5, 'days').format("l");
var date5 = $("<h4>").text(day5);
forcast5.append(date5);
//forcast5 icon
var forcastIconCode5 = forcastArr[4].weather[0].icon;
var forcastIconURL5 = "https://openweathermap.org/img/wn/" + forcastIconCode5 + "@2x.png";
var forcastIcon5 =$("<p> <img src=" + forcastIconURL5 + "></p>");
forcast5.append(forcastIcon5);
//forcast5 temperature
var temp5 = ((forcastArr[4].main.temp - 273.15) * 1.8 + 32).toFixed(1);
var forcastTemp5 = $("<p>").text("Temp: " + temp5 + " °F");
forcast5.append(forcastTemp5);
//forcast5 humidity
var humidity5 = forcastArr[4].main.humidity;
var forcastHumidity5 = $("<p>").text("Humidity: " + humidity5 + "%");
forcast5.append(forcastHumidity5);
//appending forcast5 to div
$("#weather-dump").append(forcast5);

 });

  });
}

function buildResults(resultsArray) {

  for (var j = 0; j < resultsArray.length; j++) {

    var newCard = makeCard(resultsArray[j], activity);

    $("#result-dump").append(newCard);
    $(".cityInput").val("");
  }

}

function makeCard(cardData, activityType) {
  // common to all types of cards 
  var result = $("<div class='cardDiv'>");
  result.attr("onclick", "cardClick('" + cardData.url + "')");

  // var resultName = cardData.name;
  var resultHeading = $("<h4>").text(cardData.name);
  result.append(resultHeading);

  if (activityType === 'biking' || activityType === 'hiking') {
    var resultImg = $("<p><img src=" + cardData.imgSmall + "></p>");
  }
  else if (activityType === 'camping') {
    var resultImg = $("<p><img src=" + cardData.imgUrl + "></p>");
  }
  result.append(resultImg);

  var resultLocation = $("<p class='location'>").text(cardData.location);
  result.append(resultLocation);

  if (activityType === 'biking' || activityType === 'hiking') {
    var resultSummary = cardData.summary;
    var resultSummaryP = $("<p>").text(resultSummary);
    result.append(resultSummaryP);
  }
  else if (activityType === 'camping') {
    result.append($("<p>Number of campsites: " + cardData.numCampsites + "</p>"));
  }

  var faveBtn = $("<i>").attr("class", " wave-effect waves-teal  faveBtn");
  faveBtn.attr("onclick", "faveClick('" + cardData.id + "','" + activityType + "')");
  faveBtn.text("Fave!");
  result.append(faveBtn);

  return result;
}

function cardClick(detailURL) {
  // called when a card is clicked on 
  console.log(detailURL);
  window.open(detailURL, "_blank");
}


var toDoFavorites;

function getStoredFavorites() {

  var storedFavesAsString = localStorage.getItem("toDoFavorites");
  console.log(storedFavesAsString);
  if (storedFavesAsString === null) {
    toDoFavorites = {
      hiking: [],
      biking: [],
      camping: []
    };
  }
  else {
    toDoFavorites = JSON.parse(storedFavesAsString);
  }
  console.log(toDoFavorites);
}

function saveStoredFavorites() {
  var storedFavesAsString = JSON.stringify(toDoFavorites);
  localStorage.setItem("toDoFavorites", storedFavesAsString);
}

function faveClick(id, type) {

  // come here directly when click on Fave button or heart 

  event.stopPropagation();
  console.log(type);

  if (type === "hiking") {
    var isFave = toDoFavorites.hiking.indexOf(id);
    if (isFave === -1) {
      toDoFavorites.hiking.push(id);
    }
    else {
      // already in array, need to take it out 
      toDoFavorites.hiking.splice(isFave, 1);
    }
  }
  else if (type === "biking") {
    var isFave = toDoFavorites.biking.indexOf(id);
    if (isFave === -1) {
      toDoFavorites.biking.push(id);
    }
    else {
      // already in array, need to take it out 
      toDoFavorites.biking.splice(isFave, 1);
    }
  }
  else if (type === "camping") {
    var isFave = toDoFavorites.camping.indexOf(id);
    if (isFave === -1) {
      toDoFavorites.camping.push(id);
    }
    else {
      // already in array, need to take it out 
      toDoFavorites.camping.splice(isFave, 1);
    }
  }
  saveStoredFavorites();
}

function isFave(id, activityType) {
  // returns true or false for whether this id is a saved favorite
  if (activityType === 'hiking' && toDoFavorites.hiking.indexOf(id) > -1) {
    return true;
  }
  else if (activityType === 'biking' && toDoFavorites.biking.indexOf(id) > -1) {
    return true;
  }
  if (activityType === 'camping' && toDoFavorites.camping.indexOf(id) > -1) {
    return true;
  }
  return false;
}

function getFaves(activityType) {
  if (activityType === "hiking") {
    return toDoFavorites.hiking.toString();
  }
  else if (activityType === "biking") {
    return toDoFavorites.biking.toString();
  }
  else if (activityType === "camping") {
    return toDoFavorites.camping.toString();
  }
  // make call to API here?  
}

$("#searchSubmit").on("click", function (event) {
  event.preventDefault();
  displayResults();
});

function buildFavePage() {

  var newCard; 

  // load hiking faves 

  var hikingSection = $("#trail-dump");
  if (toDoFavorites.hiking.length === 0) {
    hikingSection.append($("<p>No hiking favorites saved."));
  }

  else {

    var hikingFaves = toDoFavorites.hiking.toString();
    var hikingURL = "https://www.hikingproject.com/data/get-trails-by-id?ids=" + hikingFaves +
      "&key=" + projectAPIKey;
    console.log(hikingURL); 
    $.ajax({
      url: hikingURL,
      method: "GET"
    }).then(function (response) {

      // var hikingSection = $("#hike-dump");

      for (var i = 0; i < response.trails.length; i++) {
        newCard = makeCard(response.trails[i], 'hiking'); 
        hikingSection.append(newCard);
      }
    })
   }

    // load biking faves 

  var bikingSection = $("#bike-dump");
  console.log("length of biking section: " + toDoFavorites.biking.length); 
  if (toDoFavorites.biking.length === 0 ) {
    bikingSection.append($("<p>").text("No biking favorites saved."));
  }

  else {

    var bikingFaves = toDoFavorites.biking.toString();
    var bikingURL = "https://www.mtbproject.com/data/get-trails-by-id?ids=" + bikingFaves +
      "&key=" + projectAPIKey;
    console.log(bikingURL); 
    $.ajax({
      url: bikingURL,
      method: "GET"
    }).then(function (response) {

      // var bikingSection = $("#biking-dump");

      for (var i = 0; i < response.trails.length; i++) {
        newCard = makeCard(response.trails[i], 'biking'); 
        bikingSection.append(newCard);
      }
    })
   }

   // load camping faves 

   var campingSection = $("#camp-dump");
   console.log("length of camping section: " + toDoFavorites.camping.length); 
   if (toDoFavorites.camping.length === 0 ) {
     campingSection.append($("<p>").text("No camping favorites saved."));
   }
 
   else {
 
     var campingFaves = toDoFavorites.camping.toString();
     var campingURL = "https://www.hikingproject.com/data/get-trails-by-id?ids=" + campingFaves +
       "&key=" + projectAPIKey;
     console.log(campingURL); 
     $.ajax({
       url: campingURL,
       method: "GET"
     }).then(function (response) {
 
       // var campingSection = $("#camping-dump");
 
       for (var i = 0; i < response.campgrounds.length; i++) {
         newCard = makeCard(response.campgrounds[i], 'camping'); 
         campingSection.append(makeCard(newCard, 'camping'));
       }
     })
    }
}

$(document).ready(function () {
  $('.sidenav').sidenav();
  $(".dropdown-trigger").dropdown();
  getStoredFavorites();
  if (pageActivity === 'favorites') {
    buildFavePage();
  }

});

