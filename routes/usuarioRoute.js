import express, { Router } from "express";
import { formularioLogin, formularioRegistro , formularioOlvidePassword , registrar , cerrarSesion , confirmar, resetPassword, nuevoPassword, comprobarToken, autenticar } from "../controllers/usuarioController.js";


const router = express.Router()

// Routing
router.get('/login', formularioLogin)
router.post('/login', autenticar)

// Cerrar sesion
router.post('/cerrar-sesion' , cerrarSesion)

router.get('/registro', formularioRegistro)
router.post('/registro', registrar)

router.get('/confirmar/:token' , confirmar)

router.get('/olvide-password', formularioOlvidePassword)
router.post('/olvide-password', resetPassword)

// Almacena el nuevo password
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)

export default router


// Data Routing 
/* 
    .render   -->  Es utilizado para las vistas... Para las paginas. 
*/