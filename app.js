// server.js

const { Worker, isMainThread, workerData } = require("worker_threads");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const dbscripts = require("./Init/dbScriptsRunner");
const { CONNECTION_STRING } = require("./constants");
require("dotenv/config");

const userRouter = require("./routes/user");


//middleware
app.use(cors());
app.options("*", cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(morgan("tiny"));

//Routers
app.use(`/user`, userRouter);

const startServer = () => {
  mongoose
    .connect(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "FinanceAnalyzer",
    })
    .then(() => {
      console.log("Database connection is ready");

      app.listen(workerData.port, () => {
        console.log(`Server is running on port ${workerData.port}`);
      });
    })
    .catch((err) => {
      console.log(err);
    });

  dbscripts.run();
};

if (isMainThread) {
  const numWorkers = 4;
  const workers = [];

  for (let i = 0; i < numWorkers; i++) {
    const port = process.env.PORT;
    const worker = new Worker(__filename, {
      workerData: { port: Number(port) + i },
    });
    workers.push(worker);
  }

  console.log(`Created ${numWorkers} worker threads.`);

  workers.forEach((worker) => {
    worker.on("message", (msg) => {
      console.log(`Worker thread ${worker.threadId} sent a message: ${msg}`);
    });
    worker.on("error", (err) => {
      console.error(
        `Worker thread ${worker.threadId} encountered an error: ${err}`
      );
    });
    worker.on("exit", (code) => {
      console.log(`Worker thread ${worker.threadId} exited with code ${code}.`);
    });
  });
} else {
  startServer();
}
