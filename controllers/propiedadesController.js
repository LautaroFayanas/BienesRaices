import { unlink } from 'node:fs/promises'
import { validationResult } from "express-validator"
import { Precio, Categoria, Propiedad } from '../models/index.js'

const admin = async (req,res) => {

    // Leer query String
    const { pagina: paginaActual } = req.query

    const expresionRegular = /^[0-9]$/

    if(!expresionRegular.test(paginaActual)){
        return res.redirect('/mis-propiedades?pagina=1')
    }

    try {

    const { id } = req.usuario;
        
    // Limite & offset Paginador
    const limit = 8;
    const offset = ((paginaActual * limit) - limit)

    const [propiedades , total] = await Promise.all([
        Propiedad.findAll({
            limit,
            offset,
            where: {
                usuarioId: id
            },
            include: [
                {model: Categoria, as: 'categoria'},
                {model: Precio, as: 'precio'}
            ]
        }),
        Propiedad.count({
            where:{
                usuarioId: id
            }
        })
    ])

    res.render('propiedades/admin',{
        pagina: 'Mis propiedades',
        propiedades,
        csrfToken: req.csrfToken(),
        paginas: Math.ceil(total / limit),
        paginaActual: Number(paginaActual),
        total,
        offset,
        limit
    })    

    } catch (error) {
      console.log(error);  
    }

    
}

const crear = async (req,res) => {

    // Consultar modelo de precios y categorias
    const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll(),
    ])

    res.render('propiedades/crear' , {
        pagina: 'Crear propiedad',
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
            pagina: 'Crear propiedad',
            
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

const almacenarImange = async(req,res,next) => {
    const { id } = req.params

    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    if(propiedad.publicado){
        return res.redirect('/mis-propiedades')
    }

    if( req.usuario.id.toString() !== propiedad.usuarioId.toString() ){
        return res.redirect('/mis-propiedades')
    }

    try {
        // console.log(req.file);

        // Almacenar la Imagen y publicar la Propiedad
        propiedad.img = req.file.filename
        propiedad.publicado = 1
        await propiedad.save()
       
        next()

    } catch (error) {
        console.log(error);
    }
}

const editar = async(req,res) => {

    const { id } = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URL es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }
    
    // Consultar modelo de precios y categorias
     const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll(),
    ])

    res.render('propiedades/editar' , {
        pagina: `Editar propiedad ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    })
}


const guardarCambios = async(req,res) => {

    // Verificar la validacion
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        const [categorias,precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll(),
        ])

        return res.render('propiedades/editar' , {
            pagina: 'Editar propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }

    const { id } = req.params

    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URL es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }

    // Como rescribir el objeto y actualizarlo
    try {
        const { titulo , descripcion , habitaciones , estacionamiento , baños , calle , lat , lng , precio: precioId , categoria: categoriaId  } = req.body;

        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            baños,
            calle,
            lat,
            lng,
            precioId,
            categoriaId   
        })

        await propiedad.save()

        res.redirect('/mis-propiedades')

    } catch (error) {
        console.log(error);
    }
}

const eliminar = async(req,res) =>{

    const { id } = req.params

    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    // Revisar que quien visita la URL es quien creo la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }

    // Eliminar la imagen asociada
    await unlink(`public/upload/${propiedad.img}`)

    console.log(`Se elimino la imagen ${propiedad.img}`);

    // Eliminar la propiedad
    await propiedad.destroy()
    return res.redirect('/mis-propiedades')
}

// Muestra una Propiedad
const mostrarPropiedad = async(req,res) => {

    const { id } = req.params;

    // Comprobar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {model: Precio, as: 'precio'},
            {model: Categoria, as: 'categoria'},
        ]
    })


    if(!propiedad){
        return res.redirect('/404')
    }

    res.render('propiedades/mostrar', {
        propiedad,
        pagina: Propiedad.titulo
    })
}




export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImange,
    editar,
    guardarCambios,
    eliminar,
    mostrarPropiedad
}