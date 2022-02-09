const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require('bcryptjs');
import User from "../models/user";
import "../database";
import { createUserTest } from "./utils/create-usertest";
const {MONGODB_URI} = require('../helpers/config')
const api = supertest(app)

let token:string;

const initialUsers = [
    {
        name: "testUser1",
        email: "test1@test.com",
        passwordHash: bcrypt.hashSync("test1234", 10),
        activation: true,
        favorites: [],
      }, {
        name: "testUser2",
        email: "test2@test.com",
        passwordHash: bcrypt.hashSync("test1234", 10),
        activation: true,
        favorites: [],
      }
]

beforeEach(async () => {
    if (MONGODB_URI === process.env.TEST_MONGODB_URI){
        await User.deleteMany({})
        token = await createUserTest()
        for(const user of initialUsers) {
            let userObject = new User(user)
            await userObject.save()
        }
        const res = await User.find()
    }
})

test("all users are returned", async () => {
  const response = await api.get("/api/v1/users/all")
  .set('authtoken', token)
  .send()
  expect(response.body).toHaveLength(initialUsers.length)
});

test('register user, then all users and new type are returned', async () => {
    await api.post('/api/v1/users/register') 
    .send({
       ...initialUsers[0], name: "testUser3", email: "test3@test.com", password: "test1234"
    })
    .expect(200)
    const response = await api.get("/api/v1/users/all")
    .set('authtoken', token)
    .send();
    expect(response.body).toHaveLength(initialUsers.length+1)
})

test('update name of user, then new name of user are returned', async () => {
    const res = await api.post("/api/v1/users/login")
    .send({
        email: initialUsers[1].email,
        password: "test1234"
    })
    const resUpdate = await api.put('/api/v1/users/update') 
    .set('authtoken', res.body.token)
    .send({
        name: "testUser2updated"
    })
    .expect(200)
    const response = await api.get("/api/v1/users/all")
    .set('authtoken', token)
    .send();    
    expect(response.body[1].name).toBe("testUser2updated")
})

test('delete user, then all users less one are returned', async () => {
    const res = await api.get("/api/v1/users/all")
    .set('authtoken', token)
    .send();    
    await api.delete('/api/v1/users/'+res.body[1]._id) 
    .set('authtoken', token)
    .expect(200)
    const response = await api.get("/api/v1/users/all")
    .set('authtoken', token)
    .send();    
    expect(response.body).toHaveLength(initialUsers.length-1)
})

afterAll(() => {
    mongoose.connection.close()
})