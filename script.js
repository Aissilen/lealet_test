import {polylinePrinter} from './utility'

const map = new L.map('map',
{
    preferCanvas: true,
    center: [52.287055 , 104.281047],
    zoom: 14,
})
.setView([52.287055 , 104.281047], 14)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

let mapMarker = []
let polyline

let rkMarker = new L.Marker([52.28664250209102, 104.28634643554689],{
    type : 'rk',
    draggable: false,
}).bindPopup('rk').addTo(map)

let rsMarker = new L.Marker([52.282494522127635, 104.29347038269043],{
    type : 'rs',
    draggable: false,
}).bindPopup('rs').addTo(map)

mapMarker.push(rkMarker,rsMarker)

polylinePrinter(mapMarker)

map.addEventListener('click', event =>{
    if (mapMarker.length >= 2) {
        let bufMarker = mapMarker[mapMarker.length -1]
        let newMarker = new L.Marker(event.latlng,{
            type : '_newMarker_'+(mapMarker.length -1),
            draggable: true,
        }).bindPopup('rk').addTo(map)

        addDragendListenerToMarkerAndRedrawPolyline(newMarker)

        mapMarker.pop()
        mapMarker.push(newMarker,bufMarker)
        
        polylinePrinter(mapMarker)
    }
})



function addDragendListenerToMarkerAndRedrawPolyline(element){
    element.addEventListener('dragend',event => {
        polylinePrinter(mapMarker)
    })
}

const cancelBtn = document.getElementById('Cancel')
const saveBtn = document.getElementById('Save')

cancelBtn.addEventListener('click', cancelBtnRemoveMarker)
saveBtn.addEventListener('click', saveNewCoordToBackend)

function cancelBtnRemoveMarker(){
    if (mapMarker.length > 2){
        let bufMarker = mapMarker[mapMarker.length - 1]
        let markerToRemove = mapMarker[mapMarker.length - 2]
        markerToRemove.remove()
        mapMarker.pop()
        mapMarker.pop()
        mapMarker.push(bufMarker)
        polylinePrinter(mapMarker)
    }else{
        console.log('nothink to cancel')
    } 
}

function saveNewCoordToBackend(){
    let arrayToSave = [...mapMarker]

    if (mapMarker.length > 2){
        arrayToSave.pop()
        arrayToSave.shift()
    }else{
        arrayToSave = []
    }
    console.log('new Marker -', arrayToSave);
}