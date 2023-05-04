import { validationResult } from "express-validator"
import { Precio, Categoria, Propiedad } from '../models/index.js'


const admin = (req,res) => {
    res.render('propiedades/admin',{
        pagina: 'Mis propiedades',
        
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

const agregarImagen = async(req,res)=>{

    const { id } = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }


    // Validar que la propiedad no este publicada anteriormente
    if(propiedad.publicado){
        return res.redirect('/mis-propiedades')
    }

    // Validar que la propiedad pertenece a quien visite esta pagina
    if( req.usuario.id.toString() !== propiedad.usuarioId.toString() ){
        return res.redirect('/mis-propiedades')
    }


    res.render('propiedades/agregar-imagen' , {
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad
    })
}


export {
    admin,
    crear,
    guardar,
    agregarImagen
}