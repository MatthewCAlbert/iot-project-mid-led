"use strict";

import "reflect-metadata";
import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import MqttHandler from "./config/mqtt";
import { corsOptions } from "./config/cors";
import router from "./routes";
import ApiError from "./utils/ApiError";
import httpStatus from "http-status";
import { errorConverter, errorHandler } from "./middlewares/error.middleware";
import config from "./config/config";

const app = express();

// Setup
app.set("port", (
    config.env !== "testing" ? config.port.normal : config.port.test) 
    || 5000
);
app.set("env", config.env);

// Middleware
app.use(helmet())
app.use(compression())
app.use(cors(corsOptions("*")))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Currently disabled
// MQTT Client
// const mqttClient = new MqttHandler();
// mqttClient.connect();

// Handle Preflight
// app.options("*", cors());
app.options("*", (req, res)=>{
    res.status(200).json({});
});

// Define Routes
app.use("/", router);

// Attach public folder
app.use(express.static(__dirname + "/public"));

// Allow reverse proxy
app.set("trust proxy", true);

// Initialize views using EJS
app.set("views", path.join(__dirname, "../src/views"));
app.engine("ejs", require("./ejs-extended"));

// Handle Not Found
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Handle Stack Trace
app.use(errorConverter);
app.use(errorHandler);

export default app;