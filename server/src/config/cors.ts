import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
    // origin: function (origin, callback) {
    //     if (["http://localhost:8080"].indexOf(origin) !== -1) {
    //         callback(null, true);
    //     } else {
    //         callback(null, false);
    //     }
    // },
    origin: "*",
    preflightContinue: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};