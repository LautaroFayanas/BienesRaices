import {check, validationResult} from 'express-validator';
import bcrypt from 'bcrypt'
import Usuarios from '../models/Usuario.js';
import { generarJWT,  generarId } from '../helper/token.js'
import { emailOlvidePassword, emailRegistro } from '../helper/emails.js';
import { comparar, encript } from '../helper/bcrypyCompare.js';


const formularioLogin = (req,res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesion',
        csrfToken: req.csrfToken()
    })
};


const formularioRegistro = (req,res) => {
    
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
};

const autenticar = async (req,res) => {

    // Validacion
    await check('email').isEmail().withMessage('El email es obligatorio').run(req)
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req);

    let errors = validationResult(req)

    // Verificar que el resultado esta vacio
    if(!errors.isEmpty()){
        // No esta vacio, entonces hay errores
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: errors.array()
        })
    };


    const { email , password } = req.body;
    // Comprobar si el Usuario existe
    const usuario = await Usuarios.findOne( { where:{email} } )
    if(!usuario){
        return res.render('auth/login', {
            errores: [{msg: 'El usuario no existe! '}]
        })
    };
    
    
    // Comprobar si el Usuario esta Confirmado
    if(!usuario.confirmado){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Tu cuenta no ha sido confirmada! '}]
        })
    };


    // Password
    // if(!usuario.password){
    //     return res.render('auth/login', {
    //         pagina: 'Iniciar Sesion',
    //         csrfToken: req.csrfToken(),
    //         errores: [{msg: 'Debes colocar un password! '}]
    //     })
    // };
    


    // Revisar el password

    const checkPassword = comparar(password, usuario.password)
    if(!checkPassword){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El password NO es el mismo! '}]
        })
    }

    // Autenticar Usuario
    const token = generarJWT({id: usuario.id , nombre: usuario.nombre})

    // Almacenar en un cookie
    return res.cookie('_token', token , {
        httpOnly: true
    }).redirect('/mis-propiedades')

}

const cerrarSesion = (req,res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}


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
            csrfToken: req.csrfToken(),
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
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario ya esta registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
                password: req.body.password,
            }
        })
    }
    
    
    const hash = await bcrypt.hash(password,10)
    
    // Almacenar un Usuario
    const usuario = await Usuarios.create({
        nombre,
        email,
        token: generarId(),
        password:hash
    });
        
    res.json(usuario)

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
        mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo.',
        error: true
       })
    }
    // Confirmar la Cuenta 
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();       // Metodo del ORM , Guardamos en la Base de Datos. Es como un Commit

    res.render('auth/confirmarCuenta',{
        pagina: 'Cuenta Confirmada !',
        mensaje: 'La cuenta se confirmo correctamente.',
       })

    
}

const formularioOlvidePassword = (req,res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recuperar tu acceso a BienesRaices',
        csrfToken: req.csrfToken()
    })
};

const resetPassword = async (req,res) => {

     // Validacion del formulario
     await check('email').isEmail().withMessage('Eso no parece un email').run(req)

     let errors = validationResult(req)
     
     // Verificar que el resultado esta vacio
     if(!errors.isEmpty()){
         // No esta vacio, entonces hay errores
         return res.render('auth/olvide-password', {
            pagina: 'Recuperar tu acceso a BienesRaices',
            csrfToken: req.csrfToken(),
            errores: errors.array()
         })
     };

     // Comprobando si el usuario esta registrado
     const { email } = req.body;
     const usuario = await Usuarios.findOne({where: {email}})
     if(!usuario){
        return res.render('auth/olvide-password', {
            pagina: 'Recuperar tu acceso a BienesRaices',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El email no pertenece a ningun usuario'}]
         })
     }

     // Generar un Token y enviar el email.
     usuario.token = generarId();
     await usuario.save();

     // Enviar un email
     emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
     });

     // Renderizar un mensaje indicando instrucciones al Usuario via email, de como modificar las password.
     res.render('templates/mensaje',{
        pagina: 'Reestablece tu password',
        mensaje: 'Hemos enviado un email con las instrucciones'
    })     
}

const comprobarToken = async (req,res) => {
    // Si no es valido mostramos un mensaje de error
    const { token } = req.params;
    const usuario = await Usuarios.findOne({where:{token}})
    if(!usuario){
        return res.render('auth/confirmarCuenta',{
         pagina: 'Reestablece tu password',
         mensaje: 'Hubo un error al validar tu informacion, intenta de nuevo.',
         error: true
        })
     };

     // Mostrar formulario para modificar el Password
     res.render('auth/resetPassword' , {
        pagina: 'Reestablece tu password aqui =)',
        csrfToken: req.csrfToken(),
     })
}

const nuevoPassword = async (req,res) => {
    // Validar el password
    await check('password').isLength({ min: 2 }).withMessage('El password debe contener al menos 2 caracteres').run(req);

    let errors = validationResult(req)
    
    // Verificar que el resultado esta vacio
    if(!errors.isEmpty()){
        // No esta vacio, entonces hay errores
        return res.render('auth/resetPassword', {
            pagina: 'Reestablece tu password',
            csrfToken: req.csrfToken(),
            errores: errors.array(), 
        })
    };

    const { token } = req.params;
    const { password } = req.body;

    // Identificar quien hace el cambio
    const usuario = await Usuarios.findOne({where:{token}})

    // Hashear el nuevo password

    usuario.password = await encript(password);
    usuario.token = null;

    res.render('auth/confirmarCuenta',{
        pagina: 'Password Reestablecido',
        mensaje: 'El password se guardo correctamente =)'
    })

    await usuario.save();
}

export {
    formularioLogin,
    autenticar,
    cerrarSesion,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}