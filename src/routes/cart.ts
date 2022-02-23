import { addCart, getCart } from '../controllers/cart';
import {Router} from 'express';
const router = Router();
const {verifyUser} = require("../authenticate")

router.get('/', verifyUser, getCart)

router.post('/', verifyUser, addCart)

module.exports = router;