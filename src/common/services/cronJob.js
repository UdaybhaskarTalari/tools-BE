import cron from "node-cron";
import fs from "fs";
import path from "path";
const folderPath1 = "./uploads/";
const folderPath2 = "./constants/";
/**
 * Function to delete files in a folder
 */
const deleteFilesInFolder = (folderPath) => {
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    fs.unlinkSync(path.join(folderPath, file));
  }
};
export const job = cron.schedule("0 23 * * *", () => {
  deleteFilesInFolder(folderPath1);
  deleteFilesInFolder(folderPath2);
});
