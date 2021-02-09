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

let coord = [52.287055 , 104.281047]



let new_icon = new L.Marker(coord, {
    icon: new L.DivIcon({
        className: 'my-div-icon',
        html: `<span style="background-color:white" class="my-div-span">
            <span class="badge badge-danger badge-pill modal-head-badge" id = "type_modal_info">13</span><br>
            <span class="badge badge-success badge-pill modal-head-badge" id = "type_modal_info">10</span>
        </span>`
    })
});
new_icon.addTo(map)
// let marker = new L.Marker(coord,).addTo(map)

// let html = `<span class="badge badge-danger badge-pill modal-head-badge" id = "type_modal_info">xDSL</span> - 13<br>
//     <span class="badge badge-success badge-pill modal-head-badge" id = "type_modal_info">PON</span> - 10`
// marker.bindTooltip(html, 
//     {
//         permanent: true, 
//         direction: 'right'
//     }
// )