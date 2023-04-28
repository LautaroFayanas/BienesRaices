import { validationResult } from "express-validator"
import { Precio, Categoria, Propiedad } from '../models/index.js'


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
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
}

const guardar = async (req,res) => {
    // Validacion
    let resultado = validationResult(req)
    if(!resultado.isEmpty()){

        const [categorias,precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll(),
        ])

        return res.render('propiedades/crear' , {
            pagina: 'Crear propiedades',
            barra: true,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }

    // Crear un registro

    const { titulo , descripcion , habitaciones , estacionamiento , baños , calle , lat , lng , precio , categoria  } = req.body;
    
    const { id: usuarioId } = req.usuario

    try {
        const propiedadAlmacenadaEnDB = await Propiedad.create({
            titulo ,
            descripcion ,
            habitaciones , 
            estacionamiento , 
            baños ,
            calle ,
            lat ,
            lng ,
            precioId: precio,
            categoriaId: categoria,
            usuarioId,
            img: ''
        })

        const { id } = propiedadAlmacenadaEnDB

        res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch (error) {
        console.log(error);
    }
}


export {
    admin,
    crear,
    guardar
}