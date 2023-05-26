
(function(){
    const lat =  41.9000792;
    const lng =  12.4256885;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);

    let markers = new L.FeatureGroup().addTo(mapa)

    let propiedades = []

    
    // Filtros
    const filtros = {
        categoria: '',
        precio: ''
    }
    
    const categoriaSelect = document.querySelector('#categorias')
    const precioSelect = document.querySelector('#precios')

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);



    // Filtrado de Categorias y Precios
    categoriaSelect.addEventListener('change' , e => {
        filtros.categoria = +e.target.value
        filtrarPropiedades();
    })
    
    precioSelect.addEventListener('change' , e => {
        filtros.precio = +e.target.value
        filtrarPropiedades();
        
    })

    
    const obtenerPropiedades = async () => {

        try {
            const url = '/api/propiedades'
            const respuesta = await fetch(url)
            propiedades = await respuesta.json()

            mostrarPropiedades(propiedades)
            

        } catch (error) {
            console.log(error);
        }

    }

    const mostrarPropiedades = propiedades => {

        propiedades.forEach(propiedad => {
            // Agregar pines
            const marker = new L.marker([propiedad?.lat, propiedad?.lng] , {
                autoPan: true
            })
            
            .addTo(mapa)
            .bindPopup(`
            <p class='text-indigo-600 font-bold'>${propiedad.categoria.nombre}</p>
                <h1 class='text-sm font-extrabold uppercase my-2'> ${propiedad?.titulo} </h1>
                <img src='/upload/${propiedad?.img}' alt='Imagen de la propiedad' />
                <p class='text-gray-600 font-bold'>${propiedad.precio.nombre}</p>
                <a href='/propiedad/${propiedad.id}' class='bg-indigo-600 block p-2 text-center font-bold uppercase text-white'>Ver Propiedades</a>

            `)
            markers.addLayer(marker)
            
        })

    }

    const filtrarPropiedades = () => {
        
        const resultado = propiedades.filter( filtrarCategoria ).filter( filtrarPrecio )
        console.log(resultado);

    }

    const filtrarCategoria = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad ; 
    const filtrarPrecio = propiedad => filtros.precio ? propiedad.precioId === filtros.precio : propiedad ;
    


    obtenerPropiedades()
})()