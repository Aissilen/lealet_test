export function polylinePrinter(markerArray){
    let latLngForPolyline = []
    markerArray.forEach(element => {
        latLngForPolyline.push(element._latlng)
    })
       
    if (!polyline) {
        polyline = L.polyline(latLngForPolyline, {color: 'red'}).addTo(map)
    }else{
        polyline.setLatLngs(latLngForPolyline)
        polyline.redraw()
    }
}