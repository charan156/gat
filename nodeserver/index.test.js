//import 'babel-polyfill';
import mongoose from 'mongoose';
import app from './index' 
import supertest from 'supertest'
import { matchers } from 'jest-json-schema';

expect.extend(matchers);
const request = supertest(app) 
jest.setTimeout(30000);
const schema = {
    $id: 'testSchema',
    type: 'array',
    items: {
        type: "object",
        properties: {
            file_name: {
              type: 'string',
            },
            pdf_path: {
              type: 'string',
            },
            union: {
              type: 'string',
            },
            case_no: {
              type: 'string',
            },
            grievor: {
              type: 'string',
            },
            employer: {
              type: 'string',
            },
            date_issued: {
              type: 'string',
            },
            jr_path: {
              type: 'string',
            },
            judicial_review: {
              type: 'string',
            },
            cases_cited: {
              type: 'string',
            },
            year: {
              type: 'string',
            },
        },
    }
};

beforeAll(async () => {
    const url = `mongodb://localhost:27017/metadata`;
    await mongoose.connect(url, { useNewUrlParser: true });
});

it('gets all documents', async done => {    
    const response = await request.get('/allDocuments/')
    expect(response.status).toBe(200)
    expect(response.body).toMatchSchema(schema)
    done()
})

it('gets documents based on query', async done => {    
    const response = await request.get('/documents/')
    expect(response.status).toBe(200)
    expect(response.body).toMatchSchema(schema)
    done()
}) 

it('gets documents based on text', async done => {    
    const response = await request.get('/allDocuments/:id')
    expect(response.status).toBe(200)
    expect(response.body).toMatchSchema(schema)
    done()
})
