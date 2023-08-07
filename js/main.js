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
        maxWidth: 225,
        position: 'bottomright',

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

	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		this._div.innerHTML = '<h4>SharkViz Beach Information</h4>' +  (props ?
			'<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>' 
            : 'Hover over a beach');
	};

	info.addTo(map);

    //call getData function
    //addBeaches(map);
    getData(map);
};

//-----------------------------------------------------------//
//======================  CUSTOM ICONS  =====================//
//-----------------------------------------------------------//

var sharkIcon = L.icon({
    iconUrl: 'https://clipart-library.com/new_gallery/92-922418_png-file-silhouette-of-a-shark.png',
    iconSize:[20, 20],
});

var basicBeachIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/shacheeswadia/leaflet-map/main/beach-icon-colorful.svg',
    iconSize: [20, 20],
});

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
                pointToLayer: function (feature, latlng){
                    return L.marker(latlng, {icon: basicBeachIcon});
                },
                onEachFeature: onEachFeature,
            }).addTo(map);
        })
    
}

var options = {
    fillcolor: "#20b2ab",
    color: "#006993",
    weight: 1,
    opacity: 1,
    radius: 3,}


function getData(map){
    fetch("data/Sharks.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            sharks = new L.geoJson(json,{
                style: function (feature) {
                    return {
                        classname: 'sharksclass'
                    }
                }
            });
        })
    };

// =========================== BACK UP ===========================//

    /*function addBeaches(map){
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
    
    var options = {
        fillcolor: "#20b2ab",
        color: "#006993",
        weight: 1,
        opacity: 1,
        radius: 3,
    }
    
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
                        return L.circleMarker(latlng, options, {icon: sharkIcon});
                    }
                }).addTo(map);
            })*/


//-----------------------------------------------------------//
//=====================  CHECKBOX DATA  =====================//
//-----------------------------------------------------------//

function checkboxes(map) {
    document.querySelectorAll(".checkbox").forEach(function (box) {
        box.addEventListener("change", function () {
            if (box.checked) {
                if (box.value == "sharks") {
                    sharks.addTo(map);
                    beaches.bringToFront();
                }
            }
            else {
                if (box.value == "sharks") {
                    map.removeLayer(sharks);
                }
            }
        })
    })
}

//-----------------------------------------------------------//
//================  INTERACTIONS WITH DATA  =================//
//-----------------------------------------------------------//

//on mouse over
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}

var geojson;

//on mouse out
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

//on mouse click
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

//-----------------------------------------------------------//
//================  ON WINDOW LOAD FUNCTION  ================//
//-----------------------------------------------------------//

document.addEventListener('DOMContentLoaded',createMap)