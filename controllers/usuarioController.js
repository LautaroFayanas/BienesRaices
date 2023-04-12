import Usuarios from '../models/Usuario.js'

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