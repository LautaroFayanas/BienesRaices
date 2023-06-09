import Express from "express";
import { body } from 'express-validator'
import {admin , crear , guardar, agregarImagen, almacenarImange , editar , guardarCambios, eliminar, cambiarEstado , mostrarPropiedad , enviarMensaje, leerMensajes} from "../controllers/propiedadesController.js";
import protegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";
import identificarUsuario from '../middleware/identificarUsuario.js'


const router = Express.Router();

router.get('/mis-propiedades' , protegerRuta , admin )
router.get('/propiedades/crear' , protegerRuta , crear )
router.post('/propiedades/crear' , 
    protegerRuta ,
    body('titulo').notEmpty().withMessage('El titulo de anuncio es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripcion no debe ir vacia').isLength({max: 150}),  
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),  
    body('precio').isNumeric().withMessage('Selecciona un rango de precios'),  
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),  
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamientos'),  
    body('baños').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardar )    

router.get('/propiedades/agregar-imagen/:id',
    protegerRuta,
    agregarImagen)

router.post('/propiedades/agregar-imagen/:id' , 
    protegerRuta,
    upload.single('imagen'), // Si son muchas imagenes para subir se usa .array()
    almacenarImange
)

router.get('/propiedades/editar/:id' , 
    protegerRuta,
    editar
)

router.post('/propiedades/editar/:id' , 
    protegerRuta ,
    body('titulo').notEmpty().withMessage('El titulo de anuncio es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripcion no debe ir vacia').isLength({max: 150}),  
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),  
    body('precio').isNumeric().withMessage('Selecciona un rango de precios'),  
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),  
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamientos'),  
    body('baños').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardarCambios)    

router.post('/propiedades/eliminar/:id',
    protegerRuta,
    eliminar
)

router.put('/propiedades/:id', 
    protegerRuta,
    cambiarEstado
)

// Area Publica
router.get('/propiedad/:id', 
        identificarUsuario,
    mostrarPropiedad
)


// Almacenar mensajes
router.post('/propiedad/:id', 
    identificarUsuario,
    body('mensaje').isLength({min: 10}).withMessage('El mensaje no puede ir vacio o es muy corto'),
    enviarMensaje
)


router.get('/mensajes/:id',
    protegerRuta,
    leerMensajes
)



export default router;