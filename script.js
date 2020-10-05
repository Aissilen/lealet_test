// import {polylinePrinter} from './utility'

const map = new L.map('map',
{
    preferCanvas: true,
    center: [52.287055 , 104.281047],
    zoom: 14,
})

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

let mapMarker = []
let interimMarkerCoord = []
let mapPolylines = []

let rk_coord = [52.28664250209102, 104.28634643554689]
let rs_coord = [52.282494522127635, 104.29347038269043]


let is_color_editable = false
let is_marker_editable = false

let marker_array_from_db = {
    "first": {
        "marker_1": ['1st coord'],
        "marker_2": [52.28895260104408,104.29286956787111],
        "color": "red",
    },
    "polyline_2": {
        "marker_1": [52.28895260104408,104.29286956787111],
        "marker_2": [52.288375087598624,104.29673194885255],
        "color": "blue",
    },
    "polyline_3": {
        "marker_1": [52.288375087598624,104.29673194885255],
        "marker_2": [52.28611746280235,104.29853439331056],
        "color": "green",
    },
    "polyline_4": {
        "marker_1": [52.28611746280235,104.29853439331056],
        "marker_2": [52.2839122298451,104.29853439331056],
        "color": "green",
    },
    "last": {
        "marker_1": [52.2839122298451,104.29853439331056],
        "marker_2": ['last coord'],
        "color": "red",
    },
}

marker_array_from_db.first.marker_1 = rk_coord
marker_array_from_db.last.marker_2 = rs_coord

let json_keys = Object.keys(marker_array_from_db)

crateArrayWithInterimMarker(marker_array_from_db,json_keys)
drawAllMarkerOnMap()
drawAllPolyline(marker_array_from_db,json_keys)

function crateArrayWithInterimMarker(json,keys) {
    const clone_keys = [...keys]
    interimMarkerCoord = []
    clone_keys.pop()
    let first_item_key = clone_keys.shift()
    let first_item = json[first_item_key]
    let first_marker_coord = first_item.marker_2
    interimMarkerCoord.push(first_marker_coord)
    
    clone_keys.forEach( key => {
        let item = json[key]
        interimMarkerCoord.push(item.marker_2)
    })
}

function drawAllMarkerOnMap(){
    mapMarker = []
    let rkMarker = new L.Marker(rk_coord,{
        type : 'rk',
        draggable: false,
    })
    .bindPopup('rk')
    .addTo(map)
    mapMarker.push(rkMarker)

    interimMarkerCoord.forEach( (element,i) => {
        let newMarker = new L.Marker(element,{
            type : `new_marker_${i+1}`,
            draggable: true,
        })
        .bindPopup(`new_marker`)
        .addTo(map)
        mapMarker.push(newMarker)
        _addDragendListenerToMarkerAndRedrawPolyline(newMarker)
    })

    let rsMarker = new L.Marker(rs_coord,{
        type : 'rs',
        draggable: false,
    })
    .bindPopup('rs')
    .addTo(map)
    mapMarker.push(rsMarker)
}

function drawAllPolyline(json,keys){
    mapPolylines = []
    keys.forEach( key => {
        let item = json[key]

        // let popup_text = "<h2 id = 'red'>red</h2> <h2 id = 'green'>green</h2> <h2 id = 'blue'>blue</h2>"
        let polyline = L.polyline(
            [item.marker_1,item.marker_2],
            {color: item.color,
            json_key: key,
            weight: 10,
            dashArray: '2,5'
            })
            .addTo(map)
            .bindPopup(item.color,{
                polyline: key
            })
        
        mapPolylines.push(polyline)
        _addListenerToPolyline(polyline)
    })
}

function cleanAllMarkersAndPolylines(){
    mapMarker.forEach(marker => {
        map.removeLayer(marker)
    })
    mapPolylines.forEach(polyline => {
        map.removeLayer(polyline)
    })
}

function rebuildJsonWithNewMarkers(json,keys,new_latlng){
    const clone_keys = [...keys]
    let last_item_key = clone_keys.pop()
    let last_item = json[last_item_key]
    delete(json[last_item_key])

    let polyline_n = {
        "marker_1": last_item.marker_1,
        "marker_2": new_latlng,
        "color": "red",
    }

    let last = {
        "marker_1": new_latlng,
        "marker_2": last_item.marker_2,
        "color": "red",
    }

    json[`polyline_${clone_keys.length+1}`] = polyline_n
    json['last'] = last

    json_keys = Object.keys(marker_array_from_db)
    return json
}

function rebuildJsonWithDraggendEvent(){
    a_length = interimMarkerCoord.length
    let json = {}
    json['first'] = marker_array_from_db.first
    json.first.marker_2 = interimMarkerCoord[0]
    
    for (let i = 1; i < a_length; i++) {
        json[`polyline_${i+1}`] = {
            "marker_1": interimMarkerCoord[i-1],
            "marker_2": interimMarkerCoord[i],
            "color": marker_array_from_db[`polyline_${i+1}`].color,
        }
    }

    json['last'] = marker_array_from_db.last
    json.last.marker_1 = interimMarkerCoord[a_length-1]

    return json
}

map.addEventListener('click', event => {
    if (is_marker_editable){
        const event_latlng = [event.latlng.lat,event.latlng.lng]

        cleanAllMarkersAndPolylines()
        interimMarkerCoord.push(event_latlng)
    
        drawAllMarkerOnMap()
        marker_array_from_db = rebuildJsonWithNewMarkers(marker_array_from_db,json_keys,event_latlng)
        drawAllPolyline(marker_array_from_db,json_keys)
    }
})


function _addDragendListenerToMarkerAndRedrawPolyline(element){
    element.addEventListener('dragend',event => {
            let marker_number_name = event.target.options.type
            let marker_number = Number(marker_number_name.replace('new_marker_',''))
            let draggendMarkerLatLng = [event.target._latlng.lat,event.target._latlng.lng]
            
            interimMarkerCoord[marker_number-1] = draggendMarkerLatLng 
            
            cleanAllMarkersAndPolylines()
            drawAllMarkerOnMap()
    
            marker_array_from_db = rebuildJsonWithDraggendEvent()
            drawAllPolyline(marker_array_from_db,json_keys)
    })
}

let active_polyline

function _addListenerToPolyline(element){
    element.addEventListener('popupopen', event => {
        if (is_color_editable){
            document.getElementById('color_choice').style.cssText = 'display: block'
            momentum_color = event.target.options.color
            color_picker = document.getElementsByName('color')
            
            color_picker.forEach( color => {
                if (color.value == momentum_color){
                    color.checked =true
                }
            })

            active_polyline = element

        }
    })
}

color_picker = document.getElementsByName('color')
color_picker.forEach( el => {
    el.addEventListener('change', event => {
        let selected_color =  event.srcElement.attributes[3].value
        active_polyline.options.color = selected_color
        active_polyline.redraw()
        marker_array_from_db[active_polyline.options.json_key].color = selected_color
    })
})

document.querySelector('#marker_edit').addEventListener('click', () => {
    is_marker_editable = true
    is_color_editable = false
})
document.querySelector('#color_edit').addEventListener('click', () => {
    is_marker_editable = false
    is_color_editable = true
})

document.querySelector('#Save').addEventListener('click', () => {
    console.log(JSON.stringify(marker_array_from_db))
})