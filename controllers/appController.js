import { Precio , Categoria , Propiedad} from '../models/index.js'

const inicio = async(req,resp) =>{

    const [ categorias , precios , casas , departamentos ] = await Promise.all([
        Categoria.findAll({ raw: true }),
        Precio.findAll({ raw: true }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 1
            },
            include: [
                {
                    model: Precio,
                    as: 'precio'
                }
            ],
            order: [
                ['createdAt' , 'DESC']
            ]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 2
            },
            include: [
                {
                    model: Precio,
                    as: 'precio'
                }
            ],
            order: [
                ['createdAt' , 'DESC']
            ]
        })
    ])

    resp.render('inicio' , {
        pagina: 'Inicio',
        categorias,
        precios,
        casas,
        departamentos
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