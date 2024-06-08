import {
  connectToMySQL,
  connectToPostgreSQL,
  connectToOracle,
  connectToSQLite,
  connectToMongoDB
} from "../services/dbConnections.js";
import {
  fetchMongoDBSchema,
  fetchMySQLSchema,
  fetchOracleSchema,
  fetchPostgreSQLSchema,
  fetchSQLiteSchema
} from "../services/schemaRetrieve.js";
/**
 * @param {takes the connection input parameters} req
 * @param {for Successfull connection,returns the schema for source and target else returns error } res
 */

export const connectToDB = async (req, res, flag) => {
  let sequelize1, sequelize2, sourceSchema, targetSchema;
  let dbType1,
  dbName1,
  mongoDBName1,
  mongoURI1,
  username1,
  password1,
  host1,
  port1;
let dbType2,
  dbName2,
  mongoDBName2,
  mongoURI2,
  username2,
  password2,
  host2,
  port2;
    ({
      source: {
        type: dbType1,
        databaseName: dbName1,
        dbName: mongoDBName1,
        uri: mongoURI1,
        userName: username1,
        password: password1,
        host: host1,
        port: port1
      },
      target: {
        type: dbType2,
        databaseName: dbName2,
        userName: username2,
        password: password2,
        host: host2,
        port: port2,
        dbName: mongoDBName2,
        uri: mongoURI2
      }
    } = req.body);
  try {
    if (dbType1 === "mysql") {
      sequelize1 = await connectToMySQL(
        dbName1,
        username1,
        password1,
        host1,
        port1,
        "source"
      );
    } else if (dbType1 === "postgres") {
      sequelize1 = await connectToPostgreSQL(
        dbName1,
        username1,
        password1,
        host1,
        port1,
        "source"
      );
    } else if (dbType1 === "sqlite") {
      sequelize1 = await connectToSQLite(dbName1, "source");
    } else if (dbType1 === "oracle") {
      sequelize1 = await connectToOracle(
        username1,
        password1,
        host1,
        port1,
        "source"
      );
    } else if (dbType1 === "mongodb") {
      sequelize1 = await connectToMongoDB(mongoURI1, mongoDBName1, "source");
    }
  } catch (error) {
    throw new Error("Invalid database credentials for Source");
  }

  try {
    if (dbType2 === "mysql") {
      sequelize2 = await connectToMySQL(
        dbName2,
        username2,
        password2,
        host2,
        port2,
        "Target"
      );
    } else if (dbType2 === "postgres") {
      sequelize2 = await connectToPostgreSQL(
        dbName2,
        username2,
        password2,
        host2,
        port2,
        "Target"
      );
    } else if (dbType2 === "sqlite") {
      sequelize2 = await connectToSQLite(dbName2, "Target");
    } else if (dbType2 === "oracle") {
      sequelize2 = await connectToOracle(
        username2,
        password2,
        host2,
        port2,
        "Target"
      );
    } else if (dbType2 === "mongodb") {
      sequelize2 = await connectToMongoDB(mongoURI2, mongoDBName2, "Target");
    }
  } catch (error) {
    throw new Error("Invalid database credentials for Target");
  }
  if (dbType1 === "mongodb") {
    sourceSchema = await fetchMongoDBSchema(sequelize1, mongoDBName1);
  } else {
    sourceSchema = await fetchSchema(
      sequelize1,
      dbType1,
      dbName1,
      mongoDBName1
    );
  if (dbType2 === "mongodb") {
    targetSchema = await fetchMongoDBSchema(sequelize2, mongoDBName2);
  } else {
    targetSchema = await fetchSchema(
      sequelize2,
      dbType2,
      dbName2,
      mongoDBName2
    );
  }
}  res.status(200).send({
    message: "Database Connected successfully",
    sourceSchema,
    targetSchema,
    status: true
  });
};

/**
 *
 * @param {takes sequelize,database type ,database name if database type is mongodb it takes mongodb database name} input
 * @returns {returns the schema for the given input}
 */

async function fetchSchema(sequelize, dbType, dbName, mongoDBName) {
  try {
    if (dbType === "mysql") {
      return fetchMySQLSchema(sequelize, dbName);
    } else if (dbType === "postgres") {
      return fetchPostgreSQLSchema(sequelize, dbName);
    } else if (dbType === "oracle") {
      return fetchOracleSchema(sequelize, dbName);
    } else if (dbType === "mongodb") {
      return await fetchMongoDBSchema(sequelize, mongoDBName);
    } else if (dbType === "sqlite") {
      return fetchSQLiteSchema(sequelize, dbName);
    } else {
      throw new Error("Unsupported database type");
    }
  } catch (err) {
    return {};
  }
}
/**
 *
 * @param {takes database type and query as the input}
 * @returns {returns the data for the query}
 */
export const fetchData = async (dbType, query, type, data) => {
    let sequelize1, sequelize2;
    let dbType1,
    dbName1,
    mongoDBName1,
    mongoURI1,
    username1,
    password1,
    host1,
    port1;
  let dbType2,
    dbName2,
    mongoDBName2,
    mongoURI2,
    username2,
    password2,
    host2,
    port2;
  dbType1 = data.source.type;
  dbName1 = data.source.databaseName;
  mongoDBName1 = data.source.dbName;
  mongoURI1 = data.source.uri;
  username1 = data.source.userName;
  password1 = data.source.password;
  host1 = data.source.host;
  port1 = data.source.port;
  dbType2 = data.target.type;
  dbName2 = data.target.databaseName;
  mongoDBName2 = data.target.dbName;
  mongoURI2 = data.target.uri;
  username2 = data.target.userName;
  password2 = data.target.password;
  host2 = data.target.host;
  port2 = data.target.port;
  if(type==1){
    try {
      if (dbType1 === "mysql") {
        sequelize1 = await connectToMySQL(
          dbName1,
          username1,
          password1,
          host1,
          port1,
          "source"
        );
      } else if (dbType1 === "postgres") {
        sequelize1 = await connectToPostgreSQL(
          dbName1,
          username1,
          password1,
          host1,
          port1,
          "source"
        );
      } else if (dbType1 === "sqlite") {
        sequelize1 = await connectToSQLite(dbName1, "source");
      } else if (dbType1 === "oracle") {
        sequelize1 = await connectToOracle(
          username1,
          password1,
          host1,
          port1,
          "source"
        );
      } else if (dbType1 === "mongodb") {
        sequelize1 = await connectToMongoDB(mongoURI1, mongoDBName1, "source");
      }
    } catch (error) {
      throw new Error("Invalid database credentials for Source");
    }
  }
  if(type==2){
    try {
      if (dbType2 === "mysql") {
        sequelize2 = await connectToMySQL(
          dbName2,
          username2,
          password2,
          host2,
          port2,
          "Target"
        );
      } else if (dbType2 === "postgres") {
        sequelize2 = await connectToPostgreSQL(
          dbName2,
          username2,
          password2,
          host2,
          port2,
          "Target"
        );
      } else if (dbType2 === "sqlite") {
        sequelize2 = await connectToSQLite(dbName2, "Target");
      } else if (dbType2 === "oracle") {
        sequelize2 = await connectToOracle(
          username2,
          password2,
          host2,
          port2,
          "Target"
        );
      } else if (dbType2 === "mongodb") {
        sequelize2 = await connectToMongoDB(mongoURI2, mongoDBName2, "Target");
      }
    } catch (error) {
      throw new Error("Invalid database credentials for Target");
    }
  }
  try {
    if (dbType === "mongodb") {
      return await executeMongoDBQuery(query, type==1?sequelize1:sequelize2);
    } else {
      return await executeSQLQuery(query,  type==1?sequelize1:sequelize2);
    }
  } catch (error) {
    return "Invalid Query ";
  }
};


/**
 *
 * @param {takes SQL query as the input} input
 * @returns {returns the data for the SQL query}
 */

async function executeSQLQuery(query, sequelize) {
  try {
    const [results] = await sequelize.query(query);
    return results;
  } catch (error) {
    return;
  }
}

/**
 *
 * @param {takes mongodb query as input} input
 * @returns {returns the data for mongodb}
 */
async function executeMongoDBQuery(query, sequelize) {
  try {
    // const sequelize = eval(`sequelize${type}`);
    const parts = query.split(".");
    const databaseName = parts.shift();
    const collectionName = parts.shift();
    const database = sequelize.db.db(databaseName);
    const collection = database.collection(collectionName);
    const queryCommand = parts.join(".");
    const data = await eval(`collection.${queryCommand}`).toArray();
    return data;
  } catch (error) {
    return;
  }
}
