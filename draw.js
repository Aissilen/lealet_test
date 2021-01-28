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

const LeafIcon = L.Icon.extend({
    options:{
        // shadowUrl: 'leaf-shadow.png', // ТУТ можно намутить тень для иконки
        iconSize:     [30, 40], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [15, 45], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [0, -36] // point from which the popup should open relative to the iconAnchor
    }
})

/// создаем обьекты иконок с своими картинками
const offlineRsIcon = new LeafIcon({iconUrl: "./img/iconrshaOffline.png"}),
onlineAtsIcon = new LeafIcon({iconUrl: "./img/iconatsOnline.png"})

const pointLIcon = L.Icon.extend({
    options: {
        iconSize:     [10, 10], // size of the icon
        shadowSize:   [1, 1], // size of the shadow
        iconAnchor:   [5, 5], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [0, -36] // point from which the popup should open relative to the iconAnchor
    }
})

const pointIcon = new pointLIcon({iconUrl: "./img/point.png"})


const colors = {
    "canalization": "#929b39",
    "facade": "#f78879",
    "air": "#4ba6fa",
}
const radio_color = document.getElementById('color_choice')

var editableLayers = new L.FeatureGroup()
map.addLayer(editableLayers)

let usi_coord = ["52.287009999999995", "104.245869"]
let ats_coord = ["52.27658", "104.248222"]

var latlngs = [ats_coord,usi_coord]

let usi_marker = new L.Marker(usi_coord,{icon:offlineRsIcon,type: 'usi'}).addTo(map)
let ats_marker = new L.Marker(ats_coord,{icon:onlineAtsIcon,type: 'ats'}).addTo(map)

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
    draw: false,
    edit: {
        featureGroup: editableLayers, //REQUIRED!! 
        remove: true
    }
};

var drawControl = new L.Control.Draw(options)
map.addControl(drawControl)



console.log(drawControl.options.edit)   
// let new_kek = new L.layerGroup()

let feautures = new L.featureGroup()
let selected_feature

map.on('draw:edited', e => {
    var layers = e.layers;
    console.log(e)
    layers.eachLayer(layer => {
        //do whatever you want; most likely save back to db

        let features_lat_lng = layer.getLatLngs()

        features_lat_lng.forEach( (el,index,array) => {
            if (index != array.length -1 ){
                let polyline = L.polyline([array[index],array[index+1]], {color: colors.canalization}).addTo(feautures)
                
                let point = new L.Marker(array[index+1],{icon:pointIcon,type: 'point'}).addTo(feautures)

                let feature = polyline.feature = polyline.feature || {}
                feature.type = "Feature"
                feature.properties = feature.properties || {}
                feature.properties["type"] = "canalization"
                feature.properties["order"] = index+1
                feature.properties["length"] = ''

                polyline.addEventListener('click', ev => {
                    selected_feature = ev.sourceTarget

                    console.log('selected_feature',selected_feature.feature.properties.order)
                    let color = selected_feature.options.color
                    let type = getKeyByValue(colors,color)

                    radio_color.color.value = type

                    sidebar.show()
                    // let geoJson = feautures.toGeoJSON()
                    // console.log(JSON.stringify(geoJson))
                })
            }
        })

        layer.remove()
        console.log(feautures)
        feautures.addTo(map)
    });
});


map.on('draw:editstart', e =>{
    console.log('_______________edit started______________')

    sidebar.hide()

    feautures.remove()
    feautures.clearLayers()
    polyline.addTo(map)
    // editableLayers.addLayer(polyline)
})

radio_color.addEventListener('change',ev=>{
    let value = radio_color.color.value

    console.log(value, selected_feature);
    selected_feature.options.color = colors[value]
    selected_feature.redraw()
})

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value)
}

