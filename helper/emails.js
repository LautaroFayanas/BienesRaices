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
            
            <a href='${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}'>Confirmar Cuenta</a>

            <p>Si no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })
};

const emailOlvidePassword = async (datos) => {
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
        subject: 'Reestablece tu password de Bienes Raices',
        text: 'Reestablece tu password de Bienes Raices',
        html: `
            <p>Hola ${nombre} , has solicitado reestablecer tu password en Bienes Raices</p>
            <p>Sigue el siguiente enlace para generar un password nuevo: </p>
            
            <a href='${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}'>Reestablecer Password</a>

            <p>Si no solicitaste el cambio de password, puedes ignorar el mensaje</p>
        `
    })
}



export {
    emailRegistro,
    emailOlvidePassword
}