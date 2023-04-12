import express from "express";
import { formularioLogin, formularioRegistro , formularioOlvidePassword , registrar } from "../controllers/usuarioController.js";


const router = express.Router()

// Routing
router.get('/login', formularioLogin)
router.get('/registro', formularioRegistro)
router.post('/registro', registrar)
router.get('/olvide-password', formularioOlvidePassword)


export default router


// Data Routing 
/* 
    .render   -->  Es utilizado para las vistas... Para las paginas. 
*/