const colors = [
    '#42d4f4',
    '#f032e6',
    '#ffe119',
    '#f58231',
    '#3cb44b',
    '#e6194B',
    '#4363d8',
    '#fabed4'
]

const labels = [
    'Marked Stop', 'Custom & Practice Stop', 'Bus Station Entrance', 'Bus Station Bay', 
    'Railway Station', 'Taxi Rank', 'Metro Platform', 'Ferry Terminal'];

function getColor(d) {
    return d.BusStopType == 'MKD' ? colors[0] :
        d.BusStopType == 'CUS' ? colors[1] :
        d.StopType == 'BCE' ? colors[2] :
        d.StopType == 'BCS' ? colors[3] :
        d.StopType == 'RLY' ? colors[4] :
        d.StopType == 'TXR' ? colors[5] :
        d.StopType == 'PLT' ? colors[6] :
        d.StopType == 'FTD' ? colors[7] :
        'ffffff';
}

function naptanMarker(feature) {
    return {
        radius: 6,
        fillColor: getColor(feature.properties),
        color: '#ffffff',
        weight: .5,
        opacity: 1,
        fillOpacity: 0.9
    };
}

function forEachFeature(feature, layer) {
    var popupContent = '<table>';
    for (var p in feature.properties) {
        popupContent += '<tr><td><b>' + p + '</b></td><td>' + feature.properties[p] + '</td></tr>';
    }
    popupContent += '</table>';
    layer.feature.properties.searchItem = layer.feature.properties.AtcoCode + ', '
     + layer.feature.properties.CommonName;
    layer.bindPopup(popupContent);
};

$.support.cors = true;

var stopmarkers = L.markerClusterGroup({
    MaxClusterRadius: 200,
    disableClusteringAtZoom: 10,
    spiderfyOnMaxZoom: false
});

var baseMaps = {
    'OpenStreetMap': osm,
};

var osm = L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.transportforireland.ie/">National Transport Authority</a> | &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

var map = L.map('map', {
    center: [53.43, -7.95],
    zoom: 7,
    layers: [osm, stopmarkers]
});

$.getJSON( "js/naptan.json",
    function(data) {
    napLocations = L.geoJSON(data, {
        onEachFeature: forEachFeature,
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, naptanMarker(feature));
        }
    });
    stopmarkers.addLayer(napLocations);
});

var searchControl = new L.control.search({
    layer: stopmarkers,
    initial: false,
    marker: false,
    propertyName: 'searchItem',
    textPlaceholder: 'Search...',
    collapsed: false,
    autoCollapse: true,
    zoom: 12,
    moveToLocation: function(latlng, title, map) {
            map.setView(latlng, 15); // access the zoom
        }
  }).addTo(map);

searchControl.on('search:locationfound', function(e) {
        e.layer.openPopup();
});

var legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < colors.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' + labels[i] + '<br>';
    }

    return div;
};

legend.addTo(map);
