import { fetchData } from "../controller/dbController.js";
import jwt from "jsonwebtoken";
import * as fs from "fs";
export const compareData = async (req, res) => {
  let data1, data2;
  let exportdata = null;
  const {
    sourceDBQuery,
    targetDBQuery,
    caseSensitive,
    sourceDBType,
    targetDBType,
    swap,
    data
  } = req.body;
  const { authorization } = req.headers;
  const token = authorization;
  let email;
  try {
    const decodedToken = jwt.verify(token, process.env.DECODE_STRING);
    email = decodedToken.email;
  } catch (error) {
    return res
      .status(200)
      .send({ message: "Token Verification failed", status: false, code: 401 });
  }
  try {
    try {
      if (swap) {
        data1 = await fetchData(sourceDBType, sourceDBQuery, 2, data);
      } else {
        data1 = await fetchData(sourceDBType, sourceDBQuery, 1, data);
      }
    } catch (error) {
      return res.status(200).send({
        message: "Internal server error while fetching data1",
        status: false
      });
    }
    try {
      if (swap) {
        data2 = await fetchData(targetDBType, targetDBQuery, 1, data);
      } else {
        data2 = await fetchData(targetDBType, targetDBQuery, 2, data);
      }
    } catch (error) {
      return res.status(200).send({
        message: "Internal server error while fetching data2",
        status: false
      });
    }
    if (data1 === "Invalid Query") {
      return res
        .status(200)
        .send({ message: "Invalid query for source", status: false });
    }
    if (data2 === "Invalid Query") {
      return res
        .status(200)
        .send({ message: "Invalid query for target", status: false });
    }
    if (!data1 && !data2) {
      res.status(200).send({
        message: "Invalid Query for source and target",
        status: false
      });
      return;
    }
    if (!data1) {
      res
        .status(200)
        .send({ message: "Invalid Query for source", status: false });
      return;
    }
    if (!data2) {
      res
        .status(200)
        .send({ message: "Invalid Query for target", status: false });
      return;
    }
    if (data1 && data2) {
      exportdata = compareTables(data1, data2, caseSensitive);
      const response = {
        exportdata: exportdata,
        exportdataLength: exportdata.length
      };
      const times = new Date().toISOString().replace(/[:.]/g, "");
      const filename = `dbtodb${email}${times}.json`;
      const jsonData = JSON.stringify(response.exportdata, null, 2);
      fs.writeFileSync(`constants/${filename}`, jsonData, (err) => {
        if (err) {
          return {
            message: "Unable to create the file",
            status: false,
            code: 404
          };
        }
      });
      res.status(200).send({
        message: response.exportdataLength == 0 ? "All Records Matched" : "",
        data: response.exportdata,
        numberOfRecords: response.exportdataLength,
        status: true,
        fileName: filename
      });
    } else {
      res.status(200).send({
        message: "Data fetching error: One or more datasets are undefined",
        status: false
      });
    }
  } catch (error) {
    res.status(200).send({ message: "Internal  Error", status: false });
  }
};
function compareTables(data1, data2, caseSensitive) {
  const differences = [];
  data1.forEach((row2, index) => {
    const matchingRow = data2.find((row1) =>
      isEqual(row1, row2, caseSensitive)
    );
    if (!matchingRow) {
      row2 = { "Serial No": index + 1, ...row2 };
      differences.push(row2);
    }
  });
  return differences;
}
function isEqual(obj1, obj2, caseSensitive) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length != keys2.length) {
    return false;
  }
  for (let i = 0; i < keys1.length; i++) {
    let val1 = obj1[keys1[i]];
    let val2 = obj2[keys2[i]];
    if (
      caseSensitive == true &&
      typeof val1 == "string" &&
      typeof val2 == "string"
    ) {
      val1 = val1.toLowerCase();
      val2 = val2.toLowerCase();
    } else {
      val1 = JSON.stringify(val1);
      val2 = JSON.stringify(val2);
    }
    if (val1 != val2) {
      return false;
    }
  }
  return true;
}
