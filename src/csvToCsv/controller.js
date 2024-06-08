import { csvHeaders } from "./services/headersForCsv.js";
import { compareCsv } from "./services/compareLogicForCsv.js";
import { csvToJson } from "./services/csvFilesGeneration.js";
export const getCsvHeaders = async (req, res, next) => {
  try {
    const headers = await csvHeaders(req, res);
    if (headers.code == 200) {
      res.status(200).send(headers);
    } else {
      res.status(headers.code).send(headers);
    }
  } catch (err) {
    res.status(500).send({ message: "server down" });
  }
};
export const compareCsvFiles = async (req, res, next) => {
  try {
    const csvComparison = await compareCsv(req, res);
    if (csvComparison.code == 200) {
      res.status(200).send(csvComparison);
    } else {
      res.status(csvComparison.code).send(csvComparison);
    }
  } catch (err) {
    res.status(500).send({ message: "server down" });
  }
};
export const csvFileGenerations = async (req, res, next) => {
  try {
    const csvFilesGeneraion = await csvToJson(req, res);
    if (csvFilesGeneraion.code == 200) {
      res.status(200).send(csvFilesGeneraion);
    } else {
      res.status(csvFilesGeneraion.code).send(csvFilesGeneraion);
    }
  } catch (err) {
    res.status(500).send({ message: "server down" });
  }
};
