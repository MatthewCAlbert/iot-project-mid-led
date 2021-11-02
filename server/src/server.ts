"use strict";

import app, { mqttClient } from "./app";
import { connect } from "./config/database";
import { scheduleOnStartup } from "./config/scheduler";
import logger from "./utils/logger";

/**
 * Start Express server.
 */

const server = app.listen(app.get("port"), async () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");

    await connect();
    if( mqttClient ){
      console.log("MQTT Client found, starting scheduler...");
      await scheduleOnStartup(mqttClient);
    }
});

/**
 * Exit Handlers.
 */

const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
};
  
const unexpectedErrorHandler = (error: any) => {
    logger.error(error);
    exitHandler();
};
  
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
});

export default server;