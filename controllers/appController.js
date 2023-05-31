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
        departamentos,
        csrfToken: req.csrfToken()
    })

}

const categoria = async(req,res) =>{
    const { id } = req.params
    
    // Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id)
    if(!categoria){
       return res.redirect('/404')
    }

    // Obtener las propiedades de la categoria
    const propiedades = await Propiedad.findAll({
        where: {
            categoriaId: id
        },
        include: [
            {model: Precio, as: 'precio'}
        ]
    })

    res.render('categoria' , {
        pagina: 'Categoria',
        propiedades,
        csrfToken: req.csrfToken()
    })

}

const noEncontrado = (req,res) =>{
    res.render('404' , {
        pagina: 'No encontrada',
        csrfToken: req.csrfToken()

    })
}

const buscador = (req,res) =>{

}

export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}