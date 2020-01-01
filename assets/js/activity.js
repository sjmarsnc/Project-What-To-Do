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
      else { qualityParm = 'distance';}
    }

    if (activity === 'hiking') {
       queryURL = "https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + lon + 
             "&sort=" + qualityParm + "&maxDistance=" + maxDistance + "&maxResults=" + maxResults + "&key=200651509-b2d4e44c77d481408ef6c9b2624e924c";  
    }
    else if (activity === 'biking')  { 
       queryURL = "https://www.mtbproject.com/data/get-trails?lat=" + lat + "&lon=" + lon + 
            "&sort=" + qualityParm + "&maxDistance="+ maxDistance +"&maxResults=" + maxResults + "&key=200651509-b2d4e44c77d481408ef6c9b2624e924c"
    }
    else if (activity === 'camping') {
       queryURL = "https://www.hikingproject.com/data/get-campgrounds?lat=" + lat + "&lon=" + lon + 
             "&sort=distance&maxDistance="+ maxDistance +"&maxResults=" + maxResults + "&key=200651509-b2d4e44c77d481408ef6c9b2624e924c"
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

    var result = $("<div class='trailDiv'>");
    result.attr("onclick", "cardClick('" + resultsArray[j].url + "')");

    // var result = $("<div class='trailDiv' data-id='" + resultsArray[j].id +
    //     "' data-url='" + resultsArray[j].url + "'>");
    var resultName = resultsArray[j].name;
    var resultHeading = $("<h4>").text(resultName);
    result.append(resultHeading);

    var resultImg; 
    if (activity === 'camping') {
      resultImg = $("<p><img src=" + resultsArray[j].imgUrl + "></p>");
    } 
    else {
      resultImg = $("<p><img src=" + resultsArray[j].imgSmall + "></p>");
    }
    result.append(resultImg);

    var resultLocation = $("<p class='location'>").text(resultsArray[j].location);
    result.append(resultLocation);

    var resultSummary = resultsArray[j].summary;
    var resultSummaryP = $("<p>").text(resultSummary);
    result.append(resultSummaryP);

    var faveBtn = $("<i>").attr("class", " wave-effect waves-teal  faveBtn");
    faveBtn.attr("onclick", "faveClick('" + resultsArray[j].id + "','" + activity + "')");
    faveBtn.text("Fave!");
    result.append(faveBtn);

    // var hikingLink = resultsArray[j].url;
    // var hikingLinkP = $("<a target='_blank' href=" + hikingLink + "> click here to see more!</a>")
    // trail.append(hikingLinkP);

    // favoriteAdd = $("<div class='switch'><br><label class='white-text'>Favorite<input type='checkbox'><span class='lever'></span></label></div>");
    // trail.append(favoriteAdd);

    //  var addFav = $("<p class='add-favorite'>Add to Favorites! <i class='far fa-star'></i></p>");
    //  trail.append(addFav);

    $("#result-dump").append(result);
    $(".cityInput").val("");
  }

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

function cardClick(detailURL) {
  // var detailURL = $(this).attr("data-url"); 
  console.log(detailURL);
  window.open(detailURL, "_blank");
}

function getFaves(type) {
  if (type === "hiking") {
    return toDoFavorites.hiking.toString();
  }
  else if (type === "biking") {
    return toDoFavorites.biking.toString();
  }
  else if (type === "camping") {
    return toDoFavorites.camping.toString();
  }
  // make call to API here?  
}

$("#searchSubmit").on("click", function (event) {
  event.preventDefault();
  displayResults();
});

$(document).ready(function () {
  $('.sidenav').sidenav();
  $(".dropdown-trigger").dropdown();
  getStoredFavorites();

});

