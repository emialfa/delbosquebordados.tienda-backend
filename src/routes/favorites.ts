import { addFavorites, getFavorites } from '../controllers/favorites';
import {Router} from 'express';
const router = Router();
const {verifyUser} = require("../authenticate")

router.get('/', verifyUser, getFavorites)

router.post('/', verifyUser, addFavorites)

module.exports = router;