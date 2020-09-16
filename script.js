const map = new L.map('mapid',
    {
    preferCanvas: true,
    center: [52.287055 , 104.281047],
    zoom: 12,
    })
    .setView([52.287055 , 104.281047], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);