import Categoria from "../models/Categoria.js"
import Precio from "../models/Precio.js"


const admin = (req,res) => {
    res.render('propiedades/admin',{
        pagina: 'Mis propiedades',
        barra: true
    })
}

const crear = async (req,res) => {

    // Consultar modelo de precios y categorias
    const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll(),
    ])

    res.render('propiedades/crear' , {
        pagina: 'Crear propiedades',
        barra: true,
        categorias,
        precios
    })
}

export {
    admin,
    crear
}