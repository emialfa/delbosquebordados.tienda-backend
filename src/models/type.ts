import {model, Schema, Types} from 'mongoose';

interface IType {
    name: string;
    icon?:string;
    color?:string;
}

const typeSchema = new Schema<IType>({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    color: { 
        type: String,
    }
})


typeSchema.virtual('id').get(function (this: {_id: Types.ObjectId}) {
    return this._id.toHexString();
});

typeSchema.set('toJSON', {
    virtuals: true,
});

export default model<IType>('Type', typeSchema);
