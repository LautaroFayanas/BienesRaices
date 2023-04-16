import {check, validationResult} from 'express-validator';
import { generarId } from '../helper/token.js'
import Usuarios from '../models/Usuario.js';
import { emailRegistro } from '../helper/emails.js';


const formularioLogin = (req,res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesion'
    })
};

const formularioRegistro = (req,res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta'
    })
};

const registrar = async (req,res) => {
    
    // Validacion del formulario
    await check('nombre').notEmpty().withMessage('Debes completar el nombre').run(req)
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    await check('password').isLength({ min: 2 }).withMessage('El password debe contener al menos 2 caracteres').run(req);
    await check('repetir_password').equals(req.body.password).withMessage('La password debe ser la misma').run(req)
    
    let errors = validationResult(req)
    
    // Verificar que el resultado esta vacio
    if(!errors.isEmpty()){
        // No esta vacio, entonces hay errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: errors.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
                password: req.body.password,
            }
        })
    };
    
    // Extraer los datos para validacion de Email
    const { nombre , email , password } = req.body
    
    // Verificar que el Usuario no sea Duplicado
    const existeUsuario = await Usuarios.findOne({ where: { email } })
    if(existeUsuario){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: [{msg: 'El usuario ya esta registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
                password: req.body.password,
            }
        })
    }


    // Almacenar un Usuario
    const usuario = await Usuarios.create({
            nombre,
            email,
            password,
            token: generarId(),
    });
    
    //res.json(usuario)

    // Enviando email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    // Mostrar mensaje de Confirmacion de Cuenta
    res.render('templates/mensaje',{
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos enviado un mensaje de confirmacion, presiona el enlace'
    })      
};

// Comprueba una cuenta
const confirmar = async (req,res) => {
    const { token } = req.params;
    
    // Verificar si el Token es Valido
    const usuario = await Usuarios.findOne({where: {token}})
    if(!usuario){
       return res.render('auth/confirmarCuenta',{
        pagina: 'Error al confirmar tu cuenta',
        mensaje: 'Hubo un error al confirmar tu cuenta ,intenta de nuevo.',
        error: true
       })
    }
    // Confirmar la Cuenta !

    
}

const formularioOlvidePassword = (req,res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recuperar tu acceso a BienesRaices'
    })
};




export {
    formularioLogin,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword
}