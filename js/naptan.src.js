const colors = ["#42d4f4", "#f032e6", "#ffe119", "#f58231", "#3cb44b", "#e6194B", "#4363d8", "#fabed4"],
    labels = ["Marked Stop", "Custom & Practice Stop", "Bus Station Entrance", "Bus Station Bay", "Railway Station", "Taxi Rank", "Metro Platform", "Ferry Terminal"];
function getColor(o) {
    return "MKD" == o.BusStopType
        ? colors[0]
        : "CUS" == o.BusStopType
        ? colors[1]
        : "BCE" == o.StopType
        ? colors[2]
        : "BCS" == o.StopType
        ? colors[3]
        : "RLY" == o.StopType
        ? colors[4]
        : "TXR" == o.StopType
        ? colors[5]
        : "PLT" == o.StopType
        ? colors[6]
        : "FER" == o.StopType
        ? colors[7]
        : "ffffff";
}
function naptanMarker(o) {
    return { radius: 6, fillColor: getColor(o.properties), color: "#ffffff", weight: 0.5, opacity: 1, fillOpacity: 0.9 };
}
function forEachFeature(o, e) {
    var r = "<table>";
    for (var t in o.properties) r += "<tr><td><b>" + t + "</b></td><td>" + o.properties[t] + "</td></tr>";
    (r += "</table>"), (e.feature.properties.searchItem = e.feature.properties.AtcoCode + ", " + e.feature.properties.CommonName), e.bindPopup(r);
}
$.support.cors = !0;
var stopmarkers = L.markerClusterGroup({ MaxClusterRadius: 200, disableClusteringAtZoom: 10, spiderfyOnMaxZoom: !1 }),
    baseMaps = { OpenStreetMap: osm },
    osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 20, attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>' });
(map = L.map("map", { center: [53.43, -7.95], zoom: 7, layers: [osm, stopmarkers] })),
    $.getJSON("https://corsproxy.io/?url=https://www.transportforireland.ie/transitData/Data/naptan.json", function (o) {
        (napLocations = L.geoJSON(o, {
            onEachFeature: forEachFeature,
            pointToLayer: function (o, e) {
                return L.circleMarker(e, naptanMarker(o));
            },
        })),
            stopmarkers.addLayer(napLocations);
    });
var searchControl = new L.control.search({
    layer: stopmarkers,
    initial: !1,
    marker: !1,
    propertyName: "searchItem",
    textPlaceholder: "Search...",
    collapsed: !1,
    autoCollapse: !0,
    zoom: 12,
    moveToLocation: function (o, e, r) {
        r.setView(o, 15);
    },
}).addTo(map);
searchControl.on("search:locationfound", function (o) {
    o.layer.openPopup();
});
var legend = L.control({ position: "bottomright" });
(legend.onAdd = function (o) {
    for (var e = L.DomUtil.create("div", "info legend"), r = 0; r < colors.length; r++) e.innerHTML += '<i style="background:' + colors[r] + '"></i> ' + labels[r] + "<br>";
    return e;
}),
    legend.addTo(map);
