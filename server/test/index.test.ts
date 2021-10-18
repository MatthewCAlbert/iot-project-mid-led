import supertest from "supertest";
import app from "../src/app";

const request = supertest(app);

describe("GET /api/v1", function () {
    it("should return 200 OK and Hello World", (done) => {
      request.get('/api/v1').then( (response)=>{
          expect(response.status).toBe(200);
          expect(response.body.message).toMatch('Hello World!');
          done();
        }
      )
    });
});