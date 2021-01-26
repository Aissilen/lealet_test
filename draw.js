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


// console.log(editableLayers)

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

var sidebar = L.control.sidebar('sidebar', {
    position: 'right'
})

map.addControl(sidebar)


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

let new_kek = new L.layerGroup()

map.on('draw:edited', function (e) {
    var layers = e.layers;
    console.log(e)
    layers.eachLayer(function (layer) {
        //do whatever you want; most likely save back to db

        // console.log(layer)
        // console.log(polyline)

        let objectOut = layer.toGeoJSON()
        let coord_array = objectOut.geometry.coordinates
        let polyline = layer

        layer.remove()

        let length = coord_array.length

        

        coord_array.forEach( (el,index,array) => {
            if (index != length-1){
                let new_lat_lng = [[array[index][1],array[index][0]],[array[index+1][1],array[index+1][0]]]

                console.log(new_lat_lng)
                let polyline = L.polyline(new_lat_lng, {color: 'red'}).addTo(new_kek)

                polyline.addEventListener('click', ev => {
                    console.log(ev)
                    sidebar.show()
                })

            }
        })
        new_kek.addTo(map)
        
        // new_kek.addEventListener('click', ev => {
        //     console.log(ev)
        // })
        
        let objectOut2 = new_kek.toGeoJSON()
        let coord_array2 = objectOut.geometry.coordinates

        console.log(objectOut2)
    });
});

map.on('draw:editstart', e =>{
    console.log('edit start',e);
    console.log(new_kek);
    new_kek.remove()
    new_kek.clearLayers()
    polyline.addTo(map)
    editableLayers.addLayer(polyline)
})



// layer.on('click', function() {
//     objectOut = layer.toGeoJSON();
//     textOut = JSON.stringify(objectOut);
//   });


// map.on(L.Draw.Event.CREATED, function(e) {
//   var type = e.layerType,
//     layer = e.layer;

//   if (type === 'marker') {
//     layer.bindPopup('A popup!');
//   }

//   editableLayers.addLayer(layer);
// });