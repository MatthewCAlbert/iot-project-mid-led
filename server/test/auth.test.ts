import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { connect } from "../src/config/database";
import supertest from "supertest";
import app from "../src/app";

const request = supertest(app);

describe("Auth Activity", () => {
    const userData = {
        username: nanoid(),
        password: "LLoLVdgCw1T^K5-7"
    };
    let token = "";
    beforeAll(() => {
        connect();
    });
    afterAll(()=>{
        mongoose.disconnect();
    })

    // Create User
    it("Create user", async () => {
    
        let response = await request.post('/api/v1/register').send(userData);
        expect(response.status).toBe(200);
        const {success, data, token: fetchedToken, expiresIn} = response.body;
        expect(data).toBeInstanceOf(Object);
        const {username} = data;
        expect(success).toBe(true);
        expect(username).toMatch(userData.username);
        expect(fetchedToken).toMatch(/^Bearer .*/);
        expect(expiresIn).toBe("1d");

    });

    // Login User
    it("Login user", async () => {
    
        let response = await request.post('/api/v1/login').send(userData);
        expect(response.status).toBe(200);
        const {success, token: fetchedToken, expiresIn} = response.body;
        expect(success).toBe(true);
        expect(fetchedToken).toMatch(/^Bearer .*/);
        expect(expiresIn).toBe("1d");
        token = fetchedToken;

    });

    // Test Protected with Token
    it("Test protected route with token", async () => {
    
        let response = await request.get('/api/v1/protected')
            .set("Authorization",`${token}`);

        expect(response.status).toBe(200);
        const {success, message} = response.body;
        expect(success).toBe(true);
        expect(message).toMatch("Authenticated");

    });

    // Test Protected with no Token
    it("Test protected route without token", async () => {
    
        let response = await request.get('/api/v1/protected');
        expect(response.status).toBe(401);

    });

    // Destroy User
    it("Destroy user", async () => {
    
        let response = await request.delete(`/api/v1/user/${userData.username}`);
        expect(response.status).toBe(200);
        const {success, message} = response.body;
        expect(success).toBe(true);
        expect(message).toMatch("User deleted!");

    });

});