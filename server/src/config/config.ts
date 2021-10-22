import Joi from "joi";
import path from "path";
import dotenv from "dotenv";

const nodeEnv = process.env.NODE_ENV;

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
    .keys({
        PORT: Joi.number().default(5000),
        PORT_TESTING: Joi.number().default(5001),

        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION: Joi.string().default('1d').description('jwt expiration'),

        // MQTT_HOST: Joi.string().required().description('MQTT host'),
        // MQTT_USER: Joi.string().required().description('MQTT username'),
        // MQTT_PASSWORD: Joi.string().required().description('MQTT password'),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

type EnvConfig = {
  env: string,
  port: {
    normal: string,
    test: string,
  },
  jwt: {
    secret: string,
    accessExpiration: string,
  },
  mqtt: {
    host: string,
    username: string,
    password: string,
  }
}

const config: EnvConfig = {
  env: nodeEnv,
  port: {
    normal: envVars?.PORT,
    test: envVars?.PORT_TESTING,
  },
  jwt: {
    secret: envVars?.JWT_SECRET,
    accessExpiration: envVars?.JWT_ACCESS_EXPIRATION,
  },
  mqtt: {
    host: envVars?.MQTT_HOST,
    username: envVars?.MQTT_USER,
    password: envVars?.MQTT_PASSWORD,
  }
}

export default config;