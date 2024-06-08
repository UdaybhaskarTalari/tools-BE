import csv from "csvtojson";
import XLSX from "xlsx";
import * as fs from "fs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import path from "path";
/**
 * @param {file} req
 * @param {created a json file} res
 * if the file is empty it throws the message called No file is uploaded
 */
export const fileToJson = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization;
  const decodedToken = jwt.verify(token, process.env.DECODE_STRING);
  const email = decodedToken.email;
  try {
    if (req.file == null ) {
      res.status(200).send({ message: "No file is uploaded",status:false });
    } else {
      if (path.extname(req.file.originalname) == ".csv") {
        try {
          if (req.file == null) {
            res
              .status(200)
              .send({ message: "No file is uploaded", status: false });
          } else {
            const csvFilePath = "uploads/" + req.file.filename;
            csv({
              checkType: true,
              defval: null
            })
              .fromFile(csvFilePath)
              .then((jsonObj) => {
                const jsonData = JSON.stringify(jsonObj, null, 2);
                const timesForUserFile = new Date()
                  .toISOString()
                  .replace(/[:.]/g, "");
                const codeForUserCsvFile = crypto
                  .randomBytes(16)
                  .toString("hex");
                const userCsvFile = `userCsv${email}${codeForUserCsvFile}${timesForUserFile}.json`;
                fs.writeFileSync(
                  `constants/${userCsvFile}`,
                  jsonData,
                  (err) => {
                    if (err) {
                      return res.status(200).send({
                        message: "unable to create file",
                        status: false,
                        error: err
                      });
                    }
                  }
                );
                res.status(200).json({
                  message: "File submitted successfully",
                  filename: userCsvFile,
                  status: true
                });
              });
            const jsonArray = await csv().fromFile(csvFilePath);
          }
        } catch (error) {
          res
            .status(500)
            .send({ message: "something went wrong", status: false });
        }
      } else if (path.extname(req.file.originalname) == ".xlsx") {
        const filepath = "uploads/" + req.file.filename;
        const workbook = XLSX.readFile(filepath);
        const sheet_name_list = workbook.SheetNames;
        let jsonPagesArray = [];
        sheet_name_list.forEach(function (sheet) {
          const jsonPage = {
            name: sheet,
            content: XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
              defval: null
            })
          };
          jsonPagesArray.push(jsonPage);
        });
        const jsonData = JSON.stringify(jsonPagesArray[0].content);
        const timesForUserFile = new Date().toISOString().replace(/[:.]/g, "");
        const codeForUserXlsxFile = crypto.randomBytes(16).toString("hex");
        const userCsvFile = `userXLSX${email}${codeForUserXlsxFile}${timesForUserFile}.json`;
        fs.writeFileSync(`constants/${userCsvFile}`, jsonData, (err) => {
          if (err) {
            return res.status(200).send({
              message: "unable to create file",
              status: false,
              error: err
            });
          }
        });
        res.status(200).json({
          message: "File submitted successfully",
          filename: userCsvFile,
          status: true
        });
      } else {
        res
          .status(200)
          .send({ message: "Unsupported file format", status: false });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "something went wrong", status: false });
  }
};
