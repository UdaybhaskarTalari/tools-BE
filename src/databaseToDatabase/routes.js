import express from "express";
import { connectToDB } from "./controller/dbController.js";
import { compareData } from "./services/compareData.js";
const dbtodbRouter = express.Router();
dbtodbRouter.post("/connect", async (req, res) => {
  try {
    await connectToDB(req, res, true);
  } catch (error) {
    if (error.message.includes("Invalid database credentials for Source")) {
      res.status(400).send({
        message: "Invalid database credentials for Source",
        status: false
      });
    } else if (
      error.message.includes("Invalid database credentials for Target")
    ) {
      res.status(400).send({
        message: "Invalid database credentials for Target",
        status: false
      });
    }
  }
});
dbtodbRouter.post("/compareData", async (req, res) => {
  try {
    await compareData(req, res);
  } catch (error) {
    res.status(400).send({ message: "Internal server error", status: false });
  }
});

export default dbtodbRouter;
