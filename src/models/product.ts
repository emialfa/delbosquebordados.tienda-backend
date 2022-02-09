import {model, Schema, Types} from 'mongoose';

interface IProduct {
    name: string;
    description: string;
    richDescription?: string;
    image?: string;
    images?: Types.Array<string>;
    brand?: string;
    price?: number;
    category: string;
    type: string;
    countInStock: number;
    rating?: number;
    numReviews?: number;
    isFeatured?: boolean;
    dateCreated?: Date;
  }

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    brand: {
        type: String,
        default: ''
    },
    price : {
        type: Number,
        default:0
    },
    category: {
       type: String,
       required: true,
       default: ''
    },
    type: {
        type: String,
        required: true,
        default: ''
     },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
})

productSchema.virtual('id').get(function (this: {_id: Types.ObjectId}) {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});


export default model<IProduct>('Product', productSchema);
