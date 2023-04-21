import Express from "express";
import {admin} from "../controllers/propiedadesController.js";




const router = Express.Router();

router.get('/mis-propiedades' , admin)

export default router;