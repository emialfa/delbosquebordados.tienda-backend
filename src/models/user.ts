import { Types, Schema, model, ObjectId } from "mongoose";

interface IUser {
    name: string;
    email: string;
    passwordHash?: string;
    phone?: string;
    document?: string;
    isAdmin?: boolean;
    street?: string;
    apartment?: string;
    zip?: string;
    city?: string;
    country?: string;
    cart?: string;
    shippingAdress?: string;
    activation?: boolean;
    favorites?: ObjectId[] | string[];
    refreshToken?: ISession[];
    authStrategy?: string;
    _id?: string;
}

interface ISession {
    refreshToken: string
}

const Session = new Schema<ISession>({
    refreshToken: {
      type: String,
      default: "",
    },
  })
const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
    },
    phone: {
        type: String,
    },
    document: {
        type: String,
        default: '',
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    authStrategy: {
        type: String,
        default: "local",
      },
    street: {
        type: String,
        default: ''
    },
    apartment: {
        type: String,
        default: ''
    },
    zip :{
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    cart: {
        type: String,
        default: '',
    },
    shippingAdress: {
        type: String,
    },
    activation:{
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: [Session],
      },
    favorites:  [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
    }],
});

userSchema.virtual('id').get(function (this: {_id: Types.ObjectId}) {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret, options) {
        delete ret.refreshToken
        return ret
    }
});


export default model<IUser>('User', userSchema);
