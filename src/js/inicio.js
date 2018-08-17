var map
var infoWindow;
function initMap() {
  var inputText = document.querySelector("input");
  var santiago = { lat: -33.437, lng: -70.6506 };
  map = new google.maps.Map(document.getElementById('map'), {
    center: santiago,
    zoom: 12
  });
  infoWindow = new google.maps.InfoWindow;
  service = new google.maps.places.PlacesService(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      inputText.addEventListener("keypress", (event) => {
        let key = event.which || event.keyCode;
        if (key === 13) {
          var textSearch1 = inputText.value;
          console.log(textSearch1)
          inputText.value = "";
          var request = {
            location: pos,
            radius: '5',
            query: textSearch1
          };
          service.textSearch(request, callback);
        }
      })

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.setContent(place.name);
    infoWindow.open(map, this);
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}




