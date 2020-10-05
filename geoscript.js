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

let start_data = {   
    "type": "FeatureCollection",
    "features": [
    {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [104.28634643554689, 52.28664250209102]
        }
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [104.29853439331056, 52.2839122298451]
        }
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [104.28634643554689, 52.28664250209102],
                [104.29853439331056, 52.2839122298451] 
            ]
        }
    }
]
}

let geoJsonLayer = L.geoJson(start_data, {
    onEachFeature: function (feature, layer) {
        console.log("feature ---- ",feature)
        console.log("layer ---- ",layer)

        //   if (layer instanceof L.Polyline) {
    //     layer.setStyle({
    //       'color': feature.properties.color
    //     });
    //   }
    }
}).addTo(map)

let rk_coord = [52.28664250209102, 104.28634643554689]
let rs_coord = [52.282494522127635, 104.29347038269043]
let mapMarker = []

let rkMarker = new L.Marker(rk_coord,{
    type : 'rk',
    draggable: false,
})
.bindPopup('rk')
.addTo(map)
mapMarker.push(rkMarker)

let rsMarker = new L.Marker(rs_coord,{
    type : 'rs',
    draggable: false,
})
.bindPopup('rs')
.addTo(map)
mapMarker.push(rsMarker)


console.log(L.featureGroup(mapMarker));