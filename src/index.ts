import express from "express";
import Bundler from "parcel-bundler";
import path from "path";

const app = express();
const port = 8080 || process.env.PORT;

const bundler = new Bundler(path.join(__dirname, "client/index.html"));

app.use(bundler.middleware());

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
