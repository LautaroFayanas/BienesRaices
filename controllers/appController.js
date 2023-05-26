import { Precio , Categoria , Propiedad} from '../models/index.js'

const inicio = async(req,resp) =>{

    const [ categorias , precios ] = await Promise.all([
        Categoria.findAll({ raw: true }),
        Precio.findAll({ raw: true }),
    ])

    resp.render('inicio' , {
        pagina: 'Inicio',
        categorias,
        precios
    })

}

const categoria = (req,resp) =>{

}

const noEncontrado = (req,resp) =>{

}

const buscador = (req,resp) =>{

}

export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}