import express from "express";
import { createServer } from "https";
import { readFileSync } from "fs";
import cors from "cors";

const app = express();

app.use(cors());

const options = {
  key: readFileSync("localhost.key"),
  cert: readFileSync("localhost.crt"),
};

createServer(options, app).listen(5173, () => {
  console.log("Server running on https://localhost:5173");
});
