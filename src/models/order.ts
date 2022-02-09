import { Schema, Types, model } from "mongoose";

interface IOrderSchema {
    orderItems: string;
    name: string;
    shippingAddress: string;
    city: string;
    zip: string;
    phone: string;
    status: string;
    userEmail: string;
    document: string;
    email: string;
    paymentMPStatus?: string;
    paymentMPStatus_detail?: string;
    MPPreferenceId?: string;
    MPbutton?: boolean;
    paymentStatus?: string;
    trackingCode?: string;
    dateOrdered?: Date;
}

const orderSchema = new Schema<IOrderSchema>({
    orderItems: {
        type: String,
        required:true
    },
    name: {
        type: String,
        required: true,
    },
    shippingAddress: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Pendiente',
    },
    userEmail: {
        type: String,
        required: true,
    },
    document: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    paymentMPStatus:{
        type: String,
        default: 'No iniciado'
    },
    paymentMPStatus_detail:{
        type: String,
        default: ''
    },
    MPPreferenceId : {
        type:String,
    },
    MPbutton: {
        type: Boolean,
        default: false,
    },
    paymentStatus:{
        type: String,
        default: 'No iniciado'
    },
    trackingCode:{
        type: String,
        default: 'No se ha especificado aún.'
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    },
})

orderSchema.virtual('id').get(function (this: {_id: Types.ObjectId}) {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});

export default model<IOrderSchema>('Order', orderSchema);
