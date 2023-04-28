import jwt from "jsonwebtoken";
import { Usuario } from '../models/index.js'

const protegerRuta = async (req, res, next) => {

    // Verificar si hay Token
    const { _token } = req.cookies;
    console.log(_token);
    if (!_token) {
        return res.redirect('/auth/login')
    }

    // Comprobar el Token
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        console.log(decoded)
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)
        console.log(usuario);

        //Almacenar el Usuario al REQ
        if (usuario) {
            req.usuario = usuario

        } else {
            return res.redirect('/auth/login')
        }

        return next();

    } catch (error) {
        console.log('Hubo un error con el token');
        return res.clearCookie('_token').redirect('/auth/login')
    }

}

export default protegerRuta;