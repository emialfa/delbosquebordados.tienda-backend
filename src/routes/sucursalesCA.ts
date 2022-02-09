import {Router} from 'express';
const router = Router();
import { getCodPostal } from '../controllers/sucursalesCA';

router.get(`/:codpostal`, getCodPostal)

module.exports = router;