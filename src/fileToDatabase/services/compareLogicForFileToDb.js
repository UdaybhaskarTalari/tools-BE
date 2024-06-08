import * as fs from "fs";
import { hashGenerate } from "../../common/services/hashGenerate.js";
/**
 * @param {body of array which contain the mapping index or empty} req
 * @param {lost data and a message} res
 */
export const fileToDbcompare = async (req, res) => {
  let misMatchData = [];
  const { datadb, datafile, condition } = req.body;
  let dataFromDb, dataFromFile;
  let misMatchIndex = 1;
  try {
    dataFromDb = await JSON.parse(
      fs.readFileSync(`./constants/${datadb}`, "utf8")
    );
    dataFromFile = await JSON.parse(
      fs.readFileSync(`./constants/${datafile}`, "utf8")
    );
  } catch (error) {
    return {
      message: "unable to read or find the file",
      status: false,
      code: 404
    };
  }
  misMatchData = [];
  let dbDataMap = {};
  if (condition.length > 0 && condition[0].length) {
    for (const i of dataFromDb) {
      const values = Object.values(i);
      const hashArray = condition[0].map((index) => {
        if (values[index] == null || values[index] == "") {
          return "null";
        } else {
          return values[index];
        }
      });
      let code = hashGenerate(hashArray.join(","));
      if (dbDataMap[code]) {
        dbDataMap[code] += 1;
      } else {
        dbDataMap[code] = 1;
      }
    }
    misMatchData = [];
    misMatchIndex = 1;
    for (let i of dataFromFile) {
      const keys = Object.keys(i);
      const values = Object.values(i);
      let curObject = {};
      curObject["Serial No"] = misMatchIndex;
      const hashArray = condition[1].map((index) => {
        if (values[index] == "" || values[index] == null) {
          curObject[keys[index]] = "null";
          return "null";
        } else {
          curObject[keys[index]] = values[index];
          return values[index];
        }
      });
      let code = hashGenerate(hashArray.join(","));
      if (dbDataMap[code] >= 1) {
        dbDataMap[code] -= 1;
      } else {
        misMatchData.push(curObject);
      }
      misMatchIndex += 1;
    }
  } else {
    for (const i of dataFromDb) {
      const values = Object.values(i);
      const hashArray = values.map((data) => {
        if (data == null || data == "") {
          return "null";
        } else {
          return data;
        }
      });
      const code = hashGenerate(hashArray.join(","));
      if (dbDataMap[code]) {
        dbDataMap[code] += 1;
      } else {
        dbDataMap[code] = 1;
      }
    }
    for (const i of dataFromFile) {
      const keys = Object.keys(i);
      let curObject = {};
      curObject["Serial No"] = misMatchIndex;
      const values = Object.values(i);
      const hashArray = values.map((data, index) => {
        if (data == "" || data == null) {
          curObject[keys[index]] = "null";
          return "null";
        } else {
          curObject[keys[index]] = data;
          return data;
        }
      });
      const code = hashGenerate(hashArray.join(","));
      if (dbDataMap[code] >= 1) {
        dbDataMap[code] -= 1;
      } else {
        misMatchData.push(curObject);
      }
      misMatchIndex += 1;
    }
  }
  let filename = `fileMissed${datafile}`;
  const jsonData = JSON.stringify(misMatchData, null, 2);
  fs.writeFileSync(`constants/${filename}`, jsonData, (err) => {
    if (err) {
      return {
        message: "unable to create file",
        status: false,
        error: err,
        code: 404
      };
    }
  });
  return {
    LostData: misMatchData,
    message: misMatchData.length == 0 ? "All Records Matched" : null,
    numberOfRecords: misMatchData.length,
    status: misMatchData.length == 0 ? true : false,
    misMatchFile: filename,
    code: 200
  };
};
