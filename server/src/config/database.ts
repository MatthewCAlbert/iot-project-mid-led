import { createConnection } from "typeorm";
import logger from '../lib/logger';

async function connect(){
  if( process.env.NODE_ENV !== "production" ){
    logger.info("Running in dev mode!");
  }
  try {
    const connection = await createConnection();
    logger.info("Database connected!");
  } catch (error) {
    logger.info("Database connection error!");
    console.log(error);
    process.exit(1);
  }
}

export {connect};