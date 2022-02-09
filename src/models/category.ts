import {model, Schema, Types} from 'mongoose';

interface ICategory {
    name: string;
    icon?: string;
    color?: string;
}
const categorySchema = new Schema<ICategory>({
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


categorySchema.virtual('id').get(function (this: {_id: Types.ObjectId}) {
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtuals: true,
});

export default model<ICategory>('Category', categorySchema);
