import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';

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
    hook: {
        beforeCreate: async function(Usuarios) {
            const hash = await bcrypt.genSalt(10)
            Usuarios.password = await bcrypt.hash(Usuarios.password, hash);
        }
    }
});

export default Usuarios;