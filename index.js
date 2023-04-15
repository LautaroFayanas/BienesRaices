// Lo que hace require es extraer express de node_modules para usarlo en este archivo
import express from 'express'
import usuarioRoute from './routes/usuarioRoute.js'
import db from './config/db.js'


// Crear App
const app = express()

// Habilitar lectura de formularios
app.use(express.urlencoded({extended: true}))

// Conexion Base de Datos
try {
    await db.authenticate();
    console.log('Conexion Correcta a la DB');
    db.sync()
} catch (error) {
    console.log(error);
}
 

//  Habilitar Pug
// - 1 - Indico que quiero usar pug - 2 - Indico la carpeta donde se encuntra mi archivo pug
app.set('view engine' , 'pug')          
app.set('views', 'views')             

// Carpeta Publica
app.use(express.static('public'))


// Routing
app.use('/auth' , usuarioRoute )


// Definir un puerto para arrancar el proyecto
const port = process.env.PORT || 3000



app.listen(port , () => {
    console.log(`Servidor conectado en puerto ${port}`);
})