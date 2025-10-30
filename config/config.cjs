require('dotenv').config();

// Centralised Sequelize configuration consumed by both CLI and runtime bootstrap.
module.exports = {
  development: {
    // Local development pulls credentials from .env so migrations and the app stay in sync.
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false
  },
  test: {
    // Minimal fixture database used by automated tests.
    username: "root",
    password: null,
    database: "ems_test",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false
  },
  production: {
    // Heroku-style CLEARDB url keeps credentials out of source control.
    use_env_variable: "CLEARDB_DATABASE_URL",
    dialect: "mysql",
    logging: false
  }
};
