// Get the Dataset - we will use this one:
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson

// Import and Visualize the Data
// Using Leaflet: create a map that plots all the earthquakes from your dataset based on their longitude and latitude.
// Create the tile layer that will be the background of our map.


// Include popups that provide additional information about the earthquake when its associated marker is clicked.

// Create a legend that will provide context for your map data.

function createMap(earthquakes) {
	let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	});
// Create a baseMaps object to hold the streetmap layer.
	let baseMaps = {
    	"Street Map": streetmap
  	};
// Create an overlayMaps object to hold the bikeStations layer.
	let overlayMaps = {
		"Earthquake Map": earthquakes
	};
// Create the map object with options.
	let map = L.map("map", {
    	center: [40.73, -74.0059],
    	zoom: 12,
    	layers: [streetmap, earthquakes]
 	});
// Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
	L.control.layers(baseMaps, overlayMaps, {
		collapsed: false
	}).addTo(map);
}

function createMarkers(response) {
	// Pull the "features" property from response.data.
	let features = response.features;
	// Initialize an array to hold earthquake markers.
	let earthquakeMarkers = [];
	let depthList = [];
	// Loop through the stations array.
	for (let index = 0; index < features.length; index++) {
		let feature = features[index];
		depthList.push(feature.geometry.coordinates[2])
		// Conditionals for earthquake mag
		let color = "";
		if (feature.geometry.coordinates[2] > 50) {
		  color = "#FF0000";
		}
		else if (feature.geometry.coordinates[2] > 45) {
		  color = "#FF0808";
		}
		else if (feature.geometry.coordinates[2] > 40) {
		  color = "#FF0C0C";
		}
		else if (feature.geometry.coordinates[2] > 35) {
			color = "#FF4A2D";
		}
		else if (feature.geometry.coordinates[2] > 30) {
			color = "#FF692D";
		}
		else if (feature.geometry.coordinates[2] > 25) {
			color = "#FF9C2D";
		}
		else if (feature.geometry.coordinates[2] > 20) {
			color = "#FFB32D";
		}
		else if (feature.geometry.coordinates[2] > 15) {
			color = "#FFCF2D";
		}
		else if (feature.geometry.coordinates[2] > 10) {
			color = "#FFE62D";
		}
		else if (feature.geometry.coordinates[2] > 5) {
			color = "#EFFF2D";
		}
		else {
		  color = "#DCFF2D";
		}
	
		// For each station, create a marker, and bind a popup with the station's name.
		let earthquakeMarker = L.circle(
			[feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 
			{
				radius: Math.pow(feature.properties.mag,2) * 10000,
				color: color,
				fillColor: color
			}
			)
		  .bindPopup(
			"<h3>Location: " + feature.properties.place + 
			"<h3><h3>Magnitude: " + feature.properties.mag + 
			"<h3><h3>Depth: " + feature.geometry.coordinates[2] +
			"<h3><h3>Time: " + feature.properties.time + 
			"</h3>"
			);
	
		// Add the marker to the earthquakeMarkers array.
		earthquakeMarkers.push(earthquakeMarker);
	}

	// sort the array of depths
	depthList.sort(function compareFunction(firstNum, secondNum) {
		// resulting order is ascending
		return firstNum - secondNum;
	  });

	// Set up the legend.
	//{position: 'bottomleft'}
	var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Categories</strong>'],
    categories = ['Size', 'Color'];

    let legendInfo = "<h1>Earthquakes<br />Past 30 days</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"Size\">" + "Magnitude" + "</div>" +
        "<div class=\"Color\">" + "Depth" + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;
    return div;
    };
    //



	// Create a layer group that's made from the earthquake markers array, and pass it to the createMap function.
	createMap(L.layerGroup(earthquakeMarkers));
	legend.addTo(map);
}

// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(createMarkers);