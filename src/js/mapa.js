(function() {
    const lat = 41.9097306;
    const lng = 12.2558141;
    const mapa = L.map('mapa').setView([lat, lng ], 10);
  
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


})()