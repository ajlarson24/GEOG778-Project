/* SHARKVIZ SOURCE CODE */
//declare map var in global scope
var map;

//initial popup window
window.addEventListener("load", function () {
    this.setTimeout(
        function open(event) {
            document.querySelector(".popup").style.display = "block";
        },
        0
    )
});

//popup window interactions
document.querySelector("#close").addEventListener("click", function () {
    document.querySelector(".popup").style.display = "none";
});

document.querySelector("#letsGo").addEventListener("click", function () {
    document.querySelector(".popup").style.display = "none";
});

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [36, -72.5],
        zoom: 5,
        zoomControl: false
    });

    //add OSM base tilelayer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    maxZoom: 19,
	    attribution: 'Chris Fischer and the &copy <a href="https://www.ocearch.org/tracker/">Ocearch</a> Team, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    //set map boundaries
    var northW = L.latLng(60, -120);
    southE = L.latLng(0, -20);
    var bounds = L.latLngBounds(northW, southE);
    map.setMaxBounds(bounds);
    map.on('drag', function () {
        map.panInsideBounds(bounds, {
            animate: false
        });
    });

    //call getData function
    addSharks(map);
    addBeaches(map);
};

//added at Example 2.3 line 20...function to attach popups to each mapped feature
function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

const basicBeachIcon = L.icon({iconUrl: 'https://raw.githubusercontent.com/shacheeswadia/leaflet-map/main/beach-icon-colorful.svg', iconSize: [25, 25], // size of the icon
});

function addBeaches(map){
    //load the data
    fetch("data/Beaches.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            var geojsonMarkerOptions = {
                radius: 4,
                fillColor: "orange",
                color: "red",
                weight: 1,
                opacity: 1,
                fillOpacity: 1
            };
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json, {
                onEachFeature: onEachFeature,
                pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, {icon: basicBeachIcon});
                }
            }).addTo(map);
        })
};


function addSharks(map){
    //load the data
    fetch("data/Sharks.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            var geojsonMarkerOptions = {
                radius: 2,
                fillColor: "#56903a",
                color: "blue",
                weight: 1,
                opacity: 1,
                fillOpacity: 1
            };
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json, {
                onEachFeature: onEachFeature,
                pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(map);
        })
};

document.addEventListener('DOMContentLoaded',createMap)
