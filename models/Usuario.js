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
}, {
    // Hook de BCRYPT // Hashear Password del Usuario Antes de Subirlo a mi Base de Datos.
    beforeCreate: async function(Usuarios) {
           try {
             const salt = await bcrypt.genSalt(10)
             const hashedPassword = await bcrypt.hash(Usuarios.password, salt);
             Usuarios.password = hashedPassword
             Usuarios()
           } catch (error) {
            console.log('Hay Error');
           }
        }
});

export default Usuarios;