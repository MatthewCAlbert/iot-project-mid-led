import { nanoid } from "nanoid";
import { connect } from "../config/database";
import supertest from "supertest";
import app from "../app";
import { User } from "../data/entities/user.entity";
import { Connection } from "typeorm";

jest.setTimeout(1000);
const request = supertest(app);

describe("IOT Stuff", () => {
    const userData = {
        name: nanoid(),
        username: nanoid(),
        password: "oldpass12345"
    };
    let userId = "";
    let connection: Connection = undefined;
    let token = "";

    beforeAll(async () => {
        connection = await connect();
    }, 5000);
    afterAll(()=>{
        User.delete({username: userData.username}).then(response => {
            connection.close();
        });
    })

    // Create User
    it("Create user first", (done) => {
    
        request.post('/api/v1/auth/register').send(userData).then((response)=>{
            expect(response.status).toBe(200);
            const {user, token: fetchedToken, expiresIn} = response?.body?.data;
            const {username, name, id} = user;

            userId = id;

            expect(name).toMatch(userData.name);
            expect(username).toMatch(userData.username);
            expect(fetchedToken).toMatch(/^Bearer .*/);
            expect(expiresIn).toBe("1d");
            token = fetchedToken;

            done();
        });

    });

    const newSchedule = {
        name: 'test aja',
        when: new Date(),
        command: {
            state: 'ON',
            color: {
                r: 200, g: 200, b: 200
            }
        }
    }
    let scheduleId = '';

    // Add new schedule
    it("Add new schedule", (done) => {
    
        request.post('/api/v1/schedule')
        .set("Authorization",`${token}`).send(newSchedule).then((response)=>{
            expect(response.status).toBe(200);
            const {id} = response?.body?.data;

            scheduleId = id;

            done();
        });

    });

    // Get All Schedule
    it("Get All Schedule", (done) => {
    
        request.get('/api/v1/schedule')
        .set("Authorization",`${token}`).then((response)=>{
            expect(response.status).toBe(200);
            const data = response?.body?.data;

            expect(data.length).toBeGreaterThan(0);

            done();
        });

    });

    // Get a Schedule
    it("Get Schedule Detail by ID", (done) => {
    
        request.get(`/api/v1/schedule/${scheduleId}`)
        .set("Authorization",`${token}`).then((response)=>{
            expect(response.status).toBe(200);
            const { id, when, user, command, name } = response?.body?.data;

            expect(id).toMatch(scheduleId);
            expect(user?.id).toMatch(userId);
            expect(name).toMatch(newSchedule.name);

            expect(new Date(when).toDateString()).toMatch(new Date(newSchedule.when).toDateString());
            expect(command).toMatch(JSON.stringify(newSchedule.command));

            done();
        });

    });

    // Delete a Schedule
    it("Delete Schedule Detail by ID", (done) => {
    
        request.delete(`/api/v1/schedule/${scheduleId}`)
        .set("Authorization",`${token}`).then((response)=>{
            expect(response.status).toBe(200);

            done();
        });

    });

});