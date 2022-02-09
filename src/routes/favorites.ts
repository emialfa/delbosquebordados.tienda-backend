import { addFavorites, getFavorites } from '../controllers/favorites';
import {Router} from 'express';
const router = Router();
const { authJwt } = require("../helpers/jwt");

router.get('/', authJwt, getFavorites)

router.post('/', authJwt, addFavorites)

module.exports = router;