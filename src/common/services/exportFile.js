import { json2csv } from "json-2-csv";
import * as fs from "fs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
export const downloadFile = async (req, res) => {
  const { body } = req;
  const { authorization } = req.headers;
  let email;
  const token = authorization;
  try {
    const decoded = jwt.verify(token, process.env.DECODE_STRING);
    email = decoded.email;
  } catch {
    return res.status(402).send({ message: "Token Error", status: false });
  }
  let mismatch = [];
  let file = "";
  let filename = "";
  if (body.type == "file") {
    file = body.data;
    filename = `download${file}`;
    try {
      mismatch = await JSON.parse(
        fs.readFileSync(`./constants/${file}`, "utf8")
      );
    } catch (err) {
      return res
        .status(404)
        .send({ message: "file not found", status: false, error: err });
    }
  } else {
    file = "dbtodb";
    let hashCode = crypto.randomBytes(16).toString("hex");
    filename = `${file}${email}${hashCode}.csv`;
    mismatch = body.data;
    const destructuredMismatch = mismatch.map((item) => {
      return {
        columnName: item.columnName,
        dataType: item.dataType.type,
        isPrimaryKey: item.dataType.primaryKey
      };
    });
    mismatch = destructuredMismatch;
  }
  try {
    const csv = json2csv(mismatch);
    fs.writeFile(`constants/${filename}`, csv, (error) => {
      if (error) {
        return res.status(404).send({
          message: "unable to create file",
          status: false,
          error: error
        });
      } else {
        const filePath = `constants/${filename}`;
        const fileName = "missingCsvData.csv";
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + fileName
        );
        res.setHeader("Content-Type", "text/csv");
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
      }
    });
  } catch (error) {
    res.status(404).send({ message: "unable to create file", status: false });
  }
};
