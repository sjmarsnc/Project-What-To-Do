var projectAPIKey = "200651509-b2d4e44c77d481408ef6c9b2624e924c";
var activity = pageActivity;

function displayResults() {
  $("#result-dump").empty();

  var city = $(".cityInput").val().trim();

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

