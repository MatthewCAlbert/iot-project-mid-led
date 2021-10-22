import { createConnection, getConnection } from "typeorm";
import logger from '../utils/logger';

async function connect(){
  if( process.env.NODE_ENV !== "production" ){
    logger.info("Running in dev mode!");
  }
  
  try {
    const connection = await createConnection();
    logger.info("Database connected!");
    return connection;
  } catch (error) {
    logger.info("Database connection error!");
    console.log(error);
    process.exit(1);
  }
}

export {connect};