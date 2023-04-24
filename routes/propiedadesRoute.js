import Express from "express";
import {admin , crear} from "../controllers/propiedadesController.js";




const router = Express.Router();

router.get('/mis-propiedades' , admin)
router.get('/propiedades/crear' , crear)

export default router;