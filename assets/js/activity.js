var projectAPIKey = "200651509-b2d4e44c77d481408ef6c9b2624e924c";
var activity = pageActivity;

function displayResults() {
  $("#result-dump").empty();

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
      // console.log(response);
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

  var faveIcon = "favorite_border"; 
  if (isFave( cardData.id.toString(), activityType) ) {
     faveIcon = "favorite"; 
  }
  var faveBtn = $("<i class=' wave-effect waves-teal faveBtn material-icons' id='fav" 
       + cardData.id + "'>" + faveIcon + "</i>");
  faveBtn.attr("onclick", "faveClick('" + cardData.id + "','" + activityType + "')");
  result.append(faveBtn);

  return result;
}

function cardClick(detailURL) {
  // called when a card is clicked on 
  window.open(detailURL, "_blank");
}


var toDoFavorites;

function getStoredFavorites() {

  var storedFavesAsString = localStorage.getItem("toDoFavorites");
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
  // console.log(toDoFavorites);
}

function saveStoredFavorites() {
  var storedFavesAsString = JSON.stringify(toDoFavorites);
  localStorage.setItem("toDoFavorites", storedFavesAsString);
}

function faveClick(id, type) {

  // come here directly when click on Fave button or heart 

  event.stopPropagation();

  if (type === "hiking") {
    var faveIndex = toDoFavorites.hiking.indexOf(id);
    if (faveIndex === -1) {
      toDoFavorites.hiking.push(id);
      $("#fav"+id).text('favorite');
    }
    else {
      // already in array, need to take it out 
      toDoFavorites.hiking.splice(faveIndex, 1);
      $("#fav"+id).text('favorite_border'); 
    }
  }
  else if (type === "biking") {
    var faveIndex = toDoFavorites.biking.indexOf(id);
    if (faveIndex === -1) {
      toDoFavorites.biking.push(id);
      $("#fav"+id).text('favorite');
    }
    else {
      // already in array, need to take it out 
      toDoFavorites.biking.splice(faveIndex, 1);
      $("#fav"+id).text('favorite_border');
    }
  }
  else if (type === "camping") {
    var faveIndex = toDoFavorites.camping.indexOf(id);
    if (faveIndex === -1) {
      toDoFavorites.camping.push(id);
      $("#fav"+id).text('favorite');
    }
    else {
      // already in array, need to take it out 
      toDoFavorites.camping.splice(faveIndex, 1);
      $("#fav"+id).text('favorite_border');
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
  if (toDoFavorites.biking.length === 0 ) {
    bikingSection.append($("<p>").text("No biking favorites saved."));
  }

  else {

    var bikingFaves = toDoFavorites.biking.toString();
    var bikingURL = "https://www.mtbproject.com/data/get-trails-by-id?ids=" + bikingFaves +
      "&key=" + projectAPIKey;
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
   if (toDoFavorites.camping.length === 0 ) {
     campingSection.append($("<p>").text("No camping favorites saved."));
   }
 
   else {
 
     var campingFaves = toDoFavorites.camping.toString();
     var campingURL = "https://www.hikingproject.com/data/get-trails-by-id?ids=" + campingFaves +
       "&key=" + projectAPIKey;
     // campgrounds cannot be requested by id 
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

