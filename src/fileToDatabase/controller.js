import { fileToDbcompare } from "./services/compareLogicForFileToDb.js";
import { databaseConnection } from "./services/databaseConnection.js";
import { headersForFileToDb } from "./services/headersForFileToDb.js";
export const compareFiletodb = async (req, res, next) => {
  try {
    const comparison = await fileToDbcompare(req, res);
    if (comparison.code == 200) {
      res.status(200).send(comparison);
    } else {
      res.status(comparison.code).send(comparison);
    }
  } catch (err) {
    res.status(500).send({ message: "server down" });
  }
};
export const dbConnection = async (req, res, next) => {
  try {
    const databaseConnevtion = await databaseConnection(req, res);
    if (databaseConnevtion.code == 200) {
      res.status(200).send(databaseConnevtion);
    } else {
      res.status(databaseConnevtion.code).send(databaseConnevtion);
    }
  } catch (err) {
    res.status(500).send({ message: "server down" });
  }
};
export const getHeadersForFileDb = async (req, res, next) => {
  try {
    const headers = await headersForFileToDb(req, res);
    if (headers.code == 200) {
      res.status(200).send(headers);
    } else {
      res.status(headers.code).send(headers);
    }
  } catch (err) {
    res.status(500).send({ message: "server down" });
  }
};
