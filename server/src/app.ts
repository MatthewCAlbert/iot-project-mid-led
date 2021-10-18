"use strict";

require("dotenv").config();

import "reflect-metadata";
import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import MqttHandler from "./config/mqtt";
import { corsOptions } from "./config/cors";

const app = express();

//setup
app.set("port", process.env.PORT || 5000);
app.set("env", process.env.NODE_ENV);

//middleware
app.use(helmet())
app.use(compression())
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const mqttClient = new MqttHandler();
mqttClient.connect();

// Define Routes
app.options('*', cors());
app.use("/", require("./routes/web.routes"));
app.use("/api/v1", require("./routes/api.routes"));

// Attach public folder
app.use(express.static(__dirname + "/public"));

// Allow reverse proxy
app.set("trust proxy", true);

// Initialize views using EJS
app.set("views", path.join(__dirname, "../src/views"));
app.engine("ejs", require("./ejs-extended"));

export default app;