const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
import Category from "../models/category";
import "../database";
import { createUserTest } from "./utils/create-usertest";
const {MONGODB_URI} = require('../helpers/config')
const api = supertest(app)

let token:string;

const initialCategories = [
    {
        name: "test1",
        icon:'',
        color:'',  
    }, {
        name: "test2",
        icon:'',
        color:'',  
    }
]

beforeEach(async () => {
    if (MONGODB_URI === process.env.TEST_MONGODB_URI){
        token = await createUserTest()
        await Category.deleteMany({})
        for(const type of initialCategories) {
            let newCategory = new Category(type)
            await newCategory.save()
        }
    }
})

test("all categories are returned", async () => {
  const response = await api.get("/api/v1/categories").send();
  console.log(response.body);
  expect(response.body).toHaveLength(initialCategories.length)
});

test('add category, then all categories and new type are returned', async () => {
    await api.post('/api/v1/categories') 
    .set('authtoken', token)
    .send({
        name: "test3",
        icon:'',
        color:'', 
    })
    .expect(200)
    const response = await api.get("/api/v1/categories").send();
    console.log(response.body);
    expect(response.body).toHaveLength(initialCategories.length+1)
})

test('update name of category, then new name of category are returned', async () => {
    const res = await api.get("/api/v1/categories").send();
    await api.put('/api/v1/categories/'+res.body[1]._id) 
    .set('authtoken', token)
    .send({
        name: "test2updated",
        icon:'',
        color:'', 
    })
    .expect(200)
    const response = await api.get("/api/v1/categories").send();
    console.log(response.body);
    expect(response.body[1].name).toBe("test2updated")
})

test('delete category, then all categories less one are returned', async () => {
    const res = await api.get("/api/v1/categories").send();
    await api.delete('/api/v1/categories/'+res.body[1]._id) 
    .set('authtoken', token)
    .expect(200)
    const response = await api.get("/api/v1/categories").send();
    console.log(response.body);
    expect(response.body).toHaveLength(initialCategories.length-1)
})

test('wrong id return status 500, and without modification', async () => {
    await api.delete('/api/v1/categories/134567') 
    .set('authtoken', token)
    .expect(500)
    const response = await api.get("/api/v1/categories").send();
    console.log(response.body);
    expect(response.body).toHaveLength(initialCategories.length);
})

afterAll(() => {
    mongoose.connection.close()
})