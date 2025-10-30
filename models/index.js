// models/index.js (ESM)
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import Sequelize from 'sequelize';
import configObj from '../config/config.cjs'; // CJS is fine to import from ESM

// Mirrors the Sequelize CLI bootstrap but adjusted for pure ESM modules.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configObj[env];

const db = {};
let sequelize;

// Support DATABASE_URL style configs while keeping CLI compatibility.
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Dynamically import all .js model files (except this one)
for (const file of fs.readdirSync(__dirname)) {
  if (file !== basename && file.endsWith('.js')) {
    // ESM needs a file:// URL on Windows when importing at runtime.
    const moduleHref = pathToFileURL(path.join(__dirname, file)).href;
    const mod = await import(moduleHref);
    const modelFactory = mod.default || mod;
    const model = modelFactory(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }
}

Object.values(db).forEach((model) => {
  if (model.associate) model.associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
