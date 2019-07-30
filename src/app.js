import winston from "winston";
import express from "express";
import config from "config";

import logging from "./helpers/logging";
import routes from "./routes/index";

const app = express();

logging();
routes(app);

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

export default server;
