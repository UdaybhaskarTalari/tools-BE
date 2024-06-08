import * as fs from "fs";
import { Sequelize } from "sequelize";
import jwt from "jsonwebtoken";
import crypto from "crypto";
/**
 * @param {object of data, credentials to connect with database} req
 * @param {message and lost data} res
 * @returns
 */
export const databaseConnection = async (req, res) => {
  const { body } = req;
  const { authorization } = req.headers;
  const token = authorization;
  let email;
  try {
    const decodedToken = jwt.verify(token, process.env.DECODE_STRING);
    email = decodedToken.email;
  } catch (error) {
    return { message: "Token Verification failed", status: false, code: 401 };
  }
  const { tableName, dbType, host, password, userName, databaseName, port,istable } =
    body;
  let sequelize;
  try {
    sequelize = new Sequelize(databaseName, userName, password, {
      host: host,
      dialect: dbType,
      port: port
    });
    await sequelize.authenticate();
  } catch (error) {
    return { message: "Authentication Error", status: false, code: 401 };
  }
  if(istable){
    try {
      const tableNames = await sequelize.getQueryInterface().showAllTables();
      return {
        message: "initial Database connection established",
        tables:tableNames,
        status: true,
        code: 200
      };
    } catch (error) {
      return { message: "Internal error", status: false, code: 404 };
    }
  }
  else{
  try {
    let ascValue=tableName.charCodeAt(0);
    let query;
    if(ascValue<97){
    query=`SELECT * FROM "${tableName}"`;
    }
    else{
    query=`SELECT * FROM ${tableName}`;
    }
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });
    const jsonData = JSON.stringify(results, null, 2);
    const timesForDataFromDb = new Date().toISOString().replace(/[:.]/g, "");
    const codeForDbData = crypto.randomBytes(16).toString("hex");
    const dataFromDb = `dataFromDb${email}${codeForDbData}${timesForDataFromDb}.json`;
    fs.writeFileSync(`constants/${dataFromDb}`, jsonData, (err) => {
      if (err) {
        return {
          message: "unable to create file",
          status: false,
          error: err,
          code: 401
        };
      }
    });
    return {
      message: "Database connected",
      filename: dataFromDb,
      status: true,
      code: 200
    };
  } catch (error) {
    return { message: "Table not found", status: false, code: 404 };
  }
}
};
