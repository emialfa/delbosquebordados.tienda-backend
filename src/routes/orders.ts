import { addMyOrder, addPayment, deleteOrder, feedback, getAllMyOrders, getAllOrders, getCount, getMyOrder, getOrder, mpnotification, mpprefenceid, mpwebhooks, updateOrder } from '../controllers/orders';
import {Router} from 'express';
const router = Router();
const { authJwt, authAdminJwt } = require("../helpers/jwt");

router.get("/single/:id",authJwt, getMyOrder)

router.get("/all", authJwt, getAllMyOrders)

router.get("/admin/single/:id", authAdminJwt, getOrder)

router.get('/admin/all', authAdminJwt, getAllOrders)

router.post('/mpwebhooks', mpwebhooks)

router.post('/mpnotification', authJwt, mpnotification)

router.post('/', authJwt, addMyOrder)

router.put('/mpprefenceid',authJwt,  mpprefenceid)

router.put('/:id', updateOrder)

router.delete('/:id', deleteOrder)

router.post('/payment', addPayment)

router.get("/feedback", feedback)

router.get(`/get/count`, getCount)

module.exports = router;