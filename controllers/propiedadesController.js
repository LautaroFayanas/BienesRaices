import { validationResult } from "express-validator"
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
}


export {
    admin,
    crear,
    guardar
}