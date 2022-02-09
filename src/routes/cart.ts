import { addCart, getCart } from '../controllers/cart';
import {Router} from 'express';
const router = Router();
const { authJwt } = require("../helpers/jwt");

router.get('/', authJwt, getCart)

router.post('/', authJwt, addCart)

module.exports = router;