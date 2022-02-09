import mongoose, {ConnectOptions} from "mongoose";
const {MONGODB_URI} = require('./helpers/config')

mongoose.connect(`${MONGODB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions)
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err)=> {
    console.log(err);
})


