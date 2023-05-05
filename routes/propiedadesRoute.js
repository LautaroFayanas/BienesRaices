import Express from "express";
import { body } from 'express-validator'
import {admin , crear , guardar, agregarImagen, almacenarImange} from "../controllers/propiedadesController.js";
import protegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";


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

export default router;