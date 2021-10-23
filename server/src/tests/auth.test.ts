import { nanoid } from "nanoid";
import { connect } from "../config/database";
import supertest from "supertest";
import app from "../app";
import { User } from "../data/entities/user.entity";
import { Connection } from "typeorm";

jest.setTimeout(1000);
const request = supertest(app);

describe("Auth Activity", () => {
    const userData = {
        name: nanoid(),
        username: nanoid(),
        password: "oldpass12345"
    };
    const newPassword = "newpass12345";
    let connection: Connection = undefined;
    let token = "";
    beforeAll(async () => {
        connection = await connect();
    }, 5000);
    afterAll(()=>{
        connection.close();
    })

    // Create User
    it("Create user", (done) => {
    
        request.post('/api/v1/auth/register').send(userData).then((response)=>{
            expect(response.status).toBe(200);
            const {user, token: fetchedToken, expiresIn} = response?.body?.data;
            const {username, name} = user;
            expect(name).toMatch(userData.name);
            expect(username).toMatch(userData.username);
            expect(fetchedToken).toMatch(/^Bearer .*/);
            expect(expiresIn).toBe("1d");
            done()
        });

    });

    // Login User
    it("Login user", (done) => {
    
        request.post('/api/v1/auth/login').send({
            username: userData?.username,
            password: userData?.password
        }).then( response => {
            expect(response.status).toBe(200);
            const {token: fetchedToken, expiresIn} = response?.body?.data;
            expect(fetchedToken).toMatch(/^Bearer .*/);
            token = fetchedToken;
            done();
        });

    });

    // Test Protected with Token and get user profile
    it("Test protected route with token and get user profile", (done) => {
        
        expect(token).toMatch(/^Bearer .*/);
    
        request.get('/api/v1/auth/profile')
        .set("Authorization",`${token}`).then( response => {
            expect(response.status).toBe(200);
            const {username, name} = response?.body?.data?.user;
            expect(username).toMatch(userData.username);
            expect(name).toMatch(userData.name);
            done();
        } );

    });

    // Test change password
    it("Change user password", (done) => {
    
        request.put('/api/v1/auth/change-password').set("Authorization",`${token}`).send({
            oldPassword: userData?.password,
            newPassword: newPassword,
            rePassword: newPassword,
        }).then( response => {
            expect(response.status).toBe(200);
            done();
        });

    });

    // Test login using new password
    it("Login using new password", (done) => {
    
        request.post('/api/v1/auth/login').send({
            username: userData?.username,
            password: newPassword
        }).then( response => {
            expect(response.status).toBe(200);
            done();
        });

    });

    // Test Protected with no Token
    it("Test protected route without token", (done) => {
    
        request.get('/api/v1/protected').then(response=>{
            expect(response.status).toBe(401);
            done();
        });

    });

    // Destroy User
    it("Destroy user", (done) => {
        User.delete({username: userData.username}).then(response => {
            // console.log(response)
            // expect(response.affected).toBeInstanceOf(Number);
            done();
        });
    });

});