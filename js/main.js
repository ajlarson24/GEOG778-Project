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
        position: 'topleft'
    }).addTo(map);

    L.control.scale({
        maxWidth: 225,
        position: 'bottomright',

    }).addTo(map);

    L.Control.geocoder({position: 'topleft'}).addTo(map);

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

    getData(map);
    checkboxes(map);
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

//======================  Shark Symbols  ======================//
var options = {
    fillcolor: "#20b2ab",
    color: "#006993",
    weight: 1,
    opacity: 1,
    radius: 3,
}

//======================  Loading Data  ======================//
function getData(map) {
    fetch("data/BeachesNew.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            beaches = new L.geoJson(json, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: basicBeachIcon });
                },
                onEachFeature: onEachBeach,
            }).addTo(map);
        })

    fetch("data/SharksNew.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            sharks = new L.geoJson(json, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, options, { icon: sharkIcon });
                },
                onEachFeature: sharkPopup,
            })
        })

    fetch("data/10miBuffs.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            buff10 = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        fillcolor: "none",
                        color: "#2b8cbe",
                        weight: 4,
                        opacity: .7,
                        fillOpacity: .04,
                    }
                }
            })
        })

    fetch("data/20miBuffs.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            buff20 = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        fillcolor: "none",
                        color: "#a6bddb",
                        weight: 4,
                        opacity: .9,
                        fillOpacity: .03,
                    }
                }
            })
        })

    fetch("data/30miBuffs.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            buff30 = new L.geoJson(json, {
                style: function (feature) {
                    return {
                        fillcolor: "none",
                        color: "#ece7f2",
                        weight: 4,
                        opacity: .9,
                        fillOpacity: .02,
                    }
                }
            })
        })

//======================  Creating Info Box  ======================//        
    const info = L.control({ position: 'bottomleft' });

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function (props) {
        const contents = props ? `<h5><span style="color:#3b3b3b">Beach Name:</span> ${props.Beach_Name}
                    <br/><span style="color:#3b3b3b">State: </span>${props.State}
                    <br/><span style="color:#3b3b3b">Sharks within 10 Miles: </span>${props.Sharks10}
                    <br/><span style="color:#3b3b3b">Within 20 Miles: </span>${props.Sharks20}
                    <br/><span style="color:#3b3b3b">Within 30 Miles: </span>${props.Sharks30}`
            : 'Hover over a Beach</h5>';
        this._div.innerHTML = `<h4>SharkViz Beach Information</h4>${contents}`;
    };

    info.addTo(map)

//======================  Data Interactions  ======================//    
    //hover function for beaches/info
    function hover(e) {
        const layer = e.target;
        info.update(layer.feature.properties);
    }

    //function to reset info to initial parameters
    function mouseout(e) {
        info.update();
    }

    function onEachBeach(feature, layer) {
        layer.on({
            mouseover: hover,
            mouseout: mouseout,
        });
    }

    function sharkPopup(feature, layer) {
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
}
    
//-----------------------------------------------------------//
//=====================  CHECKBOX DATA  =====================//
//-----------------------------------------------------------//

function checkboxes(map) {
    document.querySelectorAll(".checkbox").forEach(function (box) {
        box.addEventListener("change", function () {
            if (box.checked) {
                if (box.value == "sharks") {
                    sharks.addTo(map);
                    sharks.bringToFront();
                }
                if (box.value == "buff10") {
                    buff10.addTo(map);
                    buff10.bringToFront();
                    sharks.bringToFront();
                }
                if (box.value == "buff20") {
                    buff20.addTo(map);
                    buff20.bringToFront();
                    buff10.bringToFront();
                    sharks.bringToFront();
                }
                if (box.value == "buff30") {
                    buff30.addTo(map);
                    buff30.bringToFront();
                    buff20.bringToFront();
                    buff10.bringToFront();
                    sharks.bringToFront();
                }
            }
            else {
                if (box.value == "sharks") {
                    map.removeLayer(sharks);
                }
                if (box.value == "buff10") {
                    map.removeLayer(buff10);
                }
                if (box.value == "buff20") {
                    map.removeLayer(buff20);
                }
                if (box.value == "buff30") {
                    map.removeLayer(buff30);
                }
            }
        })
    })
}

//-----------------------------------------------------------//
//================  ON WINDOW LOAD FUNCTION  ================//
//-----------------------------------------------------------//

document.addEventListener('DOMContentLoaded',createMap)