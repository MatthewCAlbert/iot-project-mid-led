import supertest from "supertest";
import app from "../src/app";

jest.setTimeout(1000);
const request = supertest(app);

describe("GET /api/v1", function () {
    it("should return 200 OK and Hello World", (done) => {
      request.get('/api/v1').then( (response)=>{
          expect(response?.status).toBe(200);
          expect(response?.body?.message).toMatch('Hello World!');
          done();
        }
      )
    });

    it("should able to handle OPTION cors preflight", (done) => {
      request.options('/api/v1').set("Authorization",`Bearer xxxxxx`).then( (response)=>{
          expect(response?.status).toBe(200);
          done();
        }
      )
    });
});