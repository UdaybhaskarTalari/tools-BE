import fs from "fs";
const compareLength = (userFileValues, dbDataValues) => {
  if (userFileValues.length == dbDataValues.length) {
    return true;
  }
  return false;
};
/**
 *
 * @param {Empty} req
 * @param {message,headers of column names} res
 */
export const headersForFileToDb = async (req, res) => {
  const { dataDb, dataFile } = req.body;
  let dataFromUserFile, dataFromDb;
  try {
    dataFromUserFile = await JSON.parse(
      fs.readFileSync(`./constants/${dataFile}`, "utf8")
    );
    dataFromDb = await JSON.parse(
      fs.readFileSync(`./constants/${dataDb}`, "utf8")
    );
  } catch (err) {
    return {
      message: "unable to read the file",
      status: "error",
      code: 404
    };
  }
  if (dataFromUserFile.length < 1 || dataFromDb.length < 1) {
    if (dataFromDb.length < 1) {
      return { message: "Database data is empty", status: "   ", code: 200 };
    } else if (dataFromUserFile.length < 1) {
      return { message: "Source file is empty", status: "error", code: 200 };
    }
  } else {
    try {
      const userFileValues = Object.values(dataFromUserFile[0]);
      const userFileKeys = Object.keys(dataFromUserFile[0]);
      const dbDataKeys = Object.keys(dataFromDb[0]);
      const dbDataValues = Object.values(dataFromDb[0]);
      if (!compareLength(userFileValues, dbDataValues)) {
        return {
          message: "Headers length is not matched",
          header1: userFileKeys,
          header2: dbDataKeys,
          status: true,
          code: 200
        };
      } else {
        return {
          message: "Headers length is matched",
          header1: userFileKeys,
          header2: dbDataKeys,
          status: true,
          code: 200
        };
      }
    } catch (err) {
      return {
        message: "something went wrong",
        status: false,
        code: 400
      };
    }
  }
};
