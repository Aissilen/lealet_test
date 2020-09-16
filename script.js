const map = new L.map('map',
{
    preferCanvas: true,
    center: [52.287055 , 104.281047],
    zoom: 14,
})
.setView([52.287055 , 104.281047], 14)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

let mapMarker = []

let rkMarker = new L.Marker([52.28664250209102, 104.28634643554689],{
    type : 'rk',
    draggable: true,
}).bindPopup('rk').addTo(map)

let rsMarker = new L.Marker([52.282494522127635, 104.29347038269043],{
    type : 'rs',
    draggable: true,
}).bindPopup('rs').addTo(map)

mapMarker.push(rkMarker,rsMarker)

map.addEventListener('click', event =>{
    // console.log(event.latlng)
    // console.log(rkMarker.getLatLng())
    if (mapMarker.length >= 2) {
        let bufMarker = mapMarker[mapMarker.length -1]
        let newMarker = new L.Marker(event.latlng,{
            type : '_newMarker_'+(mapMarker.length -1),
            draggable: true,
        }).bindPopup('rk').addTo(map)
        
        
        mapMarker.pop()
        mapMarker.push(newMarker,bufMarker)
        
        
        console.log(mapMarker)
    }
})