import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const { email , nombre , token } = datos;

    // Enviar Email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta de Bienes Raices',
        text: 'Confirma tu cuenta de Bienes Raices',
        html: `
            <p>Hola ${nombre} , comprueba tu cuenta en Bienes Raices</p>
            <p>Tu cuenta ya esta lista! Solo debes confirmarla en el siguiente enlace... </p>
            
            <a href=''>Confirmar Cuenta</a>

            <p>Si no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })
}

export {
    emailRegistro
}