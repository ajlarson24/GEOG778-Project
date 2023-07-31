/* SHARKVIZ SOURCE CODE */
var map;
//-----------------------------------------------------------//
//====================  POP UP FUNCTION  ====================//
//-----------------------------------------------------------//
window.addEventListener("load", function () {
    this.setTimeout(
        function open(event) {
            document.querySelector(".popup").style.display = "block";
        },
        0
    )
});

document.querySelector("#close").addEventListener("click", function () {
    document.querySelector(".popup").style.display = "none";
});

document.querySelector("#letsGo").addEventListener("click", function () {
    document.querySelector(".popup").style.display = "none";
});
//-----------------------------------------------------------//
//==================  CREATE MAP FUNCTION  ==================//
//-----------------------------------------------------------//
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
        position: 'topright'
    }).addTo(map);

    L.control.scale({
        maxWidth: 225
    }).addTo(map);

    L.Control.geocoder().addTo(map);


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
//-----------------------------------------------------------//
//======================  CUSTOM ICONS  =====================//
//-----------------------------------------------------------//
var sharkIcon = L.icon({
    iconUrl: 'https://clipart-library.com/new_gallery/92-922418_png-file-silhouette-of-a-shark.png',
    iconSize:[20, 20],
});

const basicBeachIcon = L.icon({iconUrl: 'https://raw.githubusercontent.com/shacheeswadia/leaflet-map/main/beach-icon-colorful.svg',
    iconSize: [20, 20], // size of the icon
});

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
//-----------------------------------------------------------//
//======================  ADDING DATA  ======================//
//-----------------------------------------------------------//
function addBeaches(map){
    //load the data
    fetch("data/Beaches.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json, {
                onEachFeature: onEachFeature,
                pointToLayer: function (feature, latlng){
                    return L.marker(latlng, {icon: basicBeachIcon});
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
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json, {
                onEachFeature: onEachFeature,
                pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, {icon: sharkIcon});
                }
            }).addTo(map);
        })
};



//-----------------------------------------------------------//
//================  ON WINDOW LOAD FUNCTION  ================//
//-----------------------------------------------------------//
document.addEventListener('DOMContentLoaded',createMap)