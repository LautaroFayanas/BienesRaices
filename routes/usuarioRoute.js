import express from "express";
import { formularioLogin, formularioRegistro , formularioOlvidePassword , registrar , confirmar, resetPassword } from "../controllers/usuarioController.js";


const router = express.Router()

// Routing
router.get('/login', formularioLogin)

router.get('/registro', formularioRegistro)
router.post('/registro', registrar)

router.get('/confirmar/:token' , confirmar)

router.get('/olvide-password', formularioOlvidePassword)
router.post('/olvide-password', resetPassword)


export default router


// Data Routing 
/* 
    .render   -->  Es utilizado para las vistas... Para las paginas. 
*/