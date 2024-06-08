import express from "express";
import bodyParser from "body-parser";
import router from "./router.js";
import cors from "cors";
import dotenv from "dotenv";
import { job } from "./src/common/services/cronJob.js";
import { middleware } from "./src/middleware/middleware.js";
import { generateUrl } from "./src/common/services/oauthUrlGeneration.js";
import { oauthToken } from "./src/common/services/oauthToken.js";
import * as fs from "fs";
import swaggerUi from "swagger-ui-express";
dotenv.config({ path: "./config.env" });
const app = express();
const swagger = JSON.parse(fs.readFileSync("./swagger.json", "utf8"));
process.on("unhandledRejection", (reason, promise) => {
  // You might want to log the error, send alerts, or handle it as needed.
  // Exiting the process might not be necessary depending on your application.
});
// Handling uncaught exceptions globally
process.on("uncaughtException", (error) => {});
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);
const PORT = process.env.SERVER_PORT;
app.get("/test", (req, res) => res.send("server started"));
app.use(bodyParser.json());
app.use("/generatesignin", generateUrl);
app.use("/token", oauthToken);
app.use(middleware);
app.use("/", router);
//eslint-disable-next-line
app.listen(PORT, () => console.log("server connected"));
