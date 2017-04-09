// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
// "use strict"

//var ad = initMap;
"use strict"
function aj(address) {
  $.ajax({
    type: "GET",
    url: "/getyelp",
    success: function(response) {
      //console.log(response);
      myTable(response);
    }
  });
}


function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.0730520, lng: -89.4012300},
    zoom: 6
  });
  var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      //infoWindow.setContent(pos.lat.toString() + ", " + pos.lng.toString());
      map.setCenter(pos);
      var myurl = createdURL(pos);
      
      jQuery.getJSON(myurl, function(data){
        var obj = data;
        var components = obj["results"][1]["address_components"]
        var city;
        var state;

        for (var i = 0; i < components.length; i++){
          if (components[i]["types"][0] == "administrative_area_level_3"){
            city = components[i]["long_name"]
          }
          if (components[i]["types"][0] == "administrative_area_level_1"){
            state = components[i]["short_name"]
          }
        }
        infoWindow.setContent(city.toString() + ", " + state.toString());
        var currentAddress = [city, state]
        aj(currentAddress);
        //return currentAddress;
      });



    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}


function createdURL(position) {
  var scr="https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.lat.toString() + "," + position.lng.toString() + "&key=AIzaSyB53IsIPLZZPcrCEnGcwic669QjadSgCIU"
  
  return scr;
}



