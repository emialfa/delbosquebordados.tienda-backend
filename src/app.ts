import express, {Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';
const app: Application = express();
import {v2 as cloudinary} from 'cloudinary';
import mercadopago from 'mercadopago';
import fileUpload from 'express-fileupload';
const cookieParser = require("cookie-parser")
const passport = require("passport")
const {PORT} = require('./helpers/config');
const errorHandler = require('./helpers/error-handler')
// settings
app.set('port', PORT);
require("./strategies/JwtStrategy")
require("./strategies/LocalStrategy")
require("./authenticate")

// middlewares
app.use(morgan('tiny'))
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET))
//Add the client URL to the CORS policy

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : []

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },

  credentials: true,
}

app.use(cors(corsOptions))
app.use(passport.initialize())
app.use(errorHandler)
require('express-async-errors')
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
}));
mercadopago.configure({
    access_token: 'APP_USR-8352366877704564-122122-071839bb63d47195efaa44d0a4d64c6a-619410249'
})

cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret,
  });

//routes
const categoriesRoutes = require('./routes/categories');
const typesRoutes = require('./routes/types');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const favoritesRoutes = require('./routes/favorites');
const cartRoutes = require('./routes/cart')
const sucursalesCARoutes = require('./routes/sucursalesCA')
const api = process.env.API_URL;

app.use(`${api}/types`, typesRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/favorites`, favoritesRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/cart`, cartRoutes)
app.use(`${api}/sucursalesCA`, sucursalesCARoutes)

module.exports = app;