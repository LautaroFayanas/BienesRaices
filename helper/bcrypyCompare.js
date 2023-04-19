import bcrypt from 'bcrypt'


const encript = async(textPlain) =>{
    const hash = await bcrypt.hash(textPlain,10)
    return hash
}

const comparar = (passwordPlain , hashPassword) => {
    return  bcrypt.compareSync(passwordPlain, hashPassword)
}

export {
    encript,
    comparar
}