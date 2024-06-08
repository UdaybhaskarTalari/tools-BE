import fs from "fs";
export const csvHeaders = async (req, res) => {
  const { source, target } = req.body;
  let dataFromSorce, dataFromTarget;
  try {
    try {
      dataFromSorce = await JSON.parse(
        fs.readFileSync(`./constants/${source}`, "utf8")
      );
      dataFromTarget = await JSON.parse(
        fs.readFileSync(`./constants/${target}`, "utf8")
      );
    } catch (error) {
      return {
        message: "Unable to read the file",
        status: "error",
        code: 404
      };
    }
    const sourceKeys = Object.keys(dataFromSorce[0]);
    const targetKeys = Object.keys(dataFromTarget[0]);
    if (sourceKeys.length == targetKeys.length) {
      return {
        message: "Headers length is matched",
        header1: sourceKeys,
        header2: targetKeys,
        status: true,
        code: 200
      };
    } else {
      return {
        message: "Headers length is not matched",
        header1: sourceKeys,
        header2: targetKeys,
        status: true,
        code: 200
      };
    }
  } catch (error) {
    return {
      message: dataFromSorce.length<1?"Source file is empty":"Target file is empty",
      code: 404,
      status: "error"
    };
  }
};
