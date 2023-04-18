import { DataTypes } from 'sequelize';
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
});

export default Usuarios;