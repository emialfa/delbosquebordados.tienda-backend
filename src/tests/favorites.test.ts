const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require('bcryptjs')
import User from "../models/user";
import Product from "../models/product";
const jwt = require("jsonwebtoken");
import "../database";
const {MONGODB_URI} = require('../helpers/config')
const api = supertest(app)

let token:string;
let idFavorite: string;

beforeEach(async () => {
    if (MONGODB_URI === process.env.TEST_MONGODB_URI){
        await User.deleteMany({});
        await Product.deleteMany({})
        let newProduct = new Product({
            name: 'test1',
            description: 'test1',
            category: 'test',
            type: 'test',
            countInStock: 50,
        })
        const product = await newProduct.save()
        const newUser = new User({
            name: "testUser1",
            email: "test1@test.com",
            passwordHash: bcrypt.hashSync("test1234", 10),
            activation: true,
            favorites: [product._id+""],
        })
        idFavorite = product._id+''
        const res = await newUser.save()
        console.log(res)
        token = jwt.sign(
            {
              userEmail: res.email,
              isAdmin: res.isAdmin,
            },
            process.env.secret
          );
    }
})

test("cart are returned", async () => {
  const response = await api.get("/api/v1/favorites")
  .set('authtoken', token)
  .send();
  console.log(response.body)
  expect(response.body.favorites[0]+'').toBe(idFavorite)
});

test("remove to cart, then new cart are returned ", async () => {
    const res = await api.post("/api/v1/favorites")
    .set('authtoken', token)
    .send({
        favorites: []
    });
    const response = await api.get("/api/v1/favorites")
    .set('authtoken', token)
    .send();
    expect(response.body.favorites).toHaveLength(0)
  });

afterAll(() => {
    mongoose.connection.close()
})