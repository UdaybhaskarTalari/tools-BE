import * as fs from "fs";
import { hashGenerate } from "../../common/services/hashGenerate.js";
export const compareCsv = async (req, res) => {
  const { body } = req;
  let misMatchData = [];
  const { source, target, condition } = body;
  try {
    const dataFromSourceCsv = JSON.parse(
      fs.readFileSync(`./constants/${source}`, "utf8")
    );
    const dataFromTargetCsv = JSON.parse(
      fs.readFileSync(`./constants/${target}`, "utf8")
    );
    const sourceData = dataFromSourceCsv;
    const targetData = dataFromTargetCsv;
    const dataDictionary = {};
    let misMatchIndex = 1;
    if (condition.length > 0 && condition[0].length > 0) {
      for (const row of sourceData) {
        const values = Object.values(row);
        const hashArray = condition[0].map((index) => values[index]);
        const code = hashGenerate(hashArray.join(","));
        dataDictionary[code] = (dataDictionary[code] || 0) + 1;
      }
      misMatchData = [];
      misMatchIndex = 1;
      for (const row of targetData) {
        const values = Object.values(row);
        const keys = Object.keys(row);
        const curObject = { "Serial No": misMatchIndex };
        const hashArray = condition[1].map((index) => {
          curObject[keys[index]] = values[index];
          return values[index];
        });
        const code = hashGenerate(hashArray.join(","));
        if (dataDictionary[code] >= 1) {
          dataDictionary[code] -= 1;
        } else {
          misMatchData.push(curObject);
        }
        misMatchIndex += 1;
      }
    } else {
      for (const row of sourceData) {
        const code = hashGenerate(Object.values(row).join(","));
        dataDictionary[code] = (dataDictionary[code] || 0) + 1;
      }
      misMatchIndex = 1;
      for (const row of targetData) {
        const code = hashGenerate(Object.values(row).join(","));
        const curObject = { "Serial No": misMatchIndex, ...row };
        if (dataDictionary[code] >= 1) {
          dataDictionary[code] -= 1;
        } else {
          misMatchData.push(curObject);
        }
        misMatchIndex += 1;
      }
    }
    const filename = `csvMissed${source}`;
    const jsonData = JSON.stringify(misMatchData, null, 2);
    fs.writeFileSync(`constants/${filename}`, jsonData, (err) => {
      if (err) {
        return {
          message: "Unable to create the file",
          status: false,
          code: 404
        };
      }
    });
    return {
      message: misMatchData.length === 0 ? "All Records Matched" : null,
      mismatches: misMatchData,
      misMatchFile: filename,
      numberOfRecords: misMatchData.length,
      status: misMatchData.length === 0 ? true : false,
      code: 200
    };
  } catch (error) {
    return {
      message: "fail to compare",
      error: error,
      status: false,
      code: 500
    };
  }
};
