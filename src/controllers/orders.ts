import Order from '../models/order';
import {Request, Response} from 'express'
const mercadopago = require ('mercadopago');
import User from '../models/user';
const orderConfirmMail = require("../templates/order-confirm")

mercadopago.configure({
    access_token: 'APP_USR-8352366877704564-122122-071839bb63d47195efaa44d0a4d64c6a-619410249'
});

export const getMyOrder = async (req: Request, res: Response) => {
    const userExist = await User.find({email: req.user?.email});
    if (!userExist) res.status(400).send({success: false});
    
    const orders = await Order.findById(req.params.id)
    res.send(orders)
}

export const getAllMyOrders =  async (req: Request, res: Response) => {
    const userExist = await User.find({email: req.user?.email});
    if (!userExist) res.status(400).send({success: false});
    
    const orders = await Order.find({userEmail: req.user?.email})
    res.send(orders)
}

export const getOrder =  async (req: Request, res: Response) => {
        const orders = await Order.findById(req.params.id)
        res.send(orders)
}

export const getAllOrders = async (req: Request, res: Response) => {
    const orders = await Order.find()
    res.send(orders)
}

export const mpwebhooks =  async (req: Request, res: Response) => {
    res.status(200).send('ok')
}

export const mpnotification =  async (req: Request, res: Response) => {
    if (!req.body.data.id) return res.status(400).send({success: false})

    const payment = await mercadopago.payment.findById(req.body.data.id);
    const merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id);
    const preferenceId = merchantOrder.body.preference_id;
    const status = payment.body.status;
    const statusDetail = payment.body.status_detail;
    const order = await Order.findOne({MPPreferenceId: preferenceId})
    const orderUpdateRes = await Order.findByIdAndUpdate(
        order?._id,
        {
            paymentMPStatus: status == 'approved' ? 'Aprobado' : status == 'in_process' ? 'Pendiente de aprobación' : status == 'rejected' ? 'Fallido' : status , 
            paymentMPStatus_detail: statusDetail,
        },
        { new: true}
    )
    if (!orderUpdateRes) return res.status(400).send({success: false, message: 'The order cannot be updated.'})
    
    return res.status(200).send({sucess: true});
  };


export const addMyOrder = async (req: Request,res: Response)=>{
    const userExist = await User.findOne({email: req.user?.email});
    if (!userExist) return res.status(400).send({success: false});
    
    let order = new Order({
        ...req.body,
        userEmail: req.user?.email, 
    })
    console.log(order)
    order = await order.save();

    if(!order) return res.status(400).send({success: false, message: 'The order cannot be created!'})
    
    const mailResponse = await orderConfirmMail(userExist.name, req.user?.email, req.body.paymentMPStatus, order._id)
    if (!mailResponse) return res.status(400).send({success:false, message: mailResponse});
    return res.status(200).send({success: true, message: mailResponse, order})
}

export const mpprefenceid =  async (req: Request, res: Response)=> {
    const orderFind = await Order.findOne({MPPreferenceId: req.body.MPPreferenceId})
    console.log(orderFind)
    const order = await Order.findByIdAndUpdate(
        orderFind?._id,
        {
            paymentMPStatus: req.body.paymentMPStatus,
            paymentMPStatus_detail: req.body.paymentMPStatus_detail,
        },
        { new: true}
    )

    if(!order) return res.status(400).send({success: false, messagge: 'The order cannot be update!'})

    return res.send(order);
}

export const updateOrder = async (req: Request, res: Response)=> {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true}
    )

    if(!order) return res.status(400).send({success: false, messagge: 'The order cannot be update!'})

    return res.send(order);
}

export const addPayment = async (req: Request,res: Response)=>{

    let preference:{items:object[];back_urls:object;auto_return:string} = {
        items:[],
        back_urls: {
            success: `${process.env.URL}/feedback/success`,
            failure: `${process.env.URL}/feedback/failure`,
            pending: `${process.env.URL}/feedback/pending`,
          },
          auto_return: "approved",
      };

    req.body.cart.forEach((p:{name:string;price:string;quantity:number}) => {
        preference.items.push({
            title: p.name,
            unit_price: p.price,
            quantity: p.quantity,
        })
    })
    preference.items.push({
        title: 'Costo de envío',
        unit_price: req.body.shippingCost,
        quantity: 1,
    })

    const response = await mercadopago.preferences.create(preference)
    const preferenceId = response.body.id;
    const sandbox_init_point = response.body.sandbox_init_point
    console.log(response.body)
    console.log(preferenceId)
    res.send({preferenceId, sandbox_init_point}); 
}

export const feedback = async (req: Request, res: Response) => {
    const payment = await mercadopago.payment.findById(req.query.payment_id);
    const merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id);
    const preferenceId = merchantOrder.body.preference_id;
    console.log(preferenceId)
    const status = payment.body.status;
    const statusDetail = payment.body.status_detail;
    res.status(200).send({preferenceId, status, statusDetail});
  };

export const deleteOrder =  async (req: Request, res: Response)=>{
    const orderFind = await Order.findById(req.params.id)
    if (!orderFind) return res.status(400).send({success: false})
    
    const orderDeleteRes = await Order.findByIdAndRemove(req.params.id);
    if(!orderDeleteRes) return res.status(404).json({success: false , message: "The order cannot be created!"})
    return res.status(200).json({success: true, message: 'the order is deleted!'})
    
}

export const getCount = async (req: Request, res: Response) =>{
    const orderCount = await Order.countDocuments((count) => count)
    if(!orderCount) res.status(400).json({success: false})
    
    res.status(200).send({ orderCount: orderCount });
}

