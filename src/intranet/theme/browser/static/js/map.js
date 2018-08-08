/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function createContent(barruan) {
  var contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h1 id="firstHeading" class="firstHeading">Auzotaxi Zerbitzua</h1>' +
    '<div id="bodyContent">';
  if (!barruan) {
    contentString = contentString + "<p><b>Auzotaxiren eremuan dago</b></p>";
  } else {
    contentString =
      contentString + "<p><b>Auzotaxiren eremutik kanpo dago</b></p>";
  }
  contentString = contentString + "</div></div>";
  return contentString;
}

function initMap() {
  $.ajaxSetup({
    cache: false
  });
  var latitudea = parseFloat(
    document.getElementById("map").getAttribute("data-lat")
  );
  var longitudea = parseFloat(
    document.getElementById("map").getAttribute("data-lng")
  );
  var var_location = new google.maps.LatLng(latitudea, longitudea);

  var var_mapoptions = {
    center: var_location,
    zoom: 14,
    scrollwheel: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var marker = new google.maps.Marker({
    position: var_location,
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP
  });

  //    var acOptions = {
  //        types: ['establishment']
  //    };
  //    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),acOptions);
  //    autocomplete.bindTo('bounds',map);

  var map = new google.maps.Map(document.getElementById("map"), var_mapoptions);
  // helbide horretatik borratu dut oraingoz.

  marker.setMap(map);
  var xml = null;

  var kml = document.getElementById("map").getAttribute("data-kml");
  getCoordsFromKML(kml + "?" + $.now(), map, marker);
}

function localizar(elemento, direccion) {
  $.ajaxSetup({
    cache: false
  });
  var latitudea = parseFloat(
    document.getElementById("map").getAttribute("data-lat")
  );
  var longitudea = parseFloat(
    document.getElementById("map").getAttribute("data-lng")
  );
  var var_location = new google.maps.LatLng(latitudea, longitudea);

  var geocoder = new google.maps.Geocoder();
  var map = new google.maps.Map(elemento, {
    zoom: 14,
    scrollwheel: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    draggable: true
  });

  geocoder.geocode({ address: direccion }, function(results, status) {
    if (status === "OK") {
      var resultados = results[0].geometry.location,
        resultados_lat = resultados.lat(),
        resultados_long = resultados.lng();

      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        title: direccion + "(" + resultados_lat + "," + resultados_long + ")",
        animation: google.maps.Animation.DROP,
        draggable: true
      });

      var kml = document.getElementById("map").getAttribute("data-kml");
      getCoordsFromKML(kml + "?" + $.now(), map, marker);
    } else {
      var mensajeError = "";
      if (status === "ZERO_RESULTS") {
        mensajeError = "No hubo resultados para la dirección ingresada.";
      } else if (
        status === "OVER_QUERY_LIMIT" ||
        status === "REQUEST_DENIED" ||
        status === "UNKNOWN_ERROR"
      ) {
        mensajeError = "Error general del mapa.";
      } else if (status === "INVALID_REQUEST") {
        mensajeError = "Error de la web. Contacte con Name Agency.";
      }
      alert(mensajeError);
    }
  });
}

function showInfoWindow(map, marker, bermudaTriangle, infowindow) {
  coordinate = marker.getPosition();
  isWithinPolygon = google.maps.geometry.poly.containsLocation(
    coordinate,
    bermudaTriangle
  );
  infowindow.setContent(createContent(isWithinPolygon));
  infowindow.open(map, marker);
}

function getCoordsFromKML(KMLFile, map, marker) {
  $.get(KMLFile, function(data) {
    var xml = null;
    xml = $(data)
      .find("coordinates")
      .text()
      .trim();
    var xml_array = xml.split(" ");
    var lng = null;
    var lat = null;
    var i;
    var coords = [];
    for (i = 0; i < xml_array.length; i++) {
      lng = Number(xml_array[i].split(",")[0]);
      lat = Number(xml_array[i].split(",")[1]);
      coords[i] = { lng: lng, lat: lat };
    }
    // 	console.log(coords);
    // Construct the polygon.
    var bermudaTriangle = new google.maps.Polygon({
      paths: coords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: "#FF0000",
      fillOpacity: 0.35
    });
    bermudaTriangle.setMap(map);
    var coordinate = marker.getPosition();
    var isWithinPolygon = google.maps.geometry.poly.containsLocation(
      coordinate,
      bermudaTriangle
    );

    var infowindow = new google.maps.InfoWindow({
      content: createContent(false)
    });

    showInfoWindow(map, marker, bermudaTriangle, infowindow);

    google.maps.event.addListener(marker, "drag", function(event) {
      showInfoWindow(map, marker, bermudaTriangle, infowindow);
    });

    google.maps.event.addListener(marker, "dragend", function(event) {
      showInfoWindow(map, marker, bermudaTriangle, infowindow);
    });
  });
}
