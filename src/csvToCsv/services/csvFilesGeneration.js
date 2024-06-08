import csv from "csvtojson";
import * as fs from "fs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
export const csvToJson = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization;
  let email;
  try {
    const decodedToken = jwt.verify(token, process.env.DECODE_STRING);
    email = decodedToken.email;
  } catch (error) {
    return { message: "Token Verification failed", status: false, code: 401 };
  }
  let csvFileNames = [];
  try {
    if (!req.files || req.files[0]==null || req.files[1]==null) {
      return { message:"please upload the files", status: false, code: 400 };
    } else {
      const files = req.files;
      for (let i = 0; i < files.length; i++) {
        if (files[i].mimetype != "text/csv") {
          return {
            message: "unsupported file format",
            status: false,
            code: 400
          };
        }
        const file = files[i];
        const csvFilePath = "uploads/" + file.filename;
        try {
          const jsonArray = await csv({
            checkType: true,
            defval: null
          }).fromFile(csvFilePath);
          const jsonData = JSON.stringify(jsonArray, null, 2);
          const times = new Date().toISOString().replace(/[:.]/g, "");
          let code = crypto.randomBytes(16).toString("hex");
          const filename =
            i == 0
              ? `sourceCsv${email}${code}${file.filename}${times}.json`
              : `targetCsv${email}${code}${file.filename}${times}.json`;
          csvFileNames.push(filename);
          fs.writeFileSync(`constants/${filename}`, jsonData, (err) => {
            if (err) {
              return {
                message: "Unable to create files",
                status: false,
                error: err,
                code: 404
              };
            }
          });
        } catch (error) {
          return {
            message: "Internal server error",
            status: false,
            error: error,
            code: 500
          };
        }
      }
      return {
        message: "Uploaded Successfully",
        sourceFile: csvFileNames[0],
        targetFile: csvFileNames[1],
        status: true,
        code: 200
      };
    }
  } catch (error) {
    return {
      message: "Internal server error",
      status: false,
      error: error,
      code: 500
    };
  }
};
