import { Sequelize } from "sequelize";
import { MongoClient } from "mongodb";

/**
 * @param {takes the database connection inputs}
 * @returns {returns th connected sequelize}
 */
export const connectToMySQL = async (
  dbName,
  username,
  password,
  host,
  port,
  type
) => {
  let sequelize = new Sequelize(dbName, username, password, {
    host: host,
    dialect: "mysql",
    port: port
  });
  try {
    await sequelize.authenticate();
    return sequelize;
  } catch (error) {
    throw new Error(`Invalid credentials for ${type}`);
  }
};

/**
 * @param {takes the database connection inputs}
 * @returns {returns th connected sequelize}
 */
export const connectToPostgreSQL = async (
  dbName,
  username,
  password,
  host,
  port,
  type
) => {
  let sequelize = new Sequelize(dbName, username, password, {
    host: host || "localhost",
    dialect: "postgres",
    port: port
  });
  try {
    await sequelize.authenticate();
    return sequelize;
  } catch (error) {
    throw new Error(`Invalid database credentials for ${type}`);
  }
};

/**
 * @param {takes the database connection inputs}
 * @returns {returns th connected sequelize}
 */
export const connectToSQLite = async (dbName, type) => {
  let sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "C:/Users/Charan/Desktop/sqlite3.db"
  });
  try {
    await sequelize.authenticate();
    return sequelize;
  } catch (error) {
    throw new Error(`Invalid database credentials for ${type}`);
  }
};

/**
 * @param {takes the database connection inputs}
 * @returns {returns th connected sequelize}
 */
export const connectToOracle = async (username, password, host, port, type) => {
  let sequelize = new Sequelize({
    username: username,
    password: password,
    port: port,
    dialect: "oracle",
    dialectOptions: { connectString: `${host}:${port}/orcl` }
  });
  try {
    await sequelize.authenticate();
    return sequelize;
  } catch (error) {
    throw new Error(`Invalid database credentials for ${type}`);
  }
};
/**
 * @param {takes the database connection inputs}
 * @returns {returns th connected client}
 */

export const connectToMongoDB = async (mongoURI, dbName, type) => {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect().then(() => {});
    const dbList = await client.db().admin().listDatabases();
    const dbNames = dbList.databases.map((db) => db.name);
    if (!dbNames.includes(dbName)) {
      throw new Error("Invalid database credentials");
    }
    return client;
  } catch (err) {
    throw new Error(`Invalid database credentials for ${type}`);
  }
};
