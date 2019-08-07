import 'dotenv/config';

const {
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
  DB_NAME,
  DB_NAME_TEST,
  HOST
} = process.env;

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: HOST,
    dialect: 'postgres',
    port: DB_PORT
  },
  test: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME_TEST,
    host: HOST,
    dialect: 'postgres',
    port: DB_PORT
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: HOST,
    dialect: 'postgres',
    port: DB_PORT
  }
};
