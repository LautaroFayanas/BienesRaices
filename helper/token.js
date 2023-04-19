import Jwt from 'jsonwebtoken';


// Autenticar el Usuario
const generarJWT = datos => Jwt.sign({ id : datos.id , nombre: datos.nombre }, process.env.JWT_SECRET , { expiresIn: '1d' })

const generarId = () => Date.now().toString(20)+Math.random().toString(20).substring(2);

export {
    generarId,
    generarJWT
}