(function(){
    const lat =  41.9000792;
    const lng =  12.4256885;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    const obtenerPropiedades = async () => {

        try {
            const url = '/api/propiedades'
            const respuesta = await fetch(url)
            const resultado = await respuesta.json()
            

        } catch (error) {
            console.log(error);
        }

    }

    obtenerPropiedades()
})()