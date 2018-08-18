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
var modal_localName="";
var modal_localAddress="";
var modal_localPhoto="";

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.setContent(place.name);  
    console.log(place.types) 
    infoWindow.open(map, this);
    modal_localName=place.name
    modal_localAddress=place.formatted_address
    modal_localPhoto=place.photos[0].getUrl({"maxWidth":400, "maxHeight":400})   
    $('#exampleModalCenter').modal("show")  
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

$('#exampleModalCenter').on('show.bs.modal', function(event) {
  var card = $(event.relatedTarget) 
  var localName = modal_localName
  var localAddress= modal_localAddress
  var localPhoto= modal_localPhoto
  var modal = $(this)
  modal.find(".modal-name").text("Nombre restaurant: " + localName)
  modal.find(".modal-address").text("Dirección: " + localAddress)
  modal.find(".modal-photo").attr("src", localPhoto)
 
}) 







