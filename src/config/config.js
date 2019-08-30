import dotenv from 'dotenv';

dotenv.config();
const {
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
  DB_NAME,
  DB_NAME_TEST,
  DB_HOST,
  DATABASE_URL
} = process.env;

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: 'postgres',
    port: DB_PORT
  },
  test: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME_TEST,
    host: DB_HOST,
    dialect: 'postgres',
    port: DB_PORT,
    logging: false
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    use_env_variable: 'DATABASE_URL',
    database: DB_NAME,
    url: DATABASE_URL,
    dialect: 'postgres',
    port: DB_PORT
  }
};
