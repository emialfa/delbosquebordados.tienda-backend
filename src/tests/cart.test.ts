const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require('bcryptjs')
import User from "../models/user";
const jwt = require("jsonwebtoken");
import "../database";
import { createUserTest } from "./utils/create-usertest";
const {MONGODB_URI} = require('../helpers/config')
const api = supertest(app)

let token:string;

beforeEach(async () => {
    if (MONGODB_URI === process.env.TEST_MONGODB_URI){
        await User.deleteMany({});
        const newUser = new User({
            name: "testUser1",
            email: "test1@test.com",
            passwordHash: bcrypt.hashSync("test1234", 10),
            activation: true,
            cart: 'cartTest',
            favorites: [],
        })
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
  const response = await api.get("/api/v1/cart")
  .set('authtoken', token)
  .send();
  expect(response.body.cart).toBe('cartTest')
});

test("add to cart, then new cart are returned ", async () => {
    const res = await api.post("/api/v1/cart")
    .set('authtoken', token)
    .send({
        cart: 'cartTestUpdated'
    });
    const response = await api.get("/api/v1/cart")
    .set('authtoken', token)
    .send();
    expect(response.body.cart).toBe('cartTestUpdated')
  });

afterAll(() => {
    mongoose.connection.close()
})