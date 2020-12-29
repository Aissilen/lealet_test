const map = L.map('map', {
    'preferCanvas': true,
    'center': [52.287055 , 104.281047],
    'zoom': 15,
    'layers':
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            'attribution': 'Map data &copy; OpenStreetMap contributors'
        }),
    }
)

var editableLayers = new L.FeatureGroup()
map.addLayer(editableLayers)


let usi_coord = ["52.287009999999995", "104.245869"]
let ats_coord = ["52.27658", "104.248222"]

var latlngs = [
    ["52.287009999999995", "104.245869"],
    ["52.27658", "104.248222"]
]

let usi_marker = new L.Marker(usi_coord,{type: 'usi'}).addTo(map)
let ats_marker = new L.Marker(ats_coord,{type: 'ats'}).addTo(map)

let polyline = L.polyline(latlngs, {color: 'red'}).addTo(map)


map.fitBounds(polyline.getBounds())

editableLayers.addLayer(polyline)


console.log(editableLayers)

// let jsonLayer = L.geoJson(geojsonFeature, {
//     onEachFeature: function (feature, layer) {
//         console.log("feature ---- ",feature)
//         console.log("layer ---- ",layer)
//         editableLayers.addLayer(layer)
//         //   if (layer instanceof L.Polyline) {
//     //     layer.setStyle({
//     //       'color': feature.properties.color
//     //     });
//     //   }
//     }
// }).addTo(map)

let options = {
    position: 'topleft',
    draw: {
        polyline: true,
        polygon: false,
        circle: false, // Turns off this drawing tool 
        rectangle: false,
        marker: true
    },
    edit: {
        featureGroup: editableLayers, //REQUIRED!! 
        remove: true
    }
};

var drawControl = new L.Control.Draw(options)
map.addControl(drawControl)

map.on('draw:edited', function (e) {
    var layers = e.layers;
    console.log(e)
    layers.eachLayer(function (layer) {
        //do whatever you want; most likely save back to db

        console.log(layer)
        console.log(polyline)
    });
});
// map.on(L.Draw.Event.CREATED, function(e) {
//   var type = e.layerType,
//     layer = e.layer;

//   if (type === 'marker') {
//     layer.bindPopup('A popup!');
//   }

//   editableLayers.addLayer(layer);
// });