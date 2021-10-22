const cliConfig = {
  entitiesDir: "src/data/entities",
  migrationsDir: "src/data/migrations",
  subscribersDir: "src/data/subscribers",
};

const defaultConfig = {
  type: "sqlite",
  database: "./db/app.sqlite",
  synchronize: true,
  logging: true,
};

const devLocation = {
  entities: ["src/data/entities/**/*.ts"],
  subscribers: ["src/data/subscribers/**/*.ts"],
  migrations: ["src/data/migrations/**/*.ts"],
};

const distLocation = {
  entities: ["dist/data/entities/**/*.js"],
  subscribers: ["dist/data/subscribers/**/*.js"],
  migrations: ["dist/data/migrations/**/*.js"],
};

const ormConfig = {
  production: {
    ...defaultConfig,
    ...distLocation,
    cli: cliConfig,
    name: "production",
  },
  testing: {
    ...defaultConfig,
    ...devLocation,
    cli: cliConfig,
    name: "testing",
  },
  development: {
    ...defaultConfig,
    ...devLocation,
    cli: cliConfig,
    name: "development",
  },
};

const env = process.env.NODE_ENV;

const exportedConfig = {
  ...(ormConfig?.[env] || ormConfig.development),
  name: "default",
};

module.exports = exportedConfig;
