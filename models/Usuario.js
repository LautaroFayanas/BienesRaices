import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import bcrypt from 'bcrypt'


// Nombre de la Tabla
const Usuarios = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING
    },
    confirmado: {
        type: DataTypes.BOOLEAN
    }
},{
    scopes: {
        eliminarPassword: {
            attribute: {
                exclude: ['password' , 'token' , 'confirmado' , 'createdAt' , 'updatedAt']
            }
        }
    }
});


// // Metodos Personalizados
// Usuarios.prototype.verificarPassword = function(password) {
//     return bcrypt.compareSync(password, this.password)
// }


export default Usuarios;