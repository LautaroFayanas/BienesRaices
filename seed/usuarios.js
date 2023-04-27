import bcrypt from 'bcrypt'

const usuarios = [
    {
        nombre: 'Lautaro',
        email: 'lau@lau.com',
        confirmado: 1,
        password: bcrypt.hashSync('password' , 10)
    }
]

export default usuarios