import {check, validationResult} from 'express-validator';
import Usuarios from '../models/Usuario.js';

const formularioLogin = (req,res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesion'
    })
}

const formularioRegistro = (req,res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta'
    })
}

const registrar = async (req,res) => {

    // Validacion del formulario
    await check('nombre').notEmpty().withMessage('Debes completar el nombre').run(req)
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    await check('password').isLength({ min: 6 }).withMessage('El password debe contener al menos 6 caracteres').run(req)
    await check('repetir_password').equals('password').withMessage('La password debe ser la misma').run(req)

    let resultado = validationResult(req)

   
    // Verificar que el resultado esta vacio
    if(!resultado.isEmpty()){
        // No esta vacio, entonces hay errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array()
        })
    }

    const usuario = await Usuarios.create(req.body)
    res.json(usuario)
}

const formularioOlvidePassword = (req,res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recuperar tu acceso a BienesRaices'
    })
}





export {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword
}