var totalDistance = 0;
var firstLat = null;
var firstLong = null;
var lastLat = null; 
var lastLong = null;
var speed = 0;
var watchID = null;
var lt = 0;
function toRad(deg) { return deg * Math.PI / 180; }
function distance(lat1, long1, lat2, long2) {
// R is the radius of the earth in kilometers
	var R = 6371;
	var deltaLat = toRad(lat2 - lat1);
	var deltaLong = toRad(long2 - long1);
	lat1 = toRad(lat1);
	lat2 = toRad(lat2);
	var a = Math.sin(deltaLat/2) * 
	Math.sin(deltaLat/2) + 
	Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLong/2) * 
	Math.sin(deltaLong/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
	var d = R * c; 
	return d;
}
function updateStatus(message) { document.getElementById("status").innerHTML = message; }
function loadDemo() {
	if(navigator.geolocation) {
		updateStatus("HTML5 Geolocation is supported in your browser.");
			watchID = navigator.geolocation.watchPosition(updateLocation, handleLocationError, {maximumAge: 10000, enableHighAccuracy: true});
							}
					}
function updateLocation(pos) {
	var lat = pos.coords.latitude;
	var long = pos.coords.longitude;
	var accuracy = pos.coords.accuracy;
	var t = pos.timestamp / 1000; 
	var timestamp = new Date(pos.timestamp);
	timestamp = timestamp.toLocaleTimeString();
			
	var element = document.getElementById('geo');
        element.innerHTML = 'Latitude: '  + lat.toFixed(2)  + '<br />' +
                            'Longitude: ' + long.toFixed(2) + '<br />' +
							'Accuracy: '  + accuracy        + '<br />' +
							'Timestamp: ' + timestamp       + '<br />';
			                           	
	if (accuracy >= 500) {
		updateStatus("Need more accurate values to calculate distance.");
		return;
						}
// calculate distance
if ((lastLat != null) && (lastLong != null)) { 
	var currentDistance = distance(lat, long, lastLat, lastLong);
	//if (currentDistance == null) { lt = t; }
	if (lt != t) { 
		var dt = t - lt;
		speed = currentDistance * 1000 / dt; 
		lt = t; 
		}
	totalDistance += currentDistance; 
	var elem = document.getElementById('speed');
        elem.innerHTML = 'Speed: ' + speed.toFixed(2) + ' m/s<br />' +
						 'Current distance traveled: ' + currentDistance.toFixed(4) + ' km<br />' +
						 'Total distance traveled: ' + totalDistance.toFixed(4) +' km';
												}
	
else {
		firstLat = lat; 
		firstLong = long;
		lt = t; 
	}
		
lastLat = lat; 
lastLong = long; 
updateStatus("Location successfully updated.");
}

function clearWatch() {
        if (watchID != null) {
            navigator.geolocation.clearWatch(watchID);
            watchID = null;
			        }
		document.getElementById("harta").className = "hidden";
    }
	
function showMap() {
	var imagine = document.getElementById("harta");
	var url = "http://maps.googleapis.com/maps/api/staticmap?center=" + lastLat + "," + lastLong + "&size=400x400&sensor=true"
	// Set the map zoom level using a rough heuristic
	var zoomlevel=14; // Start zoomed in almost all the way
	//if (accuracy > 80) // Zoom out for less accurate positions
	//zoomlevel -= Math.round(Math.log(accuracy/50)/Math.LN2);
	url += "&zoom=" + zoomlevel + "&path=color:0x0000ff%7Cweight:5%7C" + firstLat + "," + firstLong + "%7C" + lastLat + "," + lastLong; // Add zoom level to the URL
	imagine.src = url;
	imagine.className = "inherit"; 
	             }
			
function handleLocationError(error) {
switch (error.code) {
case 0:
updateStatus("There was an error while retrieving your location: " + error.message);
break;
case 1:
updateStatus("The user prevented this page from retrieving a location.");
break;
case 2:
updateStatus("The browser was unable to determine your location: " + error.message);
break;
case 3:
updateStatus("The browser timed out before retrieving the location.");
break;
}
}