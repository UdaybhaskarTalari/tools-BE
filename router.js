import express from "express";
import csvRoute from "./src/csvToCsv/routes.js";
import dbtodbRouter from "./src/databaseToDatabase/routes.js";
import fileToDbRoute from "./src/fileToDatabase/routes.js";
import commonRoute from "./src/common/routes/commonRoutes.js";
const router = express.Router();
router.use("/", csvRoute);
router.use("/", fileToDbRoute);
router.use("/", dbtodbRouter);
router.use("/", commonRoute);
router.use("*", (req, res) =>
  res.status(400).send({ message: "route not found", status: false })
);
export default router;
