// Add all scripts to the JS folder
function createMap() {
    //var map = L.map('map').setView([44.75, -90], 8);
    var map = L.map('map', {
        center: [44.5, -90],
        zoom: 6
    });
    //create basemap and set zoom limits


    var OpenStreetMap_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);



    //set map boundaries
    /*var northW = L.latLng(49, -96);
    southE = L.latLng(40, -84);
    var bounds = L.latLngBounds(northW, southE);
    map.setMaxBounds(bounds);
    map.on('drag', function () {
        map.panInsideBounds(bounds, {
            animate: false
        });
    });

    //call functions to add elements
    getData(map);
    checkboxes(map);
    geoCoder(map);
    legend.addTo(map);*/
};

//======================================================================================

document.addEventListener('DOMContentLoaded', createMap)